'use client';

import { useState, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { mockConversations, getMessagesForConversation } from '../data/mockData';
import type { Conversation, Message } from '../types';

interface MessagesLayoutProps {
  initialSelectedConversation?: number;
}

export default function MessagesLayout({ initialSelectedConversation }: MessagesLayoutProps) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(initialSelectedConversation || null);
  const [isConversationsVisible, setIsConversationsVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isMessagesRoot = pathname === '/messages';
  const { isMobile } = useWindowWidth();

  useEffect(() => {
    if (isMessagesRoot) {
      setIsConversationsVisible(true);
      setSelectedConversation(null);
    }
  }, [isMessagesRoot]);

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
            {mockConversations.map((conversation) => (
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
                ? mockConversations.find((c) => c.id === selectedConversation)?.name
                : 'Sélectionnez une conversation'}
            </h2>
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConversation && getMessagesForConversation(selectedConversation).map((message) => (
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