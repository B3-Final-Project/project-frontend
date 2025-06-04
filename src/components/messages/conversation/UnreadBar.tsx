import React from 'react';

interface UnreadBarProps {
    unreadCount: number;
}

export const UnreadBar: React.FC<UnreadBarProps> = ({ unreadCount }) => {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-blue-500 font-semibold">
                    {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
}; 