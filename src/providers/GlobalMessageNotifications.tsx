"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "./SocketProvider";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Conversation, NewMatchData } from "@/lib/routes/messages/interfaces/message.interface";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import { getCurrentUserIdFromToken } from "@/lib/utils/user-utils";

export function GlobalMessageNotifications({ children }: { readonly children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addNotification, notificationState } = useMessageNotifications();



  // Fonction pour gérer le clic sur un toast de nouveau message
  const handleNewMessageToastClick = useCallback((message: Message, toastInstance: { dismiss: () => void }) => {
    // Rediriger vers la conversation
    if (message.conversationId) {
      router.push(`/messages/${message.conversationId}`);
    }
    // Fermer le toast après l'action
    toastInstance.dismiss();
  }, [router]);

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

    // Écouter les nouveaux messages
    const handleNewMessage = (message: Message) => {
      const currentUserId = getCurrentUserIdFromToken();
      const isMe = Boolean(currentUserId && message.sender_id === currentUserId);
      
      if (isMe) return;
      
      const currentPath = window.location.pathname;
      const conversationPath = `/messages/${message.conversationId}`;
      const isOnConversationPage = currentPath === conversationPath;
      
      if (isOnConversationPage) return;
      
      if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
        addNotification(message, message.senderName ?? 'Quelqu\'un');
      }

      const toastInstance = toast({
        title: `Nouveau message de ${message.senderName ?? 'Quelqu\'un'}`,
        description: message.content?.slice(0, 80) ?? '',
        variant: "default",
        onClick: () => handleNewMessageToastClick(message, toastInstance),
      });
    };

    // Écouter les nouveaux matches
    const handleNewMatch = (data: NewMatchData) => {
      queryClient.setQueryData(['conversations'], updateConversationsCacheWithMatch(data.conversation));

      const matchName = data.matchedWith.name;
      const matchAge = data.matchedWith.age;
      const ageText = matchAge ? `, ${matchAge} ans` : '';
      
      if (notificationState.permission === 'granted' && notificationState.settings?.enabled) {
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
      }
      
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

    // Écouter les suppressions de conversation
    const handleConversationDeleted = (data: { conversationId: string; deletedBy: string; timestamp: Date }) => {
      const currentUserId = getCurrentUserIdFromToken();
      
      const conversations = queryClient.getQueryData(['conversations']) as Conversation[] | undefined;
      const deletedConversation = conversations?.find(conv => conv.id === data.conversationId);
      
      queryClient.setQueryData(['conversations'], updateConversationsCacheWithDeletion(data.conversationId));
      
      if (currentUserId && data.deletedBy === currentUserId) return;
      
      if (currentUserId && data.deletedBy !== currentUserId) {
        const otherUserName = deletedConversation?.name ?? 'Quelqu\'un';
        const message = deletedConversation?.name ? `${otherUserName} a supprimé cette conversation.` : 'Vous avez supprimé cette conversation.';
        
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
        }
        
        toast({
          title: "Conversation supprimée",
          description: message,
          variant: "destructive",
        });
      }
    };

    // Écouter les actions de match réussies
    const handleMatchAction = (data: { type: 'like' | 'pass'; matchId: string; isMatch?: boolean }) => {
      if (data.type === 'like') {
        if (data.isMatch) return;
        toast({
          title: "Like envoyé ! 💙",
          description: "Votre like a été envoyé. En attente d'une réponse...",
          variant: "default",
        });
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
      toast({
        title: "Erreur lors du match",
        description: data.message ?? "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newMatch', handleNewMatch);
    socket.on('conversationDeleted', handleConversationDeleted);
    socket.on('matchAction', handleMatchAction);
    socket.on('matchError', handleMatchError);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newMatch', handleNewMatch);
      socket.off('conversationDeleted', handleConversationDeleted);
      socket.off('matchAction', handleMatchAction);
      socket.off('matchError', handleMatchError);
    };
  }, [socket, isConnected, queryClient, router, addNotification, notificationState, handleNewMessageToastClick]);

  return <>{children}</>;
}

 