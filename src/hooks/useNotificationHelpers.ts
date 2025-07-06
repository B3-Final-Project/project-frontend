/**
 * Hook personnalisé pour la gestion des notifications
 */

import { useMessageNotifications } from './useMessageNotifications';
import { NotificationPermission } from '../lib/utils/notification-utils';
import { NOTIFICATION_MESSAGES } from '../lib/constants/messages';

export function useNotificationHelpers() {
    const { 
        notificationState,
        requestNotificationPermission,
        openNotificationSettings
    } = useMessageNotifications();

    /**
     * Obtient le statut des notifications avec les informations d'affichage
     */
    const getNotificationStatus = () => {
        if (!notificationState.isSupported) {
            return { 
                text: 'Non supportées', 
                color: 'text-gray-500', 
                icon: 'BellOff' 
            };
        }
        
        switch (notificationState.permission) {
            case NotificationPermission.GRANTED:
                return { 
                    text: 'Activées', 
                    color: 'text-green-600', 
                    icon: 'Bell' 
                };
            case NotificationPermission.DENIED:
                return { 
                    text: 'Refusées', 
                    color: 'text-red-600', 
                    icon: 'BellOff' 
                };
            case NotificationPermission.DEFAULT:
                return { 
                    text: 'Non demandées', 
                    color: 'text-yellow-600', 
                    icon: 'Bell' 
                };
            default:
                return { 
                    text: 'Inconnu', 
                    color: 'text-gray-500', 
                    icon: 'BellOff' 
                };
        }
    };

    /**
     * Demande la permission de notification avec gestion d'erreur
     */
    const handleRequestNotificationPermission = async () => {
        const granted = await requestNotificationPermission();
        if (!granted) {
            // Si la permission est refusée, proposer d'ouvrir les paramètres
            setTimeout(() => {
                if (confirm(NOTIFICATION_MESSAGES.PERMISSION_REQUEST)) {
                    openNotificationSettings();
                }
            }, 1000);
        }
        return granted;
    };

    /**
     * Vérifie si les notifications doivent être demandées
     */
    const shouldRequestPermission = () => {
        return notificationState.permission === NotificationPermission.DEFAULT && 
               notificationState.isSupported;
    };

    return {
        notificationState,
        getNotificationStatus,
        handleRequestNotificationPermission,
        shouldRequestPermission,
        openNotificationSettings
    };
} 