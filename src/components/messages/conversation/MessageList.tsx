import React, { useRef, useLayoutEffect } from 'react';
import type { Message } from '../types';
import { MessageItem } from './MessageItem';
import { UnreadBar } from './UnreadBar';
import { DateSeparator } from './DateSeparator';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
    messages: Message[];
    typing: { me: boolean; other: boolean };
    unreadCount: number;
    firstUnreadIndex: number | null;
    otherName?: string;
    onMarkAsRead?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    typing,
    unreadCount,
    firstUnreadIndex,
    otherName,
    onMarkAsRead
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef<number>(0);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    useLayoutEffect(() => {
        const shouldAutoScroll = messages.length > prevMessagesLengthRef.current;
        
        if (shouldAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'end'
            });
        }
        
        prevMessagesLengthRef.current = messages.length;
    }, [messages.length]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => {
                // Afficher la barre de messages non lus si il y en a et qu'on est au bon index
                const showUnreadBar = unreadCount > 0 && index === firstUnreadIndex;
                
                const showDateSeparator = index > 0 && 
                    messages[index - 1].timestamp.toDateString() !== message.timestamp.toDateString();

                return (
                    <div key={message.id}>
                        {showUnreadBar && (
                            <UnreadBar 
                                unreadCount={unreadCount} 
                                onMarkAsRead={onMarkAsRead}
                            />
                        )}
                        {showDateSeparator && (
                            <DateSeparator date={message.timestamp.toDateString()} />
                        )}
                        <MessageItem message={message} />
                    </div>
                );
            })}
            {/* Indicateur de frappe de l'autre personne */}
            {typing.other && <TypingIndicator name={otherName} />}
            {/* Élément invisible pour l'auto-scroll */}
            <div ref={messagesEndRef} />
        </div>
    );
}; 