import { useState, useEffect, useCallback } from 'react';
import { useMessagesSocket } from './useMessagesSocket';
import { Message } from '../lib/routes/messages/interfaces/message.interface';

interface NotificationMessage {
  id: string;
  content: string;
  sender: string;
  conversationId: string;
  timestamp: Date;
}

interface UnreadNotification {
  conversationId: string;
  messageCount: number;
  timestamp: Date;
}

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<UnreadNotification[]>([]);
  const { socket, isConnected } = useMessagesSocket();

  // Fonction pour ajouter une notification
  const addNotification = useCallback((message: Message, senderName: string) => {
    const notification: NotificationMessage = {
      id: message.id,
      content: message.content,
      sender: senderName,
      conversationId: message.conversationId,
      timestamp: message.timestamp,
    };

    setNotifications(prev => [...prev, notification]);
    
    // Envoyer une notification push si autorisé
    sendPushNotification(notification);
  }, []);

  // Fonction pour ajouter une notification de message non lu
  const addUnreadNotification = useCallback((data: UnreadNotification) => {
    setUnreadNotifications(prev => {
      const existing = prev.find(n => n.conversationId === data.conversationId);
      if (existing) {
        // Mettre à jour le compteur
        return prev.map(n => 
          n.conversationId === data.conversationId 
            ? { ...n, messageCount: n.messageCount + data.messageCount, timestamp: data.timestamp }
            : n
        );
      } else {
        // Ajouter une nouvelle notification
        return [...prev, data];
      }
    });
  }, []);

  // Fonction pour supprimer une notification
  const removeNotification = useCallback((messageId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== messageId));
  }, []);

  // Fonction pour supprimer toutes les notifications d'une conversation
  const removeConversationNotifications = useCallback((conversationId: string) => {
    setNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
    setUnreadNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
  }, []);

  // Écouter les nouveaux messages pour créer des notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: Message) => {
      // Ne pas créer de notification si le message est de l'utilisateur actuel
      if (message.isMe) return;

      // Vérifier si la page est visible (pour ne pas notifier si l'utilisateur est sur la page)
      if (document.visibilityState === 'visible') {
        // Vérifier si l'utilisateur est sur la page des messages
        const isOnMessagesPage = window.location.pathname.startsWith('/messages');
        if (isOnMessagesPage) return;
      }

      // Créer une notification
      // Note: Il faudrait récupérer le nom de l'expéditeur depuis les données de conversation
      addNotification(message, 'Utilisateur');
    };

    const handleUnreadMessage = (data: UnreadNotification) => {
      console.log('🔔 Notification de message non lu reçue dans useMessageNotifications:', data);
      
      // Vérifier si l'utilisateur n'est pas sur la page des messages
      const isOnMessagesPage = window.location.pathname.startsWith('/messages');
      console.log('📍 Utilisateur sur la page des messages:', isOnMessagesPage);
      
      if (!isOnMessagesPage) {
        console.log('✅ Ajout de la notification (utilisateur pas sur la page messages)');
        addUnreadNotification(data);
        
        // Envoyer une notification push
        if ('Notification' in window && Notification.permission === 'granted') {
          console.log('📱 Envoi de notification push');
          new Notification('Nouveau message', {
            body: `Vous avez ${data.messageCount} nouveau(x) message(s)`,
            icon: '/logo.svg',
            tag: data.conversationId,
          });
        } else {
          console.log('⚠️ Notifications push non autorisées ou non supportées');
        }
      } else {
        console.log('⏭️ Notification ignorée (utilisateur sur la page messages)');
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('unreadMessage', handleUnreadMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('unreadMessage', handleUnreadMessage);
    };
  }, [socket, isConnected, addNotification, addUnreadNotification]);

  // Demander la permission pour les notifications push
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Envoyer une notification push native
  const sendPushNotification = useCallback((message: NotificationMessage) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nouveau message de ${message.sender}`, {
        body: message.content,
        icon: '/logo.svg', // Remplacer par le chemin de votre icône
        tag: message.conversationId, // Pour éviter les doublons
      });
    }
  }, []);

  return {
    notifications,
    unreadNotifications,
    addNotification,
    addUnreadNotification,
    removeNotification,
    removeConversationNotifications,
    requestNotificationPermission,
    sendPushNotification,
  };
}; 