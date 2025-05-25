'use client';

import { useRouter } from 'next/navigation';
import { IoChevronForward, IoChevronBack, IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isTyping: boolean;
  avatar: string;
  lastMessageDate: Date;
}

interface ConversationsListProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedId?: number | null;
  isMobile?: boolean;
}

export default function ConversationsList({ isExpanded, onToggle, selectedId, isMobile }: ConversationsListProps) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 768;

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Alice Martin",
      lastMessage: "D'accord, on se voit demain !",
      timestamp: "10:30",
      unread: 2,
      isTyping: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      lastMessageDate: new Date('2024-03-20T10:30:00'),
    },
    {
      id: 2,
      name: "Thomas Bernard",
      lastMessage: "Le projet avance bien ?",
      timestamp: "09:15",
      unread: 0,
      isTyping: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      lastMessageDate: new Date('2024-03-20T09:15:00'),
    },
    {
      id: 3,
      name: "Marie Dubois",
      lastMessage: "Super, merci !",
      timestamp: "Hier",
      unread: 1,
      isTyping: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      lastMessageDate: new Date('2024-03-19T15:30:00'),
    },
    {
      id: 4,
      name: "Lucas Petit",
      lastMessage: "On fait un point demain ?",
      timestamp: "Hier",
      unread: 3,
      isTyping: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      lastMessageDate: new Date('2024-03-19T14:20:00'),
    },
    {
      id: 5,
      name: "Emma Richard",
      lastMessage: "Le document est prêt",
      timestamp: "19/03",
      unread: 0,
      isTyping: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      lastMessageDate: new Date('2024-03-19T11:45:00'),
    }
  ].sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());

  const handleConversationClick = (conversationId: number) => {
    router.push(`/messages/${conversationId}`);
    if (isMobileView) {
      onToggle();
    }
  };

  return (
    <div className={`
      fixed md:relative
      h-full flex flex-col bg-white border-r border-gray-100
      ${isExpanded ? 'w-full md:w-[320px]' : 'w-20'}
      ${!isExpanded && isMobileView ? '-translate-x-full' : 'translate-x-0'}
      transition-all duration-300 ease-in-out
      z-30
    `}>
      {/* Overlay sombre pour mobile */}
      {isExpanded && isMobileView && (
        <div 
          className="fixed inset-0 bg-black/30 z-20" 
          onClick={onToggle}
        />
      )}

      {/* En-tête avec titre et bouton de toggle */}
      <div className={`
        py-6 px-4 flex items-center border-b border-gray-100
        ${isExpanded ? 'justify-between' : 'justify-center'}
        bg-white relative z-30
      `}>
        {isExpanded && (
          <h2 className="text-lg font-semibold text-gray-900">
            Messages
          </h2>
        )}
        <button 
          onClick={onToggle}
          className={`
            w-8 h-8 flex items-center justify-center rounded-full
            transition-colors
            ${isExpanded && isMobileView 
              ? 'hover:bg-gray-100' 
              : 'hover:bg-gray-100'
            }
          `}
        >
          {isExpanded ? (
            isMobileView ? (
              <IoClose className="w-5 h-5 text-gray-500" />
            ) : (
              <IoChevronBack className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <IoChevronForward className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto bg-white relative z-30">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`
              py-3 px-4 cursor-pointer
              ${isExpanded ? 'hover:bg-gray-50' : 'flex justify-center'}
              ${selectedId === conversation.id ? 'bg-blue-50/70' : ''}
              transition-colors duration-200
            `}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className={`
              flex items-center
              ${isExpanded ? 'space-x-3' : 'justify-center'}
            `}>
              {/* Avatar et badge de notification toujours visibles */}
              <div className="relative shrink-0">
                <div className={`
                  w-10 h-10 rounded-full overflow-hidden
                  ${selectedId === conversation.id ? 'ring-2 ring-blue-400' : ''}
                  transition-shadow duration-200
                `}>
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {conversation.isTyping && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                )}
                {conversation.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[11px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {conversation.unread}
                  </span>
                )}
              </div>

              {/* Informations détaillées uniquement visibles en mode étendu */}
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {conversation.name}
                    </h3>
                    <span className="text-[11px] text-gray-500 ml-2 shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.isTyping ? (
                        <span className="text-green-500 flex items-center">
                          <span className="animate-pulse">En train d'écrire</span>
                          <span className="ml-1 animate-bounce">...</span>
                        </span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 