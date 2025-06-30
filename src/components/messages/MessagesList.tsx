'use client';

import { useState } from 'react';
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
    
    // Hooks pour les données et sockets
    const { data: conversations = [], isLoading } = useConversations();
    const { isUserOnline } = useMessagesSocket();
    const { unreadNotifications, removeConversationNotifications, requestNotificationPermission } = useMessageNotifications();

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
            alert('Notifications activées !');
        } else {
            alert('Notifications refusées. Vous pouvez les activer dans les paramètres de votre navigateur.');
        }
    };

    // Fonction pour obtenir le nombre de messages non lus pour une conversation
    const getUnreadCount = (conversationId: string) => {
        const notification = unreadNotifications.find(n => n.conversationId === conversationId);
        return notification ? notification.messageCount : 0;
    };

    // Fonction pour vérifier si l'autre utilisateur est en ligne
    const isOtherUserOnline = (conversation: any) => {
        if (!conversation.otherUserId) return false;
        return isUserOnline(conversation.otherUserId);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRequestNotificationPermission}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Activer notifications
                    </button>
                    <CreateConversationButton onConversationCreated={handleConversationCreated} />
                </div>
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <LoadingState message="Chargement des conversations..." size="lg" />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <NoConversationsState onCreateConversation={() => {}} />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {conversations.map((conversation) => {
                            const isOnline = isOtherUserOnline(conversation);
                            const unreadCount = getUnreadCount(conversation.id);
                            
                            console.log('🔍 Conversation:', {
                                id: conversation.id,
                                name: conversation.name,
                                otherUserId: conversation.otherUserId,
                                isOnline,
                                unreadCount,
                                lastMessage: conversation.lastMessage
                            });
                            
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
                )}
            </div>
        </div>
    );
} 