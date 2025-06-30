import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Chargement...", 
  size = 'md' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${getSizeClasses()} border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin`} />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}; 