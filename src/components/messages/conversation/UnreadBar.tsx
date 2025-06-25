import React from 'react';

interface UnreadBarProps {
    unreadCount: number;
    onMarkAsRead?: () => void;
}

export const UnreadBar: React.FC<UnreadBarProps> = ({ unreadCount, onMarkAsRead }) => {
    return (
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
                <button
                    onClick={onMarkAsRead}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-xs font-semibold rounded-full shadow-sm transition-colors duration-200 cursor-pointer"
                    title="Cliquer pour marquer comme lu"
                >
                    {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
}; 