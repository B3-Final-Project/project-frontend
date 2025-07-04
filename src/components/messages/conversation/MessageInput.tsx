import React from 'react';

interface MessageInputProps {
    readonly newMessage: string;
    readonly onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onSendMessage: () => void;
    readonly onKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    onMessageChange,
    onSendMessage,
    onKeyPress,
}) => {
    return (
        <div className="border-t border-gray-200 ">
            {/* Zone d'input */}
            <div className="p-4">
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
        </div>
    );
}; 
