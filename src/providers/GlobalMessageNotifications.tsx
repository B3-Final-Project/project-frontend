"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./SocketProvider";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Conversation, NewMatchData } from "@/lib/routes/messages/interfaces/message.interface";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

export function GlobalMessageNotifications({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { toast, dismiss } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addNotification, notificationState } = useMessageNotifications();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // ===== GESTION DES NOTIFICATIONS GLOBALES =====
    // Ce composant gère toutes les notifications toast pour les événements socket
    // Les mises à jour de cache sont gérées dans useMessagesSocket.ts
    
    // Écouter les nouveaux messages
    const handleNewMessage = (message: Message) => {
      const currentUserId = getCurrentUserIdFromToken();
      const isMe = Boolean(currentUserId && message.sender_id === currentUserId);
      
      // Ne pas afficher de toast pour ses propres messages
      if (isMe) return;

      console.log('Nouveau message', message);
      
      // Ajouter une notification native si autorisée
      if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
        addNotification(message, message.senderName ?? 'Quelqu\'un');
      }

      // Afficher un toast seulement si l'utilisateur n'a pas activé les notifications natives
      // ou si les notifications natives sont désactivées
      if (notificationState.permission !== 'granted' || !notificationState.settings?.enabled) {
        const toastInstance = toast({
          title: `Nouveau message de ${message.senderName ?? 'Quelqu\'un'}`,
          description: message.content?.slice(0, 80) || '',
          variant: "default",
          onClick: () => {
            // Rediriger vers la conversation
            if (message.conversationId) {
              router.push(`/messages/${message.conversationId}`);
            }
            // Fermer le toast après l'action
            toastInstance.dismiss();
          },
        });
      }
    };

    // Écouter les nouveaux matches
    const handleNewMatch = (data: NewMatchData) => {
      console.log('Nouveau match', data);
      
      // Mettre à jour le cache des conversations
      queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
        if (!oldData) return [data.conversation];
        if (oldData.some(conv => conv.id === data.conversation.id)) {
          return oldData;
        }
        return [data.conversation, ...oldData];
      });

      // Créer le message du toast avec les informations enrichies
      const matchName = data.matchedWith.name;
      const matchAge = data.matchedWith.age;
      const ageText = matchAge ? `, ${matchAge} ans` : '';
      
      // Notification native pour les nouveaux matches
      if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
        const matchNotification = new Notification('🎉 Nouveau match !', {
          body: `Vous avez matché avec ${matchName}${ageText} ! Commencez à discuter maintenant.`,
          icon: '/favicon.ico',
          tag: 'new-match',
          requireInteraction: true,
          silent: !notificationState.settings?.sound,
          vibrate: notificationState.settings?.vibration ? [200, 100, 200] : undefined,
        });

        matchNotification.onclick = () => {
          matchNotification.close();
          window.focus();
          router.push(`/messages/${data.conversation.id}`);
        };
      } else {
        // Fallback vers le toast si les notifications natives ne sont pas disponibles
        const toastInstance = toast({
          title: "🎉 Nouveau match !",
          description: `Vous avez matché avec ${matchName}${ageText} ! Commencez à discuter maintenant.`,
          variant: "default",
          onClick: () => {
            // Rediriger vers la conversation du match
            router.push(`/messages/${data.conversation.id}`);
            // Fermer le toast après l'action
            toastInstance.dismiss();
          },
        });
      }
    };

    // Écouter les suppressions de conversation
    const handleConversationDeleted = (data: { conversationId: string; deletedBy: string; timestamp: Date }) => {
      const currentUserId = getCurrentUserIdFromToken();
      
      console.log('Conversation supprimée', data.conversationId);
      
      // Récupérer les informations de la conversation supprimée AVANT de la supprimer du cache
      const conversations = queryClient.getQueryData(['conversations']) as Conversation[] | undefined;
      const deletedConversation = conversations?.find(conv => conv.id === data.conversationId);
      
      // Mettre à jour le cache des conversations - retirer la conversation supprimée
      queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(conv => conv.id !== data.conversationId);
      });
      
      if (currentUserId && data.deletedBy !== currentUserId) {
        // Créer le message avec le nom de l'autre utilisateur si disponible
        const otherUserName = deletedConversation?.name || 'Quelqu\'un';

        const message = deletedConversation?.name ? `${otherUserName} a supprimé cette conversation.` : 'Vous avez supprimé cette conversation.';
        
        // Notification native pour la suppression de conversation
        if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
          const deleteNotification = new Notification('Conversation supprimée', {
            body: message,
            icon: '/favicon.ico',
            tag: 'conversation-deleted',
            silent: !notificationState.settings?.sound,
          });

          deleteNotification.onclick = () => {
            deleteNotification.close();
            window.focus();
          };
        } else {
          // Fallback vers le toast
          toast({
            title: "Conversation supprimée",
            description: message,
            variant: "destructive",
          });
        }
      }
    };

    // Écouter les actions de match réussies
    const handleMatchAction = (data: { type: 'like' | 'pass'; matchId: string; isMatch?: boolean }) => {
      console.log('Action de match', data);
      
      if (data.type === 'like') {
        if (data.isMatch) {
          // Le match sera géré par l'événement 'newMatch'
          return;
        } else {
          toast({
            title: "Like envoyé ! 💙",
            description: "Votre like a été envoyé. En attente d'une réponse...",
            variant: "default",
          });
        }
      } else if (data.type === 'pass') {
        toast({
          title: "Profil passé",
          description: "Ce profil a été passé.",
          variant: "default",
        });
      }
    };

    // Écouter les erreurs de match
    const handleMatchError = (data: { type: string; message: string; matchId?: string }) => {
      console.error('Erreur de match', data);
      
      toast({
        title: "Erreur lors du match",
        description: data.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    };

    // Ajouter les listeners
    socket.on('newMessage', handleNewMessage);
    socket.on('newMatch', handleNewMatch);
    socket.on('conversationDeleted', handleConversationDeleted);
    socket.on('matchAction', handleMatchAction);
    socket.on('matchError', handleMatchError);

    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newMatch', handleNewMatch);
      socket.off('conversationDeleted', handleConversationDeleted);
      socket.off('matchAction', handleMatchAction);
      socket.off('matchError', handleMatchError);
    };
  }, [socket, isConnected, toast, queryClient, router, addNotification, notificationState]);

  return <>{children}</>;
}

// Fonction utilitaire pour récupérer l'ID utilisateur depuis le token
function getCurrentUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    // Scan all sessionStorage keys for any oidc.user entry
    const keys = Object.keys(sessionStorage);
    for (const key of keys) {
      if (key.startsWith("oidc.user:")) {
        const userJson = sessionStorage.getItem(key);
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user?.access_token) {
            // Décoder le token JWT pour extraire l'ID utilisateur
            const payload = JSON.parse(atob(user.access_token.split('.')[1]));
            return payload.sub ?? payload.username;
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
  }

  return null;
} 