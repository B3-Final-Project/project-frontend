'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationItem from './ConversationItem';
import { LoadingState } from './LoadingState';
import { NoConversationsState } from './NoConversationsState';
import { useConversations } from '../../hooks/react-query/messages';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';
import { NotificationSettings } from '../NotificationSettings';
import { Button } from '../ui/button';
import { Bell, BellOff, Settings } from 'lucide-react';
import { NotificationPermission } from '../../lib/utils/notification-utils';

export default function MessagesList() {
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    
    // Hooks pour les données et sockets
    const { data: conversations = [], isLoading } = useConversations();
    const { isUserOnline } = useMessagesSocket();
    const { 
        unreadNotifications, 
        removeConversationNotifications, 
        notificationState,
        requestNotificationPermission,
        openNotificationSettings
    } = useMessageNotifications();

    // Écouter les clics sur les notifications pour la navigation
    useEffect(() => {
        const handleNotificationClick = (event: CustomEvent) => {
            const { conversationId } = event.detail;
            if (conversationId) {
                handleConversationSelect(conversationId);
            }
        };

        window.addEventListener('notification-click', handleNotificationClick as EventListener);
        
        return () => {
            window.removeEventListener('notification-click', handleNotificationClick as EventListener);
        };
    }, []);

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversation(conversationId);
        // Supprimer les notifications de cette conversation
        removeConversationNotifications(conversationId);
        // Rediriger vers la page de conversation spécifique
        router.push(`/messages/${conversationId}`);
    };

    const handleConversationCreated = (conversationId: string) => {
        // Rediriger vers la nouvelle conversation
        handleConversationSelect(conversationId);
    };

    const handleRequestNotificationPermission = async () => {
        const granted = await requestNotificationPermission();
        if (!granted) {
            // Si la permission est refusée, proposer d'ouvrir les paramètres
            setTimeout(() => {
                if (confirm('Voulez-vous ouvrir les paramètres de notification du navigateur ?')) {
                    openNotificationSettings();
                }
            }, 1000);
        }
    };

    // Fonction pour obtenir le nombre de messages non lus pour une conversation
    const getUnreadCount = (conversationId: string) => {
        const notification = unreadNotifications.find(n => n.conversationId === conversationId);
        return notification ? notification.messageCount : 0;
    };

    // Fonction pour vérifier si l'autre utilisateur est en ligne
    const isOtherUserOnline = (conversation: { otherUserId?: string }) => {
        if (!conversation.otherUserId) return false;
        return isUserOnline(conversation.otherUserId);
    };

    // Fonction pour obtenir le statut des notifications
    const getNotificationStatus = () => {
        if (!notificationState.isSupported) {
            return { text: 'Non supportées', color: 'text-gray-500', icon: BellOff };
        }
        
        switch (notificationState.permission) {
            case NotificationPermission.GRANTED:
                return { text: 'Activées', color: 'text-green-600', icon: Bell };
            case NotificationPermission.DENIED:
                return { text: 'Refusées', color: 'text-red-600', icon: BellOff };
            case NotificationPermission.DEFAULT:
                return { text: 'Non demandées', color: 'text-yellow-600', icon: Bell };
            default:
                return { text: 'Inconnu', color: 'text-gray-500', icon: BellOff };
        }
    };

    const notificationStatus = getNotificationStatus();
    const StatusIcon = notificationStatus.icon;

    // Préparer le contenu de la liste des conversations
    let conversationListContent;
    if (isLoading) {
        conversationListContent = (
            <div className="flex items-center justify-center">
                <LoadingState message="Chargement des conversations..." size="lg" />
            </div>
        );
    } else if (conversations.length === 0) {
        conversationListContent = (
            <div className="flex h-full items-center justify-center">
                <NoConversationsState />
            </div>
        );
    } else {
        conversationListContent = (
            <div className="divide-y divide-gray-100">
                {conversations.map((conversation) => {
                    const isOnline = isOtherUserOnline(conversation);
                    const unreadCount = getUnreadCount(conversation.id);
                    
                    return (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={selectedConversation === conversation.id}
                            isExpanded={true}
                            onClick={() => handleConversationSelect(conversation.id)}
                            isOnline={isOnline}
                            unreadCount={unreadCount}
                        />
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-200 p-3 sm:p-4 bg-white bg-opacity-50">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    
                    {/* Bouton des paramètres de notification */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                        className="flex items-center gap-2"
                    >
                        <StatusIcon className={`w-4 h-4 ${notificationStatus.color}`} />
                        <span className="hidden sm:inline text-sm">{notificationStatus.text}</span>
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>

                {/* Section des paramètres de notification */}
                {showNotificationSettings && (
                    <div className="mt-4">
                        <NotificationSettings />
                    </div>
                )}

                {/* Demande rapide de permission si non demandée */}
                {notificationState.permission === NotificationPermission.DEFAULT && 
                 notificationState.isSupported && 
                 !showNotificationSettings && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">
                                    Activez les notifications pour ne manquer aucun message
                                </span>
                            </div>
                            <Button onClick={handleRequestNotificationPermission} size="sm" variant="outline">
                                Activer
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-0">
                {conversationListContent}
            </div>
        </div>
    );
} 