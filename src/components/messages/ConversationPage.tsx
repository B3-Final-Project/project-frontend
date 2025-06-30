'use client'

import { ReactNode, useState, useEffect, useRef } from "react";
import { IoChevronForward, IoClose, IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { Conversation, Message } from '../../lib/routes/messages/interfaces/message.interface';
import ConversationItem from './ConversationItem';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { CreateConversationButton } from './CreateConversationButton';
import { NoConversationsState } from './NoConversationsState';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useConversations, useMessages, useMarkMessagesAsRead } from '../../hooks/react-query/messages';
import { useAuthToken } from '../../hooks/useAuthToken';
import { useQueryClient } from '@tanstack/react-query';

// Constantes pour les classes CSS communes
const COMMON_TRANSITION = 'transition-all duration-300 ease-in-out';
const COMMON_BUTTON_CLASSES = 'flex items-center justify-center rounded-full transition-colors';
const COMMON_ICON_CLASSES = 'w-5 h-5 text-gray-600';

interface ConversationPageProps {
    initialConversationId?: string;
}

export default function ConversationPage({ initialConversationId }: ConversationPageProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId || null);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedConversation = useRef<string | null>(null);
    const token = useAuthToken();
    const queryClient = useQueryClient();

    // Hooks pour les sockets et les données
    const {
        isConnected,
        sendMessage,
        joinConversation,
        leaveConversation,
        startTyping,
        stopTyping,
        markAsRead,
        getTypingUsers,
        isUserOnline,
        getOnlineUsers
    } = useMessagesSocket();

    const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
    const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation || '');
    const markAsReadMutation = useMarkMessagesAsRead();

    // Obtenir les utilisateurs en train de taper pour la conversation sélectionnée
    const typingUsers = selectedConversation ? getTypingUsers(selectedConversation) : [];

    // Effet pour faire défiler vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Effet pour faire défiler vers le bas quand l'indicateur de frappe apparaît
    useEffect(() => {
        if (typingUsers.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [typingUsers.length]);

    // Effet pour rejoindre une conversation quand elle est sélectionnée
    useEffect(() => {
        if (selectedConversation && isConnected) {
            joinConversation(selectedConversation);
            
            // Marquer les messages comme lus seulement si on n'a pas déjà marqué cette conversation
            if (lastMarkedConversation.current !== selectedConversation) {
                markAsRead(selectedConversation);
                markAsReadMutation.mutate(selectedConversation);
                lastMarkedConversation.current = selectedConversation;
            }
        }

        return () => {
            if (selectedConversation) {
                leaveConversation(selectedConversation);
            }
        };
    }, [selectedConversation, isConnected, joinConversation, leaveConversation, markAsRead]);

    // Effet pour obtenir les utilisateurs en ligne au chargement
    useEffect(() => {
        if (isConnected) {
            getOnlineUsers();
        }
    }, [isConnected, getOnlineUsers]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        console.log('📤 Envoi de message:', { conversationId: selectedConversation, content: messageContent });
        
        setNewMessage(''); // Vider le champ immédiatement pour l'UX
        stopTyping(selectedConversation);

        try {
            // Envoyer le message via socket (le serveur gère la persistance)
            console.log('🔌 Envoi via WebSocket...');
            sendMessage({
                conversation_id: selectedConversation,
                content: messageContent
            });
            
            console.log('✅ Message envoyé via WebSocket');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi du message:', error);
            // Remettre le message dans le champ en cas d'erreur
            setNewMessage(messageContent);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);
        
        // Gérer l'indicateur de frappe
        if (selectedConversation) {
            if (value.length > 0) {
                startTyping(selectedConversation);
            } else {
                stopTyping(selectedConversation);
            }
        }
    };

    // Trouver la conversation sélectionnée
    const selectedConversationData = conversations.find(c => c.id === selectedConversation);

    // Vérifier si l'autre utilisateur est en ligne
    const isOtherUserOnline = selectedConversationData?.otherUserId 
        ? isUserOnline(selectedConversationData.otherUserId) 
        : false;

    // Debug: afficher les informations de statut en ligne
    console.log('🔍 Debug statut en ligne:', {
        conversationId: selectedConversation,
        otherUserId: selectedConversationData?.otherUserId,
        isOtherUserOnline,
        conversationName: selectedConversationData?.name
    });

    return (
        <div className="flex flex-col md:h-full h-[calc(100vh-50px)] bg-white">
            {/* Header avec bouton retour */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/messages')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Retour aux conversations"
                    >
                        <IoArrowBack className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {/* Avatar et nom de la personne */}
                    <div className="flex items-center gap-3">
                        {selectedConversationData && (
                            <div className="relative">
                                <img
                                    src={selectedConversationData.avatar || '/img.png'}
                                    alt={selectedConversationData.name}
                                    className={`
                                        w-10 h-10 rounded-full object-cover border-2
                                        ${isOtherUserOnline ? 'border-green-500' : 'border-gray-300'}
                                    `}
                                />
                                <div className="absolute -bottom-1 -right-1">
                                    <OnlineStatus 
                                        isOnline={isOtherUserOnline} 
                                        size="sm"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {selectedConversationData?.name || "Messages"}
                            </h1>
                            {selectedConversationData && (
                                <p className="text-sm text-gray-500">
                                    {isOtherUserOnline ? 'En ligne' : 'Hors ligne'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Indicateur de connexion */}
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
            </div>
            
            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesLoading ? (
                    <LoadingState message="Chargement des messages..." size="sm" />
                ) : messages.length === 0 ? (
                    <EmptyState 
                        title="Aucun message"
                        description="Soyez le premier à envoyer un message !"
                    />
                ) : (
                    <>
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
                                            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {message.isMe && (
                                            <span className={`text-[10px] md:text-xs ${
                                                message.isRead ? 'text-blue-100' : 'text-blue-200'
                                            }`}>
                                                {message.isRead ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Indicateur de frappe */}
                        <TypingIndicator 
                            isVisible={typingUsers.length > 0}
                            typingUsers={typingUsers}
                        />
                        
                        {/* Référence pour le scroll automatique */}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            
            {/* Barre de saisie */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Écrivez votre message..."
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isConnected}
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!selectedConversation || !newMessage.trim() || !isConnected}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
}