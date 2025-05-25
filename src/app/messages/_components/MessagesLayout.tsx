'use client';

import { useState, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
}

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

interface MessagesLayoutProps {
  initialSelectedConversation?: number;
}

export default function MessagesLayout({ initialSelectedConversation }: MessagesLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(initialSelectedConversation || null);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isConversationsVisible, setIsConversationsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isMessagesRoot = pathname === '/messages';

  useEffect(() => {
    // Initialiser la largeur de la fenêtre après le montage du composant
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMessagesRoot) {
      setIsConversationsVisible(true);
      setSelectedConversation(null);
    }
  }, [isMessagesRoot]); 

  // Ne calculer isMobile que lorsque windowWidth est défini
  const isMobile = windowWidth === 0 ? false : windowWidth < 768;

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
  ].sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());

  const messages: Message[] = [
    {
      id: 1,
      sender: "Alice Martin",
      content: "Salut ! Comment vas-tu ?",
      timestamp: "10:00",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Très bien merci, et toi ?",
      timestamp: "10:15",
      isMe: true,
      isRead: true,
    },
    {
      id: 3,
      sender: "Alice Martin",
      content: "Super ! On se voit demain pour le projet ?",
      timestamp: "10:20",
      isMe: false,
      isRead: true,
    },
    {
      id: 4,
      sender: "Moi",
      content: "D'accord, on se voit demain !",
      timestamp: "10:30",
      isMe: true,
      isRead: false,
    },
  ];

  const handleConversationClick = (conversationId: number) => {
    setSelectedConversation(conversationId);
    router.push(`/messages/${conversationId}`);
    if (isMobile) {
      setIsConversationsVisible(false);
    }
  };

  const toggleConversations = () => {
    setIsConversationsVisible(!isConversationsVisible);
  };

  return (
    <section className="flex min-h-screen bg-gray-100">
      {/* Bouton pour redéployer la liste quand elle est minimisée */}
      {!isMessagesRoot && !isConversationsVisible && (
        <button
          onClick={toggleConversations}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-r-lg shadow-md z-50 hover:bg-gray-50"
        >
          <IoChevronForward className="text-gray-600 text-xl" />
        </button>
      )}

      {/* Section des conversations */}
      <aside 
        className={`
          ${isMessagesRoot ? 'w-full' : 'md:w-1/3'}
          bg-white border-r border-gray-200
          ${!isMessagesRoot && !isConversationsVisible ? '-translate-x-full w-0' : ''}
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-full' : 'relative'}
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Messages</h2>
            {!isMessagesRoot && (
              <button 
                onClick={toggleConversations}
                className="text-gray-600 hover:text-gray-900"
              >
                <IoChevronBack className="text-xl" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{conversation.name}</h3>
                        <div className="text-sm text-gray-600">
                          {conversation.isTyping ? (
                            <div className="flex items-center text-blue-500">
                              <span className="animate-pulse">En train d'écrire</span>
                              <span className="ml-1 animate-bounce">...</span>
                            </div>
                          ) : (
                            <p>{conversation.lastMessage}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Section des messages - uniquement affichée quand une conversation est sélectionnée */}
      {!isMessagesRoot && (
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="p-4 border-b border-gray-200 bg-white flex items-center">
            {isMobile && (
              <button
                onClick={toggleConversations}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ☰
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {selectedConversation
                ? conversations.find((c) => c.id === selectedConversation)?.name
                : 'Sélectionnez une conversation'}
            </h2>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isMe
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <p className={`text-xs ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                    {message.isMe && (
                      <IoCheckmarkDone 
                        className={message.isRead ? 'text-green-400' : 'text-blue-100'} 
                        size={16}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <footer className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Envoyer
              </button>
            </div>
          </footer>
        </div>
      )}
    </section>
  );
} 