import React from 'react';

interface TypingIndicatorProps {
    isMe: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isMe }) => {
    const message = isMe ? "Vous écrivez..." : "L'autre personne est en train d'écrire...";
    const bgColor = isMe ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600";
    const justifyClass = isMe ? "justify-end" : "justify-start";

    return (
        <div className={`flex ${justifyClass} mt-2`}>
            <div className={`${bgColor} text-sm px-4 py-2 rounded-2xl`}>
                <div className="flex items-center space-x-1">
                    <span>{message}</span>
                    <div className="flex space-x-1">
                        <span className="animate-bounce delay-0">.</span>
                        <span className="animate-bounce delay-150">.</span>
                        <span className="animate-bounce delay-300">.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 