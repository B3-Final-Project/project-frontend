import React from 'react';
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
    lastReadConversationId: number | null;
    currentConversationId: number;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    typing,
    unreadCount,
    firstUnreadIndex,
    lastReadConversationId,
    currentConversationId
}) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => {
                const showUnreadBar = unreadCount > 0 && 
                    index === firstUnreadIndex && 
                    lastReadConversationId === currentConversationId;
                
                const showDateSeparator = index > 0 && 
                    messages[index - 1].timestamp.split(' ')[0] !== message.timestamp.split(' ')[0];

                return (
                    <div key={message.id}>
                        {showUnreadBar && <UnreadBar unreadCount={unreadCount} />}
                        {showDateSeparator && (
                            <DateSeparator date={message.timestamp.split(' ')[0]} />
                        )}
                        <MessageItem message={message} />
                    </div>
                );
            })}
            {typing.other && <TypingIndicator isMe={false} />}
            {typing.me && <TypingIndicator isMe={true} />}
        </div>
    );
}; 