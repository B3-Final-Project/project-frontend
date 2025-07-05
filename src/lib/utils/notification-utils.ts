export enum NotificationPermission {
  GRANTED = 'granted',
  DENIED = 'denied',
  DEFAULT = 'default'
}

export enum NotificationAPI {
  NOTIFICATION = 'Notification'
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: unknown;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: NotificationAction[];
  timestamp?: number;
  [key: string]: unknown; // Pour permettre les propriétés supplémentaires
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  lastRequested?: Date;
  settings: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    showPreview: boolean;
  };
}

// Constantes pour les notifications
export const NOTIFICATION_CONFIG = {
  DEFAULT_ICON: '/favicon.ico',
  DEFAULT_BADGE: '/favicon.ico',
  VIBRATION_PATTERN: [200, 100, 200] as number[],
  MAX_TITLE_LENGTH: 50,
  MAX_BODY_LENGTH: 150,
  TAG_PREFIX: 'app-notification-',
} as const;

// Fonction utilitaire pour vérifier le support des notifications
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Fonction utilitaire pour obtenir l'état actuel des permissions
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return NotificationPermission.DENIED;
  }
  return Notification.permission as NotificationPermission;
};

// Fonction utilitaire pour formater le contenu des notifications
export const formatNotificationContent = (title: string, body: string) => {
  return {
    title: title.length > NOTIFICATION_CONFIG.MAX_TITLE_LENGTH 
      ? title.substring(0, NOTIFICATION_CONFIG.MAX_TITLE_LENGTH) + '...'
      : title,
    body: body.length > NOTIFICATION_CONFIG.MAX_BODY_LENGTH
      ? body.substring(0, NOTIFICATION_CONFIG.MAX_BODY_LENGTH) + '...'
      : body,
  };
};

// Fonction utilitaire pour créer un tag unique
export const createNotificationTag = (type: string, id: string): string => {
  return `${NOTIFICATION_CONFIG.TAG_PREFIX}${type}-${id}`;
};

// Fonction utilitaire pour gérer les erreurs de notification
export const handleNotificationError = (error: Error, context: string) => {
  console.error(`Erreur de notification (${context}):`, error);
  
  // Log spécifique selon le type d'erreur
  if (error.name === 'NotAllowedError') {
    console.warn('Permission de notification refusée par l\'utilisateur');
  } else if (error.name === 'NotSupportedError') {
    console.warn('Notifications non supportées par ce navigateur');
  } else if (error.name === 'SecurityError') {
    console.warn('Erreur de sécurité - contexte non sécurisé requis');
  }
}; 