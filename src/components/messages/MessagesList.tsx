'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConversationItem from './ConversationItem';
import { LoadingState } from './LoadingState';
import { CreateConversationButton } from './CreateConversationButton';
import { NoConversationsState } from './NoConversationsState';
import { useConversations } from '../../hooks/react-query/messages';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';

export default function MessagesList() {
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    
    // Hooks pour les données et sockets
    const { data: conversations = [], isLoading } = useConversations();
    const { isUserOnline } = useMessagesSocket();
    const { unreadNotifications, removeConversationNotifications, requestNotificationPermission } = useMessageNotifications();

    // Vérifier l'état des permissions de notification au chargement
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
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
        if (granted) {
            setNotificationPermission('granted');
            alert('Notifications activées !');
        } else {
            setNotificationPermission('denied');
            alert('Notifications refusées. Vous pouvez les activer dans les paramètres de votre navigateur.');
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
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="w-auto">
                        <CreateConversationButton onConversationCreated={handleConversationCreated} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                    {notificationPermission === 'default' && (
                        <button
                            onClick={handleRequestNotificationPermission}
                            className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-center"
                        >
                            Activer notifications
                        </button>
                    )}
                    {notificationPermission === 'granted' && (
                        <div className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm bg-green-100 text-green-700 rounded-lg text-center">
                            ✓ Notifications activées
                        </div>
                    )}
                    {notificationPermission === 'denied' && (
                        <div className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm bg-red-100 text-red-700 rounded-lg text-center">
                            ✗ Notifications désactivées
                        </div>
                    )}
                </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-0">
                {conversationListContent}
            </div>
        </div>
    );
} 