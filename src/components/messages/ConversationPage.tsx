'use client'

import { useState, useEffect, useRef } from "react";
import { IoArrowBack } from 'react-icons/io5';
import { IoTrash } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useConversations, useMessages, useMarkMessagesAsRead, useDeleteConversation } from '../../hooks/react-query/messages';
import { useQueryClient } from '@tanstack/react-query';

// Constantes pour les classes CSS communes
const COMMON_TRANSITION = 'transition-all duration-300 ease-in-out';
const COMMON_BUTTON_CLASSES = 'flex items-center justify-center rounded-full transition-colors';
const COMMON_ICON_CLASSES = 'w-5 h-5 text-gray-600';

interface ConversationPageProps {
    readonly initialConversationId?: string;
}

export default function ConversationPage({ initialConversationId }: ConversationPageProps) {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId ?? null);
    const [newMessage, setNewMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedConversation = useRef<string | null>(null);

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
        getOnlineUsers,
        deleteConversation
    } = useMessagesSocket();

    const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
    const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation ?? '');
    const markAsReadMutation = useMarkMessagesAsRead();
    const deleteConversationMutation = useDeleteConversation();
    const queryClient = useQueryClient();

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

    const handleDeleteConversation = async () => {
        if (!selectedConversation) return;
        setShowDeleteConfirm(true);
    };

    const confirmDeleteConversation = async () => {
        if (!selectedConversation) return;
        
        setIsDeleting(true);
        
        try {
            console.log('🗑️ Suppression de la conversation:', selectedConversation);
            
            // Envoyer la demande de suppression via WebSocket pour notifier l'autre utilisateur
            deleteConversation(selectedConversation);
            
            // Attendre un peu pour que le WebSocket traite la suppression
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Vérifier si la conversation existe encore avant d'appeler l'API REST
            const conversations = queryClient.getQueryData(['conversations']) as any[] | undefined;
            const conversationStillExists = conversations?.some(c => c.id === selectedConversation);
            
            if (conversationStillExists) {
                // La conversation existe encore, essayer l'API REST
                try {
                    await deleteConversationMutation.mutateAsync(selectedConversation);
                } catch (apiError) {
                    console.warn('⚠️ Erreur API REST, mais suppression WebSocket réussie:', apiError);
                    // La suppression WebSocket a probablement déjà fonctionné
                }
            }
            
            console.log('✅ Conversation supprimée avec succès');
            setShowDeleteConfirm(false);    
            
        } catch (error) {
            console.error('❌ Erreur lors de la suppression de la conversation:', error);
            alert('Erreur lors de la suppression de la conversation');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDeleteConversation = () => {
        if (!isDeleting) {
            setShowDeleteConfirm(false);
        }
    };

    // Gestion de la fermeture de la popup avec Échap
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showDeleteConfirm && !isDeleting) {
                setShowDeleteConfirm(false);
            }
        };

        if (showDeleteConfirm) {
            document.addEventListener('keydown', handleEscape);
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showDeleteConfirm, isDeleting]);

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

    // Rediriger si la conversation affichée est supprimée par l'autre utilisateur
    useEffect(() => {
        if (!selectedConversation || !conversations) return;
        
        console.log('🔍 Vérification conversation:', selectedConversation);
        console.log('📋 Conversations disponibles:', conversations.map(c => c.id));
        
        const conversationExists = conversations.some(c => c.id === selectedConversation);
        console.log('🔍 Conversation existe:', conversationExists);
        
        if (!conversationExists) {
            console.log('🚨 Conversation supprimée, redirection...');
            router.push('/messages');
        }
    }, [selectedConversation, conversations, router]);

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
                                    src={selectedConversationData.avatar ?? '/img.png'}
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
                                {selectedConversationData?.name ?? "Messages"}
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
                    {/* Bouton de suppression */}
                    {selectedConversation && (
                        <button 
                            onClick={handleDeleteConversation}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            aria-label="Supprimer la conversation"
                            title="Supprimer la conversation"
                        >
                            <IoTrash className="w-5 h-5" />
                        </button>
                    )}
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
            
            {/* Popup de confirmation de suppression */}
            {showDeleteConfirm && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={!isDeleting ? cancelDeleteConversation : undefined}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <IoTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Supprimer la conversation
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Cette action est irréversible
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                            Êtes-vous sûr de vouloir supprimer cette conversation ? 
                            Tous les messages seront définitivement supprimés et l'autre utilisateur sera notifié.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDeleteConversation}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDeleteConversation}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Suppression...
                                    </>
                                ) : (
                                    'Supprimer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}