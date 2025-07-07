'use client';

import { Bell, BellOff, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useConversations } from '../../hooks/react-query/messages';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useNotificationHelpers } from '../../hooks/useNotificationHelpers';
import { NOTIFICATION_MESSAGES, UI_TEXTS } from '../../lib/constants/messages';
import { FLEX_CLASSES } from '../../lib/utils/css-utils';
import { NotificationSettings } from '../NotificationSettings';
import { Button } from '../ui/button';
import { StatusStates } from '../ui/status-states';
import ConversationItem from './ConversationItem';

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

    const handleConversationSelect = useCallback((conversationId: string) => {
        setSelectedConversation(conversationId);
        removeConversationNotifications(conversationId);
        router.push(`/messages/${conversationId}`);
    }, [removeConversationNotifications, router, conversations]);

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
    }, [handleConversationSelect]);

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
            <div className="p-3 sm:p-4">
                <div className={FLEX_CLASSES.RESPONSIVE_BETWEEN}>
                    <div className={FLEX_CLASSES.RESPONSIVE_CENTER}>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{UI_TEXTS.TITLES.MESSAGES}</h1>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>

                    {/* Bouton des paramètres de notification */}
                    <Settings className="w-4 h-4" onClick={() => setShowNotificationSettings(!showNotificationSettings)} />
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
                                    <Bell className="w-4 h-4 text-secondary" />
                                    <span className="text-sm text-secondary">
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
            <div className="flex-1 overflow-y-auto">
                {conversationListContent}
            </div>
        </div>
    );
} 
