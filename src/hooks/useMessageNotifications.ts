import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  NotificationPermission, 
  NotificationOptions,
  NotificationState,
  NOTIFICATION_CONFIG,
  isNotificationSupported,
  getNotificationPermission,
  formatNotificationContent,
  createNotificationTag,
  handleNotificationError
} from '../lib/utils/notification-utils';
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
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: NotificationPermission.DEFAULT,
    isSupported: false,
    settings: {
      enabled: true,
      sound: true,
      vibration: true,
      showPreview: true,
    }
  });
  
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser l'état des notifications au chargement
  useEffect(() => {
    const initializeNotifications = () => {
      const supported = isNotificationSupported();
      const permission = getNotificationPermission();
      
      setNotificationState(prev => ({
        ...prev,
        isSupported: supported,
        permission: permission,
      }));

      // Charger les paramètres depuis le localStorage
      try {
        const savedSettings = localStorage.getItem('notification-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setNotificationState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...settings }
          }));
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des paramètres de notification:', error);
      }
    };

    initializeNotifications();
  }, []);

  // Sauvegarder les paramètres dans le localStorage
  const saveNotificationSettings = useCallback((settings: Partial<NotificationState['settings']>) => {
    try {
      const currentSettings = notificationState.settings;
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem('notification-settings', JSON.stringify(newSettings));
      setNotificationState(prev => ({
        ...prev,
        settings: newSettings
      }));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des paramètres:', error);
    }
  }, [notificationState.settings]);

  // Fonction pour envoyer une notification push native
  const sendPushNotification = useCallback((notification: NotificationMessage) => {
    if (!notificationState.isSupported || notificationState.permission !== NotificationPermission.GRANTED) {
      return;
    }

    if (!notificationState.settings?.enabled) {
      return;
    }

    try {
      const { title, body } = formatNotificationContent(notification.title, notification.body);
      
      const options: NotificationOptions = {
        title,
        body: notificationState.settings.showPreview ? body : 'Nouveau message reçu',
        icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
        badge: NOTIFICATION_CONFIG.DEFAULT_BADGE,
        tag: createNotificationTag('message', notification.conversationId),
        data: {
          conversationId: notification.conversationId,
          messageId: notification.id,
          type: 'new-message'
        },
        requireInteraction: false,
        silent: !notificationState.settings.sound,
        vibrate: notificationState.settings.vibration ? NOTIFICATION_CONFIG.VIBRATION_PATTERN : undefined,
        timestamp: notification.timestamp.getTime(),
      };

      const nativeNotification = new Notification(options.title, options);

      // Gérer les événements de la notification
      nativeNotification.onclick = () => {
        // Fermer la notification
        nativeNotification.close();
        
        // Rediriger vers la conversation (sera géré par le composant parent)
        window.focus();
        
        // Émettre un événement personnalisé pour la navigation
        window.dispatchEvent(new CustomEvent('notification-click', {
          detail: {
            conversationId: notification.conversationId,
            messageId: notification.id
          }
        }));
      };

      nativeNotification.onclose = () => {
        console.log('Notification fermée:', notification.id);
      };

      // Auto-fermeture après 5 secondes
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      notificationTimeoutRef.current = setTimeout(() => {
        nativeNotification.close();
      }, 5000);

    } catch (error) {
      handleNotificationError(error, 'sendPushNotification');
    }
  }, [notificationState]);

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
    if (!notificationState.isSupported) {
      console.warn('Notifications non supportées par ce navigateur');
      return false;
    }

    if (notificationState.permission === NotificationPermission.GRANTED) {
      return true;
    }

    if (notificationState.permission === NotificationPermission.DENIED) {
      console.warn('Permission de notification refusée');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === NotificationPermission.GRANTED;
      
      setNotificationState(prev => ({
        ...prev,
        permission: permission,
        lastRequested: new Date()
      }));

      if (granted) {
        // Envoyer une notification de test
        const testNotification = new Notification('Notifications activées ! 🎉', {
          body: 'Vous recevrez maintenant des notifications pour les nouveaux messages.',
          icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
          tag: 'test-notification',
          silent: true
        });

        setTimeout(() => testNotification.close(), 3000);
      }

      return granted;
    } catch (error) {
      handleNotificationError(error, 'requestNotificationPermission');
      return false;
    }
  }, [notificationState.isSupported, notificationState.permission]);

  // Fonction pour ouvrir les paramètres de notification du navigateur
  const openNotificationSettings = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // Essayer d'ouvrir les paramètres de notification
      if ('serviceWorker' in navigator && 'permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' as PermissionName }).then((permission) => {
          console.log('État actuel des permissions:', permission.state);
        });
      }
      
      // Afficher un message d'aide
      alert('Pour activer les notifications, veuillez :\n\n1. Cliquer sur l\'icône de cadenas dans la barre d\'adresse\n2. Autoriser les notifications\n3. Recharger la page');
    }
  }, []);

  // Fonction pour tester les notifications
  const testNotification = useCallback(() => {
    if (notificationState.permission === NotificationPermission.GRANTED && notificationState.settings?.enabled) {
      try {
        const testNotification = new Notification('Test de notification', {
          body: 'Ceci est un test pour vérifier que les notifications fonctionnent correctement.',
          icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
          tag: 'test-notification',
          requireInteraction: true,
          silent: !notificationState.settings?.sound,
        });

        testNotification.onclick = () => {
          testNotification.close();
          window.focus();
        };

        console.log('✅ Notification de test envoyée avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de la notification de test:', error);
        handleNotificationError(error, 'testNotification');
      }
    } else {
      console.warn('⚠️ Notifications non autorisées ou désactivées');
      if (notificationState.permission !== NotificationPermission.GRANTED) {
        alert('Veuillez d\'abord autoriser les notifications dans votre navigateur.');
      } else if (!notificationState.settings?.enabled) {
        alert('Veuillez d\'abord activer les notifications dans les paramètres.');
      }
    }
  }, [notificationState.permission, notificationState.settings]);

  // Cleanup des timeouts
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  return {
    notifications,
    unreadNotifications,
    notificationState,
    addNotification,
    addUnreadNotification,
    removeConversationNotifications,
    requestNotificationPermission,
    openNotificationSettings,
    testNotification,
    saveNotificationSettings,
  };
}; 