"use client"

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';

export const ConnectionStatus: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected, onlineUsers, typingUsers, currentConversationId } = useMessagesSocket();

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title="Statut de connexion"
      >
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Statut de connexion</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoClose className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
        
        <div className="text-gray-600">
          <p>Utilisateurs en ligne: {onlineUsers.size}</p>
          <p>Conversations actives: {typingUsers.size}</p>
          {currentConversationId && (
            <p>Conversation actuelle: {currentConversationId.slice(0, 8)}...</p>
          )}
        </div>
        
        {typingUsers.size > 0 && (
          <div className="text-gray-600">
            <p className="font-medium">Utilisateurs en train d'écrire:</p>
            <ul className="ml-2 text-xs">
              {Array.from(typingUsers.entries()).map(([conversationId, users]) => (
                <li key={conversationId}>
                  {conversationId.slice(0, 8)}...: {users.size} utilisateur(s)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 