'use client'

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from "react";
import { useConversations, useDeleteConversation, useMarkMessagesAsRead, useMessages } from '../../hooks/react-query/messages';
import { useMessagesSocket } from '../../hooks/useMessagesSocket';
import { Message } from '../../lib/routes/messages/interfaces/message.interface';
import {
    MessageAlignment,
    MessageClasses,
    ReadIndicatorClasses,
    ReadIndicators,
    TimestampClasses,
    UserStatus
} from '../../lib/utils/message-styles';
import { getCurrentUserIdFromToken } from '../../lib/utils/user-utils';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { MessageReactions } from './MessageReactions';
import { MessageReply } from './MessageReply';
import { OnlineStatus } from './OnlineStatus';
import { TypingIndicator } from './TypingIndicator';

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

    // Function to mark messages as read with debounce
    const debouncedMarkAsRead = useCallback((conversationId: string) => {
        // Cancel the previous timeout if it exists
        if (markAsReadTimeoutRef.current) {
            clearTimeout(markAsReadTimeoutRef.current);
        }

        // Create a new timeout
        markAsReadTimeoutRef.current = setTimeout(() => {
            markAsRead(conversationId);
            markAsReadMutation.mutate(conversationId);
            markAsReadTimeoutRef.current = null;
        }, 1000); // 1 second delay
    }, [markAsRead, markAsReadMutation]);

    // Effet pour rejoindre/quitter les conversations
    useEffect(() => {
        if (selectedConversation && isConnected) {
            joinConversation(selectedConversation);

            // Marquer les messages comme lus quand on rejoint une conversation
            if (messages.length > 0) {
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
            // Check if there are unread messages from the other user
            const unreadMessages = messages.filter(message => !message.isMe && !message.isRead);

            if (unreadMessages.length > 0) {
                debouncedMarkAsRead(selectedConversation);
            }
        }
    }, [messages, selectedConversation, isConnected]);

    // Effet pour marquer les nouveaux messages comme lus en temps réel
    useEffect(() => {
        if (selectedConversation && isConnected) {
            // Create an interval to periodically check for new unread messages
            const interval = setInterval(() => {
                const unreadMessages = messages.filter(message =>
                    !message.isMe &&
                    !message.isRead &&
                    message.conversationId === selectedConversation
                );

                if (unreadMessages.length > 0) {
                    debouncedMarkAsRead(selectedConversation);
                }
            }, 3000); // Check every 3 seconds

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
            // Send message via socket (server handles persistence)
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
            console.error('❌ Error sending message:', error);
            // Put the message back in the field in case of error
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
            // Send deletion request via WebSocket to notify the other user
            deleteConversation(selectedConversation);

            // Wait a bit for the WebSocket to process the deletion
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if the conversation still exists before calling the REST API
            const conversations = queryClient.getQueryData(['conversations']);
            const conversationStillExists = Array.isArray(conversations) && conversations.some(c => c.id === selectedConversation);

            if (conversationStillExists) {
                // La conversation existe encore, essayer l'API REST
                try {
                    await deleteConversationMutation.mutateAsync(selectedConversation);
                } catch (apiError) {
                    console.warn('⚠️ REST API error, but WebSocket deletion successful:', apiError);
                    // The WebSocket deletion probably already worked
                }
            }

            setShowDeleteConfirm(false);

        } catch (error) {
            console.error('❌ Error deleting conversation:', error);
            alert('Error deleting conversation');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDeleteConversation = () => {
        if (!isDeleting) {
            setShowDeleteConfirm(false);
        }
    };

    // Handling popup closing with Escape key and focus
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

    // Check if the other user is online
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

    // Prepare the messages content
    let messagesContent;
    if (messagesLoading) {
        messagesContent = <LoadingState message="Loading messages..." size="sm" />;
    } else if (messages.length === 0) {
        messagesContent = <EmptyState title="No messages" description="Be the first to send a message!" />;
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

    // Prepare user name and status
    const conversationName = selectedConversationData?.name ?? "Messages";
    const userStatus = selectedConversationData ? UserStatus.getStatus(isOtherUserOnline) : null;

    const handleReplyToMessage = (message: Message) => {
        setReplyToMessage(message);
        // Set focus on the input after a short delay to ensure the DOM is updated
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyToMessage(null);
        // Keep focus on the input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-130px)]">
            {/* Header with back button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-background">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => router.push('/messages')}
                        aria-label="Back to conversations"
                    >
                        <ArrowLeft className="w-5 h-5 text-background" />
                    </Button>
                    {/* Avatar and person's name */}
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
                        <Button
                            onClick={handleDeleteConversation}
                            aria-label="Delete conversation"
                            title="Delete conversation"
                            variant="destructive"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 messages-container">
                {messagesContent}
            </div>
            {/* Input bar */}
            <div className="p-4">
                {/* Reply indicator */}
                {replyToMessage && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-secondary">Reply to:</span>
                                <span className="text-sm text-secondary truncate">{replyToMessage.content}</span>
                            </div>
                            <Button
                                onClick={handleCancelReply}
                                title="Cancel reply"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder={replyToMessage ? "Write your reply..." : "Write your message..."}
                        disabled={!isConnected}
                        ref={inputRef}
                        className="h-[50px]"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!selectedConversation || !newMessage.trim() || !isConnected}
                    >
                        Send
                    </Button>
                </div>
            </div>
            {/* Deletion confirmation popup */}
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
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 id="delete-dialog-title" className="text-lg font-semibold text-gray-900">
                                    Delete conversation
                                </h3>
                                <p className="text-sm text-gray-500">
                                    This action is irreversible
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-800 mb-6">
                            Are you sure you want to delete this conversation?
                            All messages will be permanently deleted and the other user will be notified.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={cancelDeleteConversation}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDeleteConversation}
                                disabled={isDeleting}
                                variant="destructive"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
