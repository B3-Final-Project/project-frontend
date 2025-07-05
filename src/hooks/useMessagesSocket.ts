import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { Message, Conversation, NewMatchData } from '../lib/routes/messages/interfaces/message.interface';
import { getCurrentUserIdFromToken } from '../lib/utils/user-utils';

// Set global pour tracker les messages déjà traités
const processedMessages = new Set<string>();

// Utilitaires pour les mises à jour de cache
const createCacheUpdater = (queryClient: ReturnType<typeof useQueryClient>) => ({
  updateMessages: (conversationId: string, updater: (oldData: Message[] | undefined) => Message[] | undefined) => {
    queryClient.setQueryData(['messages', conversationId], updater);
  },
  updateConversations: (updater: (oldData: Conversation[] | undefined) => Conversation[] | undefined) => {
    queryClient.setQueryData(['conversations'], updater);
  }
});

// Fonctions utilitaires pour les mises à jour des données
const createUpdateMessagesData = (queryClient: ReturnType<typeof useQueryClient>) => {
  const { updateMessages } = createCacheUpdater(queryClient);
  
  return (conversationId: string, correctedMessage: Message) => {
    updateMessages(conversationId, (oldData) => {
      if (!oldData) return [correctedMessage];
      
      const existingMessage = oldData.find(m => m.id === correctedMessage.id);
      if (existingMessage) {
        console.log('⚠️ Message déjà dans la liste, ignoré:', correctedMessage.id);
        return oldData;
      }
      
      return [...oldData, correctedMessage];
    });
  };
};

const createUpdateConversationsData = (queryClient: ReturnType<typeof useQueryClient>) => {
  const { updateConversations } = createCacheUpdater(queryClient);
  
  return (conversationId: string, correctedMessage: Message, isMe: boolean) => {
    updateConversations((oldData) => {
      if (!oldData) return [];
      
      return oldData.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: correctedMessage,
            unread: conv.unread + (isMe ? 0 : 1),
            lastActive: correctedMessage.timestamp,
          };
        }
        return conv;
      });
    });
  };
};

const createUpdateConversationsForRead = (queryClient: ReturnType<typeof useQueryClient>) => {
  const { updateConversations } = createCacheUpdater(queryClient);
  
  return (conversationId: string) => {
    updateConversations((oldData) => {
      if (!oldData) return [];
      
      return oldData.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unread: 0,
          };
        }
        return conv;
      });
    });
  };
};

const createUpdateConversationsForUnread = (queryClient: ReturnType<typeof useQueryClient>) => {
  const { updateConversations } = createCacheUpdater(queryClient);
  
  return (conversationId: string, messageCount: number) => {
    updateConversations((oldData) => {
      if (!oldData) return [];
      
      return oldData.map(conv => {
        if (conv.id === conversationId) {
          console.log(`📈 Mise à jour du compteur pour la conversation ${conversationId}: ${conv.unread} + ${messageCount}`);
          return {
            ...conv,
            unread: conv.unread + messageCount,
          };
        }
        return conv;
      });
    });
  };
};

const createRemoveConversation = (queryClient: ReturnType<typeof useQueryClient>) => {
  const { updateConversations } = createCacheUpdater(queryClient);
  
  return (conversationId: string) => {
    updateConversations((oldData) => {
      if (!oldData) return [];
      return oldData.filter(conv => conv.id !== conversationId);
    });
  };
};

// Fonction pour gérer les messages traités
const handleProcessedMessage = (messageId: string | undefined) => {
  if (!messageId) return false;
  
  if (processedMessages.has(messageId)) {
    console.log('⚠️ Message déjà présent, ignoré:', messageId);
    return true;
  }
  
  processedMessages.add(messageId);
  
  // Limiter la taille du Set pour éviter les fuites mémoire
  if (processedMessages.size > 1000) {
    const firstKey = processedMessages.values().next().value;
    if (firstKey) {
      processedMessages.delete(firstKey);
    }
  }
  
  return false;
};

// Création des handlers
const createMessageHandlers = (queryClient: ReturnType<typeof useQueryClient>, toast: (props: { title: string; description?: string; variant?: "default" | "destructive" | null; onClick?: () => void }) => void, router: any) => {
  const updateMessagesData = createUpdateMessagesData(queryClient);
  const updateConversationsData = createUpdateConversationsData(queryClient);
  const updateConversationsForRead = createUpdateConversationsForRead(queryClient);
  const updateConversationsForUnread = createUpdateConversationsForUnread(queryClient);
  const removeConversation = createRemoveConversation(queryClient);

  return {
    handleNewMessage: (message: Message) => {
      if (handleProcessedMessage(message.id)) {
        return;
      }
      
      const currentUserId = getCurrentUserIdFromToken();
      const isMe = Boolean(currentUserId && message.sender_id === currentUserId);
      
      const correctedMessage = {
        ...message,
        isMe
      };
      
      updateMessagesData(message.conversationId, correctedMessage);
      updateConversationsData(message.conversationId, correctedMessage, isMe);
    },

    handleMessagesRead: (data: { conversationId: string; readBy: string; timestamp: Date }) => {
      console.log('📖 Événement messagesRead reçu:', data);
      
      const { updateMessages } = createCacheUpdater(queryClient);
      
      // Mettre à jour les messages de cette conversation
      updateMessages(data.conversationId, (oldData) => {
        if (!oldData) return oldData;
        
        const updatedData = oldData.map(message => {
          // Si c'est notre message et qu'il n'est pas encore marqué comme lu
          if (message.isMe && !message.isRead) {
            console.log('📖 Mise à jour du statut lu pour le message:', message.id);
            return {
              ...message,
              isRead: true
            };
          }
          return message;
        });
        
        console.log('📖 Messages mis à jour avec le statut lu:', updatedData.length);
        return updatedData;
      });
      
      // Mettre à jour la liste des conversations
      updateConversationsForRead(data.conversationId);
    },

    handleUserTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => {
      return (prev: Map<string, Set<string>>) => {
        const newMap = new Map(prev);
        
        if (data.isTyping) {
          const users = new Set(newMap.get(data.conversationId) ?? []);
          users.add(data.userId);
          newMap.set(data.conversationId, users);
        } else {
          const users = new Set(newMap.get(data.conversationId) ?? []);
          users.delete(data.userId);
          if (users.size === 0) {
            newMap.delete(data.conversationId);
          } else {
            newMap.set(data.conversationId, users);
          }
        }
        
        return newMap;
      };
    },

    handleUserOnline: (data: { userId: string }) => {
      return (prev: Set<string>) => new Set([...prev, data.userId]);
    },

    handleUserOffline: (data: { userId: string }) => {
      return (prev: Set<string>) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      };
    },

    handleOnlineUsers: (data: { users: string[] }) => {
      const uniqueUsers = Array.from(new Set(data.users));
      return new Set(uniqueUsers);
    },

    handleUnreadMessage: (data: { conversationId: string; messageCount: number; timestamp: Date }) => {
      updateConversationsForUnread(data.conversationId, data.messageCount);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },

    // Gestion des nouveaux matches - mise à jour du cache uniquement
    // Les notifications sont gérées dans GlobalMessageNotifications.tsx
    handleNewMatch: (data: NewMatchData) => {
      console.log('Nouveau match reçu dans useMessagesSocket', data);
      
      const { updateConversations } = createCacheUpdater(queryClient);
      
      // Mettre à jour le cache des conversations
      updateConversations((oldData) => {
        if (!oldData) return [data.conversation];
        if (oldData.some(conv => conv.id === data.conversation.id)) {
          return oldData;
        }
        return [data.conversation, ...oldData];
      });
    },

    handleConversationDeleted: (data: { conversationId: string; deletedBy: string; timestamp: Date }) => {
      removeConversation(data.conversationId);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },

    handleMessageReactionUpdated: (message: Message) => {
      console.log('🔄 Événement de réaction reçu:', message);
      const currentUserId = getCurrentUserIdFromToken();
      const correctedMessage = {
        ...message,
        isMe: message.sender_id === currentUserId
      };
      console.log('🔄 Message corrigé:', correctedMessage);
      
      const { updateMessages } = createCacheUpdater(queryClient);
      
      // Vérifier si le message existe déjà dans le cache
      updateMessages(message.conversationId, (oldData) => {
        if (!oldData) return [correctedMessage];
        
        // Vérifier si le message a déjà été mis à jour récemment
        const existingMessage = oldData.find(m => m.id === message.id);
        if (existingMessage && JSON.stringify(existingMessage.reactions) === JSON.stringify(message.reactions)) {
          console.log('🔄 Message déjà à jour, ignoré');
          return oldData;
        }
        
        const updatedData = oldData.map(m => m.id === message.id ? correctedMessage : m);
        console.log('🔄 Cache mis à jour:', updatedData);
        return updatedData;
      });
    }
  };
};

export const useMessagesSocket = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const currentConversationRef = useRef<string | null>(null);
  const listenersInitialized = useRef(false);
  const handlersRef = useRef<ReturnType<typeof createMessageHandlers> | null>(null);

  // Fonction pour envoyer un message via socket
  const sendMessage = useCallback((messageData: {
    conversation_id: string;
    content: string;
    reply_to_id?: string;
  }) => {
    if (!socket || !isConnected) {
      console.error('❌ Impossible d\'envoyer via WebSocket: socket non connecté');
      return;
    }
    
    socket.emit('sendMessage', messageData);
  }, [socket, isConnected]);

  // Fonction pour rejoindre une conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (!socket || !isConnected) {
      console.error('❌ Impossible de rejoindre la conversation: socket non connecté');
      return;
    }
    
    console.log('🔗 Rejoindre la conversation:', conversationId);
    
    if (currentConversationRef.current) {
      console.log('🔗 Quitter la conversation précédente:', currentConversationRef.current);
      socket.emit('leaveConversation', currentConversationRef.current);
    }
    
    socket.emit('joinConversation', conversationId);
    currentConversationRef.current = conversationId;
    setCurrentConversationId(conversationId);
    console.log('🔗 Conversation rejointe avec succès:', conversationId);
  }, [socket, isConnected]);

  // Fonction pour quitter une conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (!socket || !isConnected) return;
    
    socket.emit('leaveConversation', conversationId);
    if (currentConversationRef.current === conversationId) {
      currentConversationRef.current = null;
      setCurrentConversationId(null);
    }
  }, [socket, isConnected]);

  // Ref pour tracker le dernier état de frappe envoyé
  const lastTypingStateRef = useRef<string>('');

  // Fonction pour gérer l'indicateur de frappe avec debounce
  const handleTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      // Éviter d'envoyer le même état plusieurs fois de suite
      const key = `${conversationId}-${isTyping}`;
      if (lastTypingStateRef.current === key) {
        return;
      }
      lastTypingStateRef.current = key;
      
      socket.emit('typing', { conversationId, isTyping });
    }
  }, [socket, isConnected]);

  // Fonction pour marquer les messages comme lus
  const markAsRead = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('markAsRead', conversationId);
    }
  }, [socket, isConnected]);

  // Fonction pour créer une conversation
  const createConversation = useCallback((conversationData: {
    user2_id: string;
  }) => {
    if (socket && isConnected) {
      socket.emit('createConversation', conversationData);
    }
  }, [socket, isConnected]);

  // Fonction pour supprimer une conversation
  const deleteConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('deleteConversation', conversationId);
    }
  }, [socket, isConnected]);

  // Fonction pour obtenir les utilisateurs en ligne
  const getOnlineUsers = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('getOnlineUsers');
    }
  }, [socket, isConnected]);

  // Fonction pour ajouter une réaction
  const addReaction = useCallback((data: { message_id: string; emoji: string }) => {
    if (socket && isConnected) {
      console.log('🔗 Émission addReaction via WebSocket:', data);
      socket.emit('addReaction', data);
    } else {
      console.error('❌ Impossible d\'ajouter une réaction: socket non connecté');
    }
  }, [socket, isConnected]);

  // Fonction pour supprimer une réaction
  const removeReaction = useCallback((data: { message_id: string; emoji: string }) => {
    if (socket && isConnected) {
      console.log('🔗 Émission removeReaction via WebSocket:', data);
      socket.emit('removeReaction', data);
    } else {
      console.error('❌ Impossible de supprimer une réaction: socket non connecté');
    }
  }, [socket, isConnected]);

  // Gestion des événements socket - ne se remonte qu'une seule fois
  useEffect(() => {
    if (!socket || listenersInitialized.current) return;

    listenersInitialized.current = true;

    // Créer les handlers
    const handlers = createMessageHandlers(queryClient, toast, router);
    handlersRef.current = handlers;

    // Écouter les événements
    socket.on('newMessage', handlers.handleNewMessage);
    socket.on('newMatch', handlers.handleNewMatch);
    socket.on('messagesRead', handlers.handleMessagesRead);
    socket.on('userTyping', (data) => setTypingUsers(handlers.handleUserTyping(data)));
    socket.on('userOnline', (data) => setOnlineUsers(handlers.handleUserOnline(data)));
    socket.on('userOffline', (data) => setOnlineUsers(handlers.handleUserOffline(data)));
    socket.on('onlineUsers', (data) => setOnlineUsers(handlers.handleOnlineUsers(data)));
    socket.on('unreadMessage', handlers.handleUnreadMessage);
    socket.on('conversationDeleted', handlers.handleConversationDeleted);
    socket.on('messageReactionAdded', handlers.handleMessageReactionUpdated);
    socket.on('messageReactionRemoved', handlers.handleMessageReactionUpdated);

    // Nettoyer les listeners
    return () => {
      if (handlersRef.current) {
        const handlers = handlersRef.current;
        socket.off('newMessage', handlers.handleNewMessage);
        socket.off('newMatch', handlers.handleNewMatch);
        socket.off('messagesRead', handlers.handleMessagesRead);
        socket.off('userTyping', handlers.handleUserTyping);
        socket.off('userOnline', handlers.handleUserOnline);
        socket.off('userOffline', handlers.handleUserOffline);
        socket.off('onlineUsers', handlers.handleOnlineUsers);
        socket.off('unreadMessage', handlers.handleUnreadMessage);
        socket.off('conversationDeleted', handlers.handleConversationDeleted);
        socket.off('messageReactionAdded', handlers.handleMessageReactionUpdated);
        socket.off('messageReactionRemoved', handlers.handleMessageReactionUpdated);
      }
      listenersInitialized.current = false;
      handlersRef.current = null;
    };
  }, [socket]);

  // Effet pour réinitialiser le flag quand le socket change
  useEffect(() => {
    if (!socket) {
      listenersInitialized.current = false;
    }
  }, [socket]);

  // Fonction pour gérer la frappe avec délai
  const startTyping = useCallback((conversationId: string) => {
    // Si on a déjà un timeout en cours, le réinitialiser
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Envoyer l'état "en train de taper"
    handleTyping(conversationId, true);
    
    // Programmer l'arrêt de la frappe dans 3 secondes
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(conversationId, false);
      typingTimeoutRef.current = null;
    }, 3000);
  }, [handleTyping]);

  const stopTyping = useCallback((conversationId: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    handleTyping(conversationId, false);
  }, [handleTyping]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Obtenir les utilisateurs en train de taper pour une conversation
  const getTypingUsers = useCallback((conversationId: string): string[] => {
    const typingUserIds = Array.from(typingUsers.get(conversationId) ?? []);
    
    const conversations = queryClient.getQueryData(['conversations']);
    if (!Array.isArray(conversations)) return typingUserIds.map(() => 'Quelqu\'un');
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return typingUserIds.map(() => 'Quelqu\'un');
    
    return typingUserIds
      .filter(userId => userId !== getCurrentUserIdFromToken())
      .map(() => conversation.name ?? 'Quelqu\'un');
  }, [typingUsers, queryClient]);

  // Vérifier si un utilisateur est en ligne
  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Effet pour obtenir les utilisateurs en ligne au chargement
  useEffect(() => {
    if (isConnected) {
      getOnlineUsers();
    }
  }, [isConnected]);

  // Effet pour obtenir les utilisateurs en ligne quand on rejoint une conversation
  useEffect(() => {
    if (isConnected && currentConversationId) {
      getOnlineUsers();
    }
  }, [isConnected]);

  return {
    // État
    isConnected,
    typingUsers: typingUsers,
    onlineUsers: onlineUsers,
    currentConversationId,
    
    // Actions
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markAsRead,
    createConversation,
    deleteConversation,
    getOnlineUsers,
    addReaction,
    removeReaction,
    
    // Utilitaires
    getTypingUsers,
    isUserOnline,
  };
};