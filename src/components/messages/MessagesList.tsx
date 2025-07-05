'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationItem from './ConversationItem';
import { StatusStates } from '../ui/status-states';
import { useConversations } from '../../hooks/react-query/messages';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers';
import { NotificationSettings } from '../NotificationSettings';
import { Button } from '../ui/button';
import { Bell, BellOff, Settings } from 'lucide-react';
import { FLEX_CLASSES } from '../../lib/utils/css-utils';
import { NOTIFICATION_MESSAGES, UI_TEXTS } from '../../lib/constants/messages';

export default function MessagesList() {
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    
    // Hooks pour les données et sockets
    const { data: conversations = [], isLoading } = useConversations();
    const { isUserOnline } = useMessagesSocket();
    const { 
        unreadNotifications, 
        removeConversationNotifications
    } = useMessageNotifications();
    
    const {
        getNotificationStatus,
        handleRequestNotificationPermission,
        shouldRequestPermission
    } = useNotificationHelpers();

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

    const notificationStatus = getNotificationStatus();
    const StatusIcon = notificationStatus.icon === 'Bell' ? Bell : BellOff;

    // Préparer le contenu de la liste des conversations
    const conversationListContent = (
        <StatusStates
            isLoading={isLoading}
            isEmpty={conversations.length === 0}
            loadingMessage={NOTIFICATION_MESSAGES.LOADING.CONVERSATIONS}
            emptyTitle={NOTIFICATION_MESSAGES.EMPTY.CONVERSATIONS.TITLE}
            emptyDescription={NOTIFICATION_MESSAGES.EMPTY.CONVERSATIONS.DESCRIPTION}
        >
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
        </StatusStates>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-200 p-3 sm:p-4 bg-white bg-opacity-50">
                <div className={FLEX_CLASSES.RESPONSIVE_BETWEEN}>
                    <div className={FLEX_CLASSES.RESPONSIVE_CENTER}>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{UI_TEXTS.TITLES.MESSAGES}</h1>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    
                    {/* Bouton des paramètres de notification */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                        className={FLEX_CLASSES.CENTER_GAP_2}
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
                {shouldRequestPermission() && 
                 !showNotificationSettings && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className={FLEX_CLASSES.CENTER_GAP_2}>
                                <Bell className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">
                                    {NOTIFICATION_MESSAGES.PERMISSION_ACTIVATE}
                                </span>
                            </div>
                            <Button onClick={handleRequestNotificationPermission} size="sm" variant="outline">
                                {UI_TEXTS.BUTTONS.ACTIVATE}
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
