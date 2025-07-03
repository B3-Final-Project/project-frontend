
import { IoCheckmarkDone } from 'react-icons/io5';
import type { Message } from './types';
import { formatNotificationTimestamp } from '../../lib/utils/timestamp-utils';

interface MessageBubbleProps {
    readonly message: Message;
    readonly isLastMessage?: boolean;
}

export default function MessageBubble({ message, isLastMessage = false }: MessageBubbleProps) {
    return (
        <div
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`
                    max-w-[90%] md:max-w-[75%] rounded-2xl 
                    ${message.isMe
                        ? 'bg-blue-500 text-white p-2 md:p-3'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-100 p-2.5 md:p-3.5'
                    }
                    ${isLastMessage ? 'animate-fade-in' : ''}
                `}
            >
                <p className="text-[13px] md:text-[15px] leading-relaxed break-words">
                    {message.content}
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                    <p className={`text-[10px] md:text-xs ${message.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {formatNotificationTimestamp(message.timestamp)}
                    </p>
                    {message.isMe && (
                        <IoCheckmarkDone
                            className={message.isRead ? 'text-green-400' : 'text-blue-100'}
                            size={12}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
