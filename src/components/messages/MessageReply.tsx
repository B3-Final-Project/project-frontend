'use client'

import { Message } from '../../lib/routes/messages/interfaces/message.interface';

interface MessageReplyProps {
  readonly replyTo: Message['replyTo'];
  readonly isMe: boolean;
}

export function MessageReply({ replyTo, isMe }: MessageReplyProps) {
  if (!replyTo) return null;

  return (
    <div className={`mb-2 p-2 rounded-lg border-l-4 ${
      isMe 
        ? 'bg-blue-50 border-blue-300 text-blue-800' 
        : 'bg-gray-50 border-gray-300 text-gray-700'
    }`}>
      <div className="text-xs font-medium mb-1">
        Réponse à un message
      </div>
      <div className="text-sm truncate">
        {replyTo.content}
      </div>
    </div>
  );
} 