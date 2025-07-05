import React from 'react';

interface TypingIndicatorProps {
    name?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => {
    const message = name ? `${name} est en train d'écrire...` : "L'autre personne est en train d'écrire...";
    return (
        <div className="flex justify-start mb-2 w-auto">
            <div className="bg-gray-50 text-gray-500 text-xs px-3 py-1.5 rounded-full border border-gray-200">
                <div className="flex items-center space-x-1">
                    <span className="font-medium">{message}</span>
                    <div className="flex space-x-0.5">
                        <span className="animate-bounce delay-0 text-xs">.</span>
                        <span className="animate-bounce delay-150 text-xs">.</span>
                        <span className="animate-bounce delay-300 text-xs">.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 