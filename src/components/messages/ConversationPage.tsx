'use client'

import { useState, useEffect, useRef } from "react";
import { IoArrowBack, IoTrash } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { MessageReactions } from './MessageReactions';
import { MessageReply } from './MessageReply';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { useConversations, useMessages, useMarkMessagesAsRead, useDeleteConversation } from '../../hooks/react-query/messages';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Message } from '../../lib/routes/messages/interfaces/message.interface';
import { getCurrentUserIdFromToken } from '../../lib/utils/user-utils';
import { 
    MessageAlignment, 
    MessageClasses, 
    TimestampClasses, 
    ReadIndicators, 
    ReadIndicatorClasses, 
    UserStatus 
} from '../../lib/utils/message-styles';

// Constantes pour les classes CSS communes - supprimées car non utilisées

interface ConversationPageProps {
    readonly initialConversationId?: string;
}

export default function ConversationPage({ initialConversationId }: ConversationPageProps) {
    const [selectedConversation] = useState<string | null>(initialConversationId ?? null);
    const [newMessage, setNewMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMarkedConversation = useRef<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const markAsReadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const { data: conversations = [] } = useConversations();
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
    }, [selectedConversation, isConnected]);

    // Effet pour obtenir les utilisateurs en ligne au chargement
    useEffect(() => {
        if (isConnected) {
            getOnlineUsers();
        }
    }, [isConnected]);

    // Effet pour réinitialiser l'état de frappe quand on change de conversation
    useEffect(() => {
        isTypingRef.current = false;
    }, [selectedConversation]);

    // Effet pour marquer automatiquement les nouveaux messages comme lus quand on est dans la conversation
    useEffect(() => {
        if (selectedConversation && messages.length > 0 && isConnected) {
            // Vérifier s'il y a des messages non lus de l'autre utilisateur
            const unreadMessages = messages.filter(message => !message.isMe && !message.isRead);
            
            if (unreadMessages.length > 0) {
                console.log('📖 Marquage automatique des messages comme lus:', unreadMessages.length, 'messages');
                debouncedMarkAsRead(selectedConversation);
            }
        }
    }, [messages, selectedConversation, isConnected]);

    // Effet pour marquer les nouveaux messages comme lus en temps réel
    useEffect(() => {
        if (selectedConversation && isConnected) {
            // Créer un intervalle pour vérifier périodiquement les nouveaux messages non lus
            const interval = setInterval(() => {
                const unreadMessages = messages.filter(message => 
                    !message.isMe && 
                    !message.isRead && 
                    message.conversationId === selectedConversation
                );
                
                if (unreadMessages.length > 0) {
                    console.log('📖 Vérification périodique - marquage des messages comme lus:', unreadMessages.length, 'messages');
                    debouncedMarkAsRead(selectedConversation);
                }
            }, 3000); // Vérifier toutes les 3 secondes

            return () => clearInterval(interval);
        }
    }, [selectedConversation, isConnected, messages]);

    // Effet pour marquer les messages comme lus quand on fait défiler vers le bas
    useEffect(() => {
        const handleScroll = () => {
            if (selectedConversation && isConnected) {
                const messagesContainer = document.querySelector('.messages-container');
                if (messagesContainer) {
                    const { scrollTop, scrollHeight, clientHeight } = messagesContainer as HTMLElement;
                    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px de marge
                    
                    if (isAtBottom) {
                        // Marquer les messages comme lus seulement si on est en bas
                        const unreadMessages = messages.filter(message => !message.isMe && !message.isRead);
                        if (unreadMessages.length > 0) {
                            console.log('📖 Marquage des messages comme lus (scroll en bas):', unreadMessages.length, 'messages');
                            debouncedMarkAsRead(selectedConversation);
                        }
                    }
                }
            }
        };

        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', handleScroll);
            return () => messagesContainer.removeEventListener('scroll', handleScroll);
        }
    }, [selectedConversation, isConnected, messages]);



    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        
        setNewMessage(''); // Vider le champ immédiatement pour l'UX
        setReplyToMessage(null); // Réinitialiser la réponse
        stopTyping(selectedConversation);

        try {
            // Envoyer le message via socket (le serveur gère la persistance)
            sendMessage({
                conversation_id: selectedConversation,
                content: messageContent,
                reply_to_id: replyToMessage?.id
            });
            
            // Remettre le focus sur l'input après l'envoi
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            
        } catch (error) {
            console.error('❌ Erreur lors de l&apos;envoi du message:', error);
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
            // Envoyer la demande de suppression via WebSocket pour notifier l'autre utilisateur
            deleteConversation(selectedConversation);

            // Attendre un peu pour que le WebSocket traite la suppression
            await new Promise(resolve => setTimeout(resolve, 500));

            // Vérifier si la conversation existe encore avant d'appeler l'API REST
            const conversations = queryClient.getQueryData(['conversations']);
            const conversationStillExists = Array.isArray(conversations) && conversations.some(c => c.id === selectedConversation);

            if (conversationStillExists) {
                // La conversation existe encore, essayer l'API REST
                try {
                    await deleteConversationMutation.mutateAsync(selectedConversation);
                } catch (apiError) {
                    console.warn('⚠️ Erreur API REST, mais suppression WebSocket réussie:', apiError);
                    // La suppression WebSocket a probablement déjà fonctionné
                }
            }
            
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

    // Gestion de la fermeture de la popup avec Échap et focus
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

            // Focus sur la modal quand elle s'ouvre
            setTimeout(() => {
                modalRef.current?.focus();
            }, 100);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [showDeleteConfirm, isDeleting]);

    // Ref pour éviter les appels multiples de startTyping
    const isTypingRef = useRef(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);

        // Gérer l'indicateur de frappe
        if (selectedConversation) {
            if (value.length > 0) {
                // Toujours démarrer la frappe si on a du contenu
                startTyping(selectedConversation);
                isTypingRef.current = true;
            } else {
                // Arrêter la frappe si le champ est vide
                stopTyping(selectedConversation);
                isTypingRef.current = false;
            }
        }
    };

    // Trouver la conversation sélectionnée
    const selectedConversationData = conversations.find(c => c.id === selectedConversation);

    // Vérifier si l'autre utilisateur est en ligne
    const isOtherUserOnline = selectedConversationData?.otherUserId
        ? isUserOnline(selectedConversationData.otherUserId)
        : false;

    

    // Rediriger si la conversation affichée est supprimée par l'autre utilisateur
    useEffect(() => {
        if (!selectedConversation || !conversations) return;
        
        const conversationExists = conversations.some(c => c.id === selectedConversation);
        
        if (!conversationExists) {
            router.push('/messages');
        }
    }, [selectedConversation, conversations, router]);



    // Gestionnaire de clavier pour la popup de suppression
    const handlePopupKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !isDeleting) {
            cancelDeleteConversation();
        }
    };

    // Préparer le contenu des messages
    let messagesContent;
    if (messagesLoading) {
        messagesContent = <LoadingState message="Chargement des messages..." size="sm" />;
    } else if (messages.length === 0) {
        messagesContent = <EmptyState title="Aucun message" description="Soyez le premier à envoyer un message !" />;
    } else {
        messagesContent = <>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${MessageAlignment.getAlignment(message.isMe)} group relative`}
                >
                    <div className={MessageClasses.getClasses(message.isMe)}>
                        {/* Afficher la réponse si elle existe */}
                        <MessageReply replyTo={message.replyTo} isMe={message.isMe} />
                        
                        <p className="text-[13px] md:text-[15px] leading-relaxed break-words" style={{ color: message.isMe ? 'white' : 'black' }}>
                            {message.content}
                        </p>
                        
                        <div className="flex items-center justify-end space-x-1 mt-1">
                            <p className={`text-[10px] md:text-xs ${TimestampClasses.getClasses(message.isMe)}`}>
                                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            {message.isMe && (
                                <span className={`text-[10px] md:text-xs ${ReadIndicatorClasses.getClasses(message.isRead)}`}>
                                    {ReadIndicators.getIndicator(message.isRead)}
                                </span>
                            )}
                        </div>

                        {/* Réactions et bouton répondre pour TOUS les messages */}
                        <div className="flex items-center gap-2 mt-1">
                          <MessageReactions 
                              message={message} 
                              currentUserId={getCurrentUserIdFromToken() ?? ''} 
                              isMe={message.isMe}
                          />
                          {/* Bouton répondre UNIQUEMENT pour les messages de l'autre personne */}
                          {!message.isMe && (
                            <button
                                onClick={() => handleReplyToMessage(message)}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                title="Répondre à ce message"
                                style={{ minWidth: 32, minHeight: 32 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </button>
                          )}
                        </div>
                    </div>
                </div>
            ))}
            <TypingIndicator isVisible={typingUsers.length > 0} typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
        </>;
    }

    // Préparer le nom et le statut de l'utilisateur
    const conversationName = selectedConversationData?.name ?? "Messages";
    const userStatus = selectedConversationData ? UserStatus.getStatus(isOtherUserOnline) : null;

    const handleReplyToMessage = (message: Message) => {
        setReplyToMessage(message);
        // Mettre le focus sur l'input après un court délai pour s'assurer que le DOM est mis à jour
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyToMessage(null);
        // Maintenir le focus sur l'input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    // Fonction pour marquer les messages comme lus avec debounce
    const debouncedMarkAsRead = (conversationId: string) => {
        // Annuler le timeout précédent s'il existe
        if (markAsReadTimeoutRef.current) {
            clearTimeout(markAsReadTimeoutRef.current);
        }
        
        // Créer un nouveau timeout
        markAsReadTimeoutRef.current = setTimeout(() => {
            console.log('📖 Marquage des messages comme lus (debounced):', conversationId);
            markAsRead(conversationId);
            markAsReadMutation.mutate(conversationId);
            markAsReadTimeoutRef.current = null;
        }, 1000); // Délai de 1 seconde
    };

    return (
        <div className="flex flex-col h-[calc(100vh-130px)]">
            {/* Header avec bouton retour */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white bg-opacity-50">
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
                                <Image
                                    src={selectedConversationData.avatar ?? '/img.png'}
                                    alt={selectedConversationData.name}
                                    width={40}
                                    height={40}
                                    className={`w-10 h-10 rounded-full object-cover border-2 ${isOtherUserOnline ? 'border-green-500' : 'border-gray-300'}`}
                                />
                                <div className="absolute -bottom-1 -right-1">
                                    <OnlineStatus isOnline={isOtherUserOnline} size="sm" />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold text-gray-800">
                                {conversationName}
                            </h1>
                            {userStatus && (
                                <p className="text-sm text-gray-500">{userStatus}</p>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3 messages-container">
                {messagesContent}
            </div>
            {/* Barre de saisie */}
            <div className="p-4 border-t border-gray-200 bg-white bg-opacity-50">
                {/* Indicateur de réponse */}
                {replyToMessage && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-blue-700">Répondre à :</span>
                                <span className="text-sm text-blue-600 truncate">{replyToMessage.content}</span>
                            </div>
                            <button
                                onClick={handleCancelReply}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                title="Annuler la réponse"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder={replyToMessage ? "Écrivez votre réponse..." : "Écrivez votre message..."}
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isConnected}
                        ref={inputRef}
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
                <dialog
                    open
                    className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 rounded-xl"
                    aria-modal="true"
                    aria-labelledby="delete-dialog-title"
                >
                    <button
                        type="button"
                        className="fixed inset-0 bg-black bg-opacity-50 border-0 cursor-default"
                        onClick={!isDeleting ? cancelDeleteConversation : undefined}
                        onKeyDown={handlePopupKeyDown}
                        aria-label="Fermer la modal"
                    />
                    <div
                        ref={modalRef}
                        className="relative border border-gray-200 rounded-xl shadow-2xl max-w-md w-full p-6 bg-white animate-in fade-in-0 zoom-in-95 duration-200"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <IoTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
                                    Supprimer la conversation
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Cette action est irréversible
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-800 mb-6">
                            Êtes-vous sûr de vouloir supprimer cette conversation ?
                            Tous les messages seront définitivement supprimés et l&apos;autre utilisateur sera notifié.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={cancelDeleteConversation}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-400 text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                onClick={confirmDeleteConversation}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                </dialog>
            )}
        </div>
    );
}
