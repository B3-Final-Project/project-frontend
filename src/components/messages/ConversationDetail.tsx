'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './conversation/Sidebar';
import { MessageList } from './conversation/MessageList';
import { MessageInput } from './conversation/MessageInput';
import { ConversationHeader } from './conversation/ConversationHeader';
import { useConversation } from './conversation/useConversation';

interface ConversationDetailProps {
    conversationId: number;
}

export default function ConversationDetail({ conversationId }: ConversationDetailProps) {
    const router = useRouter();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    
    const {
        messages,
        conversations,
        newMessage,
        typing,
        unreadCount,
        firstUnreadIndex,
        lastReadConversationId,
        handleTyping,
        handleSendMessage,
        handleKeyPress,
        handleMarkAsRead
    } = useConversation(conversationId);

    // Gérer le responsive de la barre latérale
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setIsSidebarExpanded(!isMobile);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fermer la sidebar sur mobile quand on change de conversation
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarExpanded(false);
        }
    }, [conversationId]);

    const handleConversationSelect = (id: number) => {
        if (id !== conversationId) {
            router.push(`/messages/${id}`);
        }
    };

    const currentConversation = conversations.find(c => c.id === conversationId);

    return (
        <div className="flex w-full md:h-full h-[calc(100vh-50px)] overflow-hidden">
            <Sidebar
                isExpanded={isSidebarExpanded}
                conversations={conversations}
                currentConversationId={conversationId}
                onConversationSelect={handleConversationSelect}
            />

            <div className="flex flex-col flex-1 min-w-0 bg-white">
                <ConversationHeader
                    title={currentConversation?.name || "Conversation"}
                    isSidebarExpanded={isSidebarExpanded}
                    onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                />

                <MessageList
                    messages={messages}
                    typing={typing}
                    unreadCount={unreadCount}
                    firstUnreadIndex={firstUnreadIndex}
                    lastReadConversationId={lastReadConversationId}
                    currentConversationId={conversationId}
                    otherName={currentConversation?.name}
                    onMarkAsRead={handleMarkAsRead}
                />

                <MessageInput
                    newMessage={newMessage}
                    onMessageChange={handleTyping}
                    onSendMessage={handleSendMessage}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </div>
    );
} 