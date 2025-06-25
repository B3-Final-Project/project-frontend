'use client'

import { ReactNode, useState, useEffect } from "react";
import { IoChevronForward, IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import type { Conversation, Message } from './types';
import { mockConversations } from './mockData';
import { getMessages, addMessage } from './messagesStore';
import ConversationItem from './ConversationItem';

// Constantes pour les classes CSS communes
const COMMON_TRANSITION = 'transition-all duration-300 ease-in-out';
const COMMON_BUTTON_CLASSES = 'flex items-center justify-center rounded-full transition-colors';
const COMMON_ICON_CLASSES = 'w-5 h-5 text-gray-600';

export default function ConversationPage() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (selectedConversation) {
            setMessages(getMessages(selectedConversation));
        }
    }, [selectedConversation]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        addMessage(selectedConversation, newMessage.trim(), "Moi");
        setMessages(getMessages(selectedConversation));
        setNewMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleConversationSelect = (conversationId: string) => {
        setSelectedConversation(conversationId);
        router.push(`/messages/${conversationId}`);
    };

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden">
            {/* Panneau des conversations */}
            <div className={`${COMMON_TRANSITION} ${
                isExpanded ? "w-full md:w-[35%] lg:w-[30%] 2xl:w-[25%] max-w-[450px]" : "w-0"
            } min-w-0 border-r border-gray-200 bg-white`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">Conversations</h1>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`${COMMON_BUTTON_CLASSES} p-2 hover:bg-gray-100 md:block hidden`}
                        aria-label={isExpanded ? "Réduire" : "Agrandir"}
                    >
                        <IoChevronForward className={`${COMMON_ICON_CLASSES} ${COMMON_TRANSITION} ${
                            isExpanded ? "" : "rotate-180"
                        }`} />
                    </button>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                    {mockConversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={selectedConversation === conversation.id}
                            isExpanded={isExpanded}
                            onClick={() => handleConversationSelect(conversation.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col flex-1 h-full min-w-0 bg-white">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {selectedConversation 
                            ? mockConversations.find(c => c.id === selectedConversation)?.name 
                            : "Messages"}
                    </h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
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
                                `}
                            >
                                <p className="text-[13px] md:text-[15px] leading-relaxed break-words">
                                    {message.content}
                                </p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                    <p className={`text-[10px] md:text-xs ${
                                        message.isMe ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Écrivez votre message..."
                            className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!selectedConversation}
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!selectedConversation || !newMessage.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className={`${COMMON_BUTTON_CLASSES} fixed md:hidden top-4 left-4 p-2 bg-white shadow-md hover:bg-gray-50`}
                        aria-label="Afficher les conversations"
                    >
                        <IoChevronForward className={`${COMMON_ICON_CLASSES} rotate-180`} />
                    </button>
                )}
            </div>
        </div>
    );
}
