'use client'

import { Message } from '../../lib/routes/messages/interfaces/message.interface';

interface MessageReplyProps {
  readonly replyTo: Message['replyTo'];
  readonly isMe: boolean;
}

export function MessageReply({ replyTo, isMe }: MessageReplyProps) {
  if (!replyTo) return null;

  return (
    <div className={`mb-2 p-2 rounded-lg border-l-4 ${isMe
      ? 'bg-secondary/50 border-secondary/50 text-secondary'
      : 'bg-gray-50 border-gray-300 text-gray-700'
      }`}>
      <div className="text-xs font-medium mb-1">
        Reply to a message
      </div>
      <div className="text-sm truncate">
        {replyTo.content}
      </div>
    </div>
  );
} 