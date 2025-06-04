import React, { useCallback } from 'react';

interface MessageInputProps {
    newMessage: string;
    onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSendMessage: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    onMessageChange,
    onSendMessage,
    onKeyPress
}) => {
    return (
        <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={onMessageChange}
                    onKeyPress={onKeyPress}
                    placeholder="Écrivez votre message..."
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={onSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}; 