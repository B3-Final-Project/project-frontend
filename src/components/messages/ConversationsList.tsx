'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockConversations } from './mockData';
import type { Conversation } from './types';
import ConversationItem from './ConversationItem';

interface ConversationsListProps {
  isExpanded: boolean;
  selectedId: number | null;
  onToggle: () => void;
  isMobile: boolean;
}

export default function ConversationsList({ 
  isExpanded, 
  selectedId, 
  onToggle,
  isMobile 
}: ConversationsListProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const handleConversationClick = (id: number) => {
    router.push(`/messages/${id}`);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedId}
            isExpanded={isExpanded}
            onClick={() => handleConversationClick(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
} 