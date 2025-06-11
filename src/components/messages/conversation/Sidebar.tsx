import React from 'react';
import type { Conversation } from '../types';
import ConversationItem from '../ConversationItem';

interface SidebarProps {
    isExpanded: boolean;
    conversations: Conversation[];
    currentConversationId: number;
    onConversationSelect: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isExpanded,
    conversations,
    currentConversationId,
    onConversationSelect
}) => {
    return (
        <div className={`
            transition-all duration-300 ease-in-out
            fixed md:static inset-0 z-40 bg-white h-[calc(100vh-50px)] md:h-full
            ${isExpanded ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            md:${isExpanded ? 'w-[35%] lg:w-[30%] 2xl:w-[25%] max-w-[450px]' : 'w-[60px] max-w-[60px]'}
            min-w-0 border-r border-gray-200
        `}>
            <div className="flex items-center p-4 h-[50px] border-b border-gray-200 bg-white">
                {isExpanded ? (
                    <h1 className="text-xl font-semibold text-gray-800">Conversations</h1>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-800" viewBox="0 0 512 512">
                        <path d="M425.9 170.4H204.3c-21 0-38.1 17.1-38.1 38.1v154.3c0 21 17.1 38.1 38.1 38.1h126.8l58.2 50.2c2.3 2 5.2 3.1 8.3 3.1 3.1 0 6.1-1.1 8.4-3.1l58.2-50.2c21 0 38.1-17.1 38.1-38.1V208.5c0-21-17.1-38.1-38.1-38.1z"/>
                    </svg>
                )}
            </div>
            <div className="flex-1 overflow-y-auto h-[calc(100vh-50px-64px)] md:h-full flex flex-col">
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={currentConversationId === conversation.id}
                        isExpanded={isExpanded}
                        onClick={() => onConversationSelect(conversation.id)}
                    />
                ))}
            </div>
        </div>
    );
}; 