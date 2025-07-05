'use client'

import { useState } from 'react';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { Message } from '../../lib/routes/messages/interfaces/message.interface';
import { useQueryClient } from '@tanstack/react-query';

interface MessageReactionsProps {
  readonly message: Message;
  readonly currentUserId: string;
  readonly isMe: boolean;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export function MessageReactions({ message, currentUserId, isMe }: MessageReactionsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { addReaction, removeReaction } = useMessagesSocket();
  const queryClient = useQueryClient();

  const handleReactionClick = (emoji: string) => {
    const hasReacted = message.reactions?.[emoji]?.includes(currentUserId);
    
    // Mise à jour optimiste du cache local
    const updatedReactions = message.reactions ? { ...message.reactions } : {};
    
    if (hasReacted) {
      // Supprimer la réaction du cache local
      if (updatedReactions[emoji]) {
        updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== currentUserId);
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      }
      removeReaction({ message_id: message.id, emoji });
    } else {
      // Ajouter la réaction au cache local
      if (!updatedReactions[emoji]) {
        updatedReactions[emoji] = [];
      }
      if (!updatedReactions[emoji].includes(currentUserId)) {
        updatedReactions[emoji].push(currentUserId);
      }
      addReaction({ message_id: message.id, emoji });
    }
    
    // Mettre à jour le cache React Query immédiatement
    const updatedMessage = {
      ...message,
      reactions: updatedReactions
    };
    
    queryClient.setQueryData(['messages', message.conversationId], (oldData: Message[] | undefined) => {
      if (!oldData) return [updatedMessage];
      return oldData.map(m => m.id === message.id ? updatedMessage : m);
    });
    
    setShowEmojiPicker(false);
  };

  const getCurrentUserReactions = () => {
    if (!message.reactions) return [];
    
    return Object.entries(message.reactions)
      .filter(([, userIds]) => userIds.includes(currentUserId))
      .map(([emoji]) => emoji);
  };

  const currentUserReactions = getCurrentUserReactions();

  // Afficher les réactions existantes
  const hasReactions = message.reactions && Object.keys(message.reactions).length > 0;

  return (
    <div className="flex items-center gap-1 mt-1 relative">
      {/* Afficher les réactions existantes */}
      {hasReactions &&
        Object.entries(message.reactions!).map(([emoji, userIds]) => {
          const hasReacted = userIds.includes(currentUserId);
          const isMyReaction = hasReacted;
          
          return (
            <button
              key={emoji}
              type="button"
              onClick={isMyReaction ? () => handleReactionClick(emoji) : undefined}
              disabled={!isMyReaction}
              className={`text-sm px-2 py-1 rounded-full transition-colors select-none ${
                isMyReaction 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 cursor-pointer' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 cursor-default'
              }`}
              title={isMyReaction ? `Retirer la réaction ${emoji}` : `${emoji}`}
            >
              <span>{emoji}</span>
            </button>
          );
        })}

      {/* Bouton pour ajouter une nouvelle réaction UNIQUEMENT si ce n'est pas mon message */}
      {!isMe && (
        <>
          <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-gray-600 text-sm p-1 rounded hover:bg-gray-100 transition-colors"
              title="Ajouter une réaction"
          >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
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
        </>
      )}
    </div>
  );
} 