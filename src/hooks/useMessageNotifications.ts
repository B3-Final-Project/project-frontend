import { useState, useEffect, useCallback } from 'react';
import { NotificationPermission, NotificationAPI } from '../lib/utils/notification-utils';
import { useMessagesSocket } from './useMessagesSocket';
import { Message } from '../lib/routes/messages/interfaces/message.interface';

interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  conversationId: string;
  senderName: string;
}

interface UnreadNotification {
  conversationId: string;
  messageCount: number;
  timestamp: Date;
}

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<UnreadNotification[]>([]);
  const { isConnected } = useMessagesSocket();

  // Fonction pour envoyer une notification push
  const sendPushNotification = useCallback((notification: NotificationMessage) => {
    if (NotificationAPI.NOTIFICATION in window && Notification.permission === NotificationPermission.GRANTED) {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: notification.conversationId,
      });
    }
  }, []);

  // Fonction pour ajouter une notification
  const addNotification = useCallback((message: Message, senderName: string) => {
    const notification: NotificationMessage = {
      id: message.id ?? `notification-${Date.now()}`,
      title: `Nouveau message de ${senderName}`,
      body: message.content,
      timestamp: new Date(),
      conversationId: message.conversationId,
      senderName,
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Garder max 10 notifications

    // Envoyer une notification push si autorisé
    sendPushNotification(notification);
  }, [sendPushNotification]);

  // Fonction pour ajouter une notification de message non lu
  const addUnreadNotification = useCallback((conversationId: string, messageCount: number = 1) => {
    setUnreadNotifications(prev => {
      const existing = prev.find(n => n.conversationId === conversationId);
      if (existing) {
        return prev.map(n => 
          n.conversationId === conversationId 
            ? { ...n, messageCount: n.messageCount + messageCount }
            : n
        );
      }
      return [...prev, { conversationId, messageCount, timestamp: new Date() }];
    });
  }, []);

  // Fonction pour supprimer les notifications d'une conversation
  const removeConversationNotifications = useCallback((conversationId: string) => {
    setNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
    setUnreadNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
  }, []);

  // Fonction pour demander la permission de notification
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!(NotificationAPI.NOTIFICATION in window)) {
      console.warn('Notifications non supportées par ce navigateur');
      return false;
    }

    if (Notification.permission === NotificationPermission.GRANTED) {
      return true;
    }

    if (Notification.permission === NotificationPermission.DENIED) {
      console.warn('Permission de notification refusée');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === NotificationPermission.GRANTED;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }, []);

  // Effet pour écouter les nouveaux messages via WebSocket
  useEffect(() => {
    if (!isConnected) return;

    // Les listeners WebSocket sont gérés dans useMessagesSocket
    // Ici on peut ajouter des listeners spécifiques aux notifications si nécessaire
  }, [isConnected]);

  return {
    notifications,
    unreadNotifications,
    addNotification,
    addUnreadNotification,
    removeConversationNotifications,
    requestNotificationPermission,
  };
}; 