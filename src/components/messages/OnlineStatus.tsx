import React from 'react';

interface OnlineStatusProps {
  readonly isOnline: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3 h-3';
    }
  };

  return (
    <div className=" hidden">
      <div
        className={`${getSizeClasses()} rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
      />

    </div>
  );
};