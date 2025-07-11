'use client';

import Image from 'next/image';
import { Conversation } from '../../lib/routes/messages/interfaces/message.interface';
import { USER_STATUS } from '../../lib/utils/message-styles';
import { formatMessageTimestamp } from '../../lib/utils/timestamp-utils';
import { OnlineStatus } from './OnlineStatus';

interface ConversationItemProps {
  readonly conversation: Conversation;
  readonly isSelected: boolean;
  readonly isExpanded: boolean;
  readonly onClick: () => void;
  readonly isOnline?: boolean;
  readonly unreadCount?: number;
}

export default function ConversationItem({
  conversation,
  isSelected,
  isExpanded,
  onClick,
  isOnline = false,
  unreadCount = 0
}: ConversationItemProps) {
  // Obtenir le texte du dernier message
  const getLastMessageText = () => {
    if (conversation.lastMessage) {
      return conversation.lastMessage.content;
    }
    return "No message";
  };

  // Obtenir le nombre total de messages non lus
  const totalUnread = (conversation.unread || 0) + unreadCount;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left transition-colors
        ${isSelected ? 'bg-primary/20' : 'hover:bg-primary/10'}
        p-4 border-b border-border
      `}
    >
      <div className={`
        flex items-center gap-2 sm:gap-3
        ${!isExpanded ? 'justify-center' : ''}
      `}>
        <div className="relative flex-shrink-0">
          <Image
            src={conversation.avatar || '/img.png'}
            alt={conversation.name}
            width={48}
            height={48}
            className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 ${isOnline ? 'border-green-500' : 'border-gray-300'}`}
          />
          <div className="absolute -bottom-1 -right-1">
            <OnlineStatus isOnline={isOnline} size="sm" />
          </div>
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 flex items-center justify-center px-1">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </div>

        {isExpanded && (
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start w-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold truncate text-sm sm:text-base ${totalUnread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                    {conversation.name}
                  </h3>
                  {isOnline && (
                    <span className="text-xs text-green-600 font-medium hidden sm:inline">{USER_STATUS.ONLINE}</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm">
                  {conversation.isTyping ? (
                    <div className="flex items-center text-secondary">
                      <span className="animate-pulse">Typing</span>
                      <span className="ml-1 animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  ) : (
                    <p className={`truncate ${totalUnread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {conversation.lastMessage?.isMe && (
                        <span className="text-secondary font-medium">You: </span>
                      )}
                      {getLastMessageText().replace('You: ', '')}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 text-right flex-shrink-0 ml-2 self-start">
                <p className="text-xs">{formatMessageTimestamp(conversation.lastMessage?.timestamp || conversation.lastActive)}</p>
                {totalUnread > 0 && (
                  <div className="mt-1">
                    <span className="inline-block w-2 h-2 bg-secondary rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
} 