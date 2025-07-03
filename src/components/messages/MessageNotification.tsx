'use client';

import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { formatNotificationTimestamp } from '../../lib/utils/timestamp-utils';

interface MessageNotificationProps {
  message: {
    id: string;
    content: string;
    sender: string;
    conversationId: string;
    timestamp: Date;
  };
  onClose: () => void;
  onOpenConversation: (conversationId: string) => void;
}

export const MessageNotification: React.FC<MessageNotificationProps> = ({
  message,
  onClose,
  onOpenConversation
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-fermer la notification après 5 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre l'animation de fermeture
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleOpenConversation = () => {
    onOpenConversation(message.conversationId);
    onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              Nouveau message de {message.sender}
            </h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {message.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatNotificationTimestamp(message.timestamp)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleOpenConversation}
            className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            Ouvrir
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-md transition-colors"
          >
            Ignorer
          </button>
        </div>
      </div>
    </div>
  );
}; 