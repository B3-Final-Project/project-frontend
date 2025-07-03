import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  typingUsers: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, typingUsers }) => {
  if (!isVisible || typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} est en train d'écrire...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} et ${typingUsers[1]} sont en train d'écrire...`;
    } else {
      return 'Plusieurs personnes sont en train d\'écrire...';
    }
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg max-w-[90%] md:max-w-[75%]">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm text-gray-600 italic">{getTypingText()}</span>
    </div>
  );
}; 