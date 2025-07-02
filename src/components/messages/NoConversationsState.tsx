import React from 'react';
import { IoChatbubbles } from 'react-icons/io5';

export const NoConversationsState: React.FC = () => {
  return (
    <div className="flex flex-col justify-between items-center h-full p-8 text-center">
      <div className="flex flex-col items-center w-full">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <IoChatbubbles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune conversation
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm">
          Pour discuter, il faut d&apos;abord obtenir des matchs en ouvrant des boosters.
        </p>
        <a
          href="/booster"
          className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          🎁 Découvrir les boosters
        </a>
      </div>
      <div className="mt-auto w-full flex justify-center">
        <div className="mt-6 text-xs text-gray-400">
          <p>💡 Plus de boosters = plus de rencontres !</p>
        </div>
      </div>
    </div>
  );
}; 