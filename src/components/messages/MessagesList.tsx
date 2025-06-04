'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockConversations } from './mockData';
import ConversationItem from './ConversationItem';

export default function MessagesList() {
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

    const handleConversationSelect = (conversationId: number) => {
        setSelectedConversation(conversationId);
        router.push(`/messages/${conversationId}`);
    };

    return (
        <div className="flex flex-col md:h-full h-[calc(100vh-50px)] bg-white">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-800">Conversations</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
                {mockConversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedConversation === conversation.id}
                        isExpanded={true}
                        onClick={() => handleConversationSelect(conversation.id)}
                    />
                ))}
            </div>
        </div>
    );
} 