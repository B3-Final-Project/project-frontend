"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./SocketProvider";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Conversation, NewMatchData } from "@/lib/routes/messages/interfaces/message.interface";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import { getCurrentUserIdFromToken } from "@/lib/utils/user-utils";

export function GlobalMessageNotifications({ children }: { readonly children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addNotification, notificationState } = useMessageNotifications();

  // Fonction pour créer une notification native de match
  const createMatchNotification = (data: NewMatchData, matchName: string, ageText: string) => {
    const matchNotification = new Notification('🎉 Nouveau match !', {
      body: `Vous avez matché avec ${matchName}${ageText} ! Commencez à discuter maintenant.`,
      icon: '/favicon.ico',
      tag: 'new-match',
      requireInteraction: true,
      silent: !notificationState.settings?.sound,
      ...(notificationState.settings?.vibration && { vibrate: [200, 100, 200] }),
    });

    matchNotification.onclick = () => {
      matchNotification.close();
      window.focus();
      router.push(`/messages/${data.conversation.id}`);
    };
  };

  // Fonction pour créer un toast de match
  const createMatchToast = (data: NewMatchData, matchName: string, ageText: string) => {
    const toastInstance = toast({
      title: "🎉 Nouveau match !",
      description: `Vous avez matché avec ${matchName}${ageText} ! Commencez à discuter maintenant.`,
      variant: "default",
      onClick: () => {
        router.push(`/messages/${data.conversation.id}`);
        toastInstance.dismiss();
      },
    });
  };

  // Fonction pour créer une notification native de suppression
  const createDeleteNotification = (message: string) => {
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
  };

  // Fonction pour créer un toast de suppression
  const createDeleteToast = (message: string) => {
    toast({
      title: "Conversation supprimée",
      description: message,
      variant: "destructive",
    });
  };

  // Fonction pour gérer le clic sur un toast de nouveau message
  const handleNewMessageToastClick = (message: Message, toastInstance: any) => {
    // Rediriger vers la conversation
    if (message.conversationId) {
      router.push(`/messages/${message.conversationId}`);
    }
    // Fermer le toast après l'action
    toastInstance.dismiss();
  };

  // Fonction pour mettre à jour le cache des conversations avec un nouveau match
  const updateConversationsCacheWithMatch = (conversation: Conversation) => {
    return (oldData: Conversation[] | undefined) => {
      if (!oldData) return [conversation];
      if (oldData.some(conv => conv.id === conversation.id)) {
        return oldData;
      }
      return [conversation, ...oldData];
    };
  };

  // Fonction pour mettre à jour le cache des conversations en supprimant une conversation
  const updateConversationsCacheWithDeletion = (conversationId: string) => {
    return (oldData: Conversation[] | undefined) => {
      if (!oldData) return [];
      return oldData.filter(conv => conv.id !== conversationId);
    };
  };

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
          description: message.content?.slice(0, 80) ?? '',
          variant: "default",
          onClick: () => handleNewMessageToastClick(message, toastInstance),
        });
      }
    };

    // Écouter les nouveaux matches
    const handleNewMatch = (data: NewMatchData) => {
      console.log('Nouveau match', data);
      
      // Mettre à jour le cache des conversations
      queryClient.setQueryData(['conversations'], updateConversationsCacheWithMatch(data.conversation));

      // Créer le message du toast avec les informations enrichies
      const matchName = data.matchedWith.name;
      const matchAge = data.matchedWith.age;
      const ageText = matchAge ? `, ${matchAge} ans` : '';
      
      // Notification native pour les nouveaux matches
      if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
        createMatchNotification(data, matchName, ageText);
      } else {
        createMatchToast(data, matchName, ageText);
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
      queryClient.setQueryData(['conversations'], updateConversationsCacheWithDeletion(data.conversationId));
      
      if (currentUserId && data.deletedBy !== currentUserId) {
        // Créer le message avec le nom de l'autre utilisateur si disponible
        const otherUserName = deletedConversation?.name ?? 'Quelqu\'un';

        const message = deletedConversation?.name ? `${otherUserName} a supprimé cette conversation.` : 'Vous avez supprimé cette conversation.';
        
        // Notification native pour la suppression de conversation
        if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
          createDeleteNotification(message);
        } else {
          createDeleteToast(message);
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
        description: data.message ?? "Une erreur s'est produite. Veuillez réessayer.",
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

 