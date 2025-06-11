import React from 'react';
import type { Message } from '../types';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    return (
        <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`
                    max-w-[90%] md:max-w-[75%] rounded-2xl 
                    ${message.isMe 
                        ? 'bg-blue-500 text-white p-2 md:p-3' 
                        : 'bg-white text-gray-900 shadow-sm border border-gray-100 p-2.5 md:p-3.5'
                    }
                `}
            >
                <p className="text-[13px] md:text-[15px] leading-relaxed break-words">
                    {message.content}
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                    <p className={`text-[10px] md:text-xs ${
                        message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                        {message.timestamp.split(' ')[1]}
                    </p>
                    {message.isMe && (
                        <span className={`text-[10px] md:text-xs ${
                            message.isRead ? 'text-blue-100' : 'text-blue-200'
                        }`}>
                            {message.isRead ? '✓✓' : '✓'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}; 