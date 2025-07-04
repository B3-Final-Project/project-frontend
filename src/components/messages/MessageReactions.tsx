'use client'

import { useState } from 'react';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { Message } from '../../lib/routes/messages/interfaces/message.interface';

interface MessageReactionsProps {
  message: Message;
  currentUserId: string;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export function MessageReactions({ message, currentUserId }: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { addReaction, removeReaction } = useMessagesSocket();

  const handleReactionClick = (emoji: string) => {
    const hasReacted = message.reactions?.[emoji]?.includes(currentUserId);
    
    if (hasReacted) {
      removeReaction({ message_id: message.id, emoji });
    } else {
      addReaction({ message_id: message.id, emoji });
    }
    
    setShowEmojiPicker(false);
  };

  const getCurrentUserReactions = () => {
    if (!message.reactions) return [];
    
    return Object.entries(message.reactions)
      .filter(([_, userIds]) => userIds.includes(currentUserId))
      .map(([emoji]) => emoji);
  };

  const currentUserReactions = getCurrentUserReactions();

  if (!message.reactions || Object.keys(message.reactions).length === 0) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded hover:bg-gray-100 transition-colors"
          title="Ajouter une réaction"
        >
          😊
        </button>
        
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <div className="flex gap-1">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="text-lg p-1 hover:bg-gray-100 rounded transition-colors"
                  title={`Réagir avec ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-1 relative">
      {/* Afficher les réactions existantes */}
      {Object.entries(message.reactions).map(([emoji, userIds]) => (
        <button
          key={emoji}
          onClick={() => handleReactionClick(emoji)}
          className={`text-sm px-2 py-1 rounded-full transition-colors ${
            userIds.includes(currentUserId)
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={`${userIds.length} réaction${userIds.length > 1 ? 's' : ''}`}
        >
          <span className="mr-1">{emoji}</span>
          <span className="text-xs">{userIds.length}</span>
        </button>
      ))}
      
      {/* Bouton pour ajouter une nouvelle réaction */}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded hover:bg-gray-100 transition-colors"
        title="Ajouter une réaction"
      >
        😊
      </button>
      
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
          <div className="flex gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className={`text-lg p-1 hover:bg-gray-100 rounded transition-colors ${
                  currentUserReactions.includes(emoji) ? 'bg-blue-100' : ''
                }`}
                title={`Réagir avec ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 