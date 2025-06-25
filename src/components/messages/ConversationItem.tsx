'use client';

import type { Conversation } from './types';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isSelected,
  isExpanded,
  onClick
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left transition-colors
        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
        p-2
        border-b border-gray-100
      `}
    >
      <div className={`
        flex items-center gap-3
        ${!isExpanded ? 'justify-center' : ''}
      `}>
        <div className="relative flex-shrink-0">
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className={`
              rounded-full
              w-12 h-12
            `}
          />
          {conversation.unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conversation.unread}
            </span>
          )}
        </div>
        
        {isExpanded && (
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center w-full">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conversation.name}
                </h3>
                <div className="text-sm text-gray-600">
                  {conversation.isTyping ? (
                    <div className="flex items-center text-blue-500">
                      <span className="animate-pulse">En train d'écrire</span>
                      <span className="ml-1 animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </div>
                  ) : (
                    <p className="truncate">{conversation.lastMessage}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 text-right flex-shrink-0 ml-2 self-start">
                <p>{conversation.timestamp}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
} 