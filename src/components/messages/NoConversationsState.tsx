import React from 'react';
import { IoChatbubbles, IoAdd } from 'react-icons/io5';

interface NoConversationsStateProps {
  onCreateConversation: () => void;
}

export const NoConversationsState: React.FC<NoConversationsStateProps> = ({
  onCreateConversation
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <IoChatbubbles className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucune conversation
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        Commencez à discuter avec vos matches ! Créez votre première conversation pour échanger des messages.
      </p>
      
      <button
        onClick={onCreateConversation}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <IoAdd className="w-4 h-4" />
        Créer une conversation
      </button>
      
      <div className="mt-6 text-xs text-gray-400">
        <p>💡 Conseil : Utilisez le bouton "Nouvelle conversation" pour commencer à discuter</p>
      </div>
    </div>
  );
}; 