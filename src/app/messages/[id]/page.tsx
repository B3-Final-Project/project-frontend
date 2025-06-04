'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { IoCheckmarkDone, IoSend, IoImage } from 'react-icons/io5';
import { getMessages, addMessage } from '@/components/messages/messagesStore';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
}

interface ConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CONVERSATION_NAMES: { [key: number]: string } = {
  1: "Alice Martin",
  2: "Thomas Bernard",  
  3: "Marie Dubois",
  4: "Lucas Petit",
  5: "Emma Richard"
};

export default function ConversationPage({ params }: ConversationPageProps) {
  const resolvedParams = use(params);
  const conversationId = parseInt(resolvedParams.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!CONVERSATION_NAMES[conversationId]) {
      router.push('/messages');
      return;
    }
    setMessages(getMessages(conversationId));
  }, [conversationId, router]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addMessage(conversationId, newMessage.trim(), "Moi");
    setMessages(getMessages(conversationId));
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!CONVERSATION_NAMES[conversationId]) {
    return null;
  }

  return (
    <div className="flex flex-col h-[100vh] bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-3 py-2 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
              <div className="flex-shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${CONVERSATION_NAMES[conversationId]}`}
                  alt={CONVERSATION_NAMES[conversationId]}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                  {CONVERSATION_NAMES[conversationId]}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 truncate">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-2 py-3 md:px-6 md:py-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[90%] md:max-w-[75%] rounded-2xl 
                ${message.isMe 
                  ? 'bg-blue-500 text-white p-2 md:p-3' 
                  : 'bg-white text-gray-900 shadow-sm border border-gray-100 p-2.5 md:p-3.5'
                }
                ${index === messages.length - 1 ? 'animate-fade-in' : ''}
              `}
            >
              <p className="text-[13px] md:text-[15px] leading-relaxed break-words">{message.content}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <p className={`text-[10px] md:text-xs ${
                  message.isMe ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
                {message.isMe && (
                  <IoCheckmarkDone 
                    className={message.isRead ? 'text-green-400' : 'text-blue-100'} 
                    size={12}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="border-t border-gray-100 bg-white">
        <div className="px-2 py-2 md:px-4 md:py-3">
          <div className="flex items-end gap-2 bg-gray-50 rounded-xl p-2">
            <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <IoImage className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-700 placeholder-gray-400 py-1 md:py-2 px-2 text-sm md:text-base min-h-[36px] md:min-h-[42px]"
            />
            <button 
              onClick={handleSendMessage}
              className={`
                p-1.5 md:p-2 rounded-xl min-w-[32px] md:min-w-[40px]
                ${newMessage.trim() 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                transition-colors
              `}
              disabled={!newMessage.trim()}
            >
              <IoSend className="w-4 h-4 md:w-5 md:h-5 mx-auto" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 