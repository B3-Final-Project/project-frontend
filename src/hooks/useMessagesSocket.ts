import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { Message, Conversation } from '../lib/routes/messages/interfaces/message.interface';

// Interfaces supprimées car non utilisées

// Set global pour tracker les messages déjà traités
const processedMessages = new Set<string>();

// Fonctions utilitaires pour la gestion des tokens
const getCurrentUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub ?? payload.username;
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

// Fonctions utilitaires pour les mises à jour des données
const createUpdateMessagesData = (queryClient: ReturnType<typeof useQueryClient>) => {
  return (conversationId: string, correctedMessage: Message) => {
    queryClient.setQueryData(['messages', conversationId], (oldData: Message[] | undefined) => {
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
  return (conversationId: string, correctedMessage: Message, isMe: boolean) => {
    queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
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
  return (conversationId: string) => {
    queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
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

const createUpdateMessagesForRead = (queryClient: ReturnType<typeof useQueryClient>) => {
  return (conversationId: string) => {
    queryClient.setQueryData(['messages', conversationId], (oldData: Message[] | undefined) => {
      if (!oldData) return [];
      
      return oldData.map(message => ({
        ...message,
        isRead: message.isMe ? message.isRead : true,
      }));
    });
  };
};

const createUpdateConversationsForUnread = (queryClient: ReturnType<typeof useQueryClient>) => {
  return (conversationId: string, messageCount: number) => {
    queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
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
  return (conversationId: string) => {
    queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
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
const createMessageHandlers = (queryClient: ReturnType<typeof useQueryClient>, toast: (props: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void) => {
  const updateMessagesData = createUpdateMessagesData(queryClient);
  const updateConversationsData = createUpdateConversationsData(queryClient);
  const updateConversationsForRead = createUpdateConversationsForRead(queryClient);
  const updateMessagesForRead = createUpdateMessagesForRead(queryClient);
  const updateConversationsForUnread = createUpdateConversationsForUnread(queryClient);
  const removeConversation = createRemoveConversation(queryClient);

  return {
    handleNewMessage: (message: Message) => {
      console.log('🔄 Nouveau message reçu via WebSocket:', message);
      
      if (handleProcessedMessage(message.id)) {
        return;
      }
      
      console.log('✅ Message ajouté à la conversation:', message.id ?? 'ID manquant');
      
      const currentUserId = getCurrentUserIdFromToken();
      const isMe = Boolean(currentUserId && message.sender_id === currentUserId);
      
      const correctedMessage = {
        ...message,
        isMe
      };
      
      updateMessagesData(message.conversationId, correctedMessage);
      updateConversationsData(message.conversationId, correctedMessage, isMe);
      
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // Ajout du toast si ce n'est pas moi l'expéditeur
      if (!isMe) {
        // Récupérer le nom de l'expéditeur à partir de la conversation
        const conversations = queryClient.getQueryData(['conversations']) as Conversation[] | undefined;
        const conversation = conversations?.find(conv => conv.id === message.conversationId);
        const senderName = conversation?.name ?? 'Quelqu\'un';
        
        toast({
          title: `Nouveau message de ${senderName}`,
          description: message.content?.slice(0, 80) || '',
          variant: "default",
        });
      }
    },

    handleNewConversation: (conversation: Conversation) => {
      queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
        if (!oldData) return [conversation];
        if (oldData.some(conv => conv.id === conversation.id)) {
          return oldData;
        }
        return [conversation, ...oldData];
      });
      // Ajout du toast pour nouvelle conversation
      toast({
        title: `Nouvelle conversation`,
        description: conversation.name ? `Avec ${conversation.name}` : undefined,
        variant: "default",
      });
    },

    handleMessagesRead: (data: { conversationId: string; readBy: string; timestamp: Date }) => {
      updateMessagesForRead(data.conversationId);
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
      console.log('🟢 Utilisateur en ligne:', data.userId);
      return (prev: Set<string>) => new Set([...prev, data.userId]);
    },

    handleUserOffline: (data: { userId: string }) => {
      console.log('🔴 Utilisateur hors ligne:', data.userId);
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
      console.log('🔔 Notification de message non lu reçue:', data);
      
      updateConversationsForUnread(data.conversationId, data.messageCount);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },

    handleConversationDeleted: (data: { conversationId: string; deletedBy: string; timestamp: Date }) => {
      console.log('🗑 Conversation supprimée:', data.conversationId);
      
      const currentUserId = getCurrentUserIdFromToken();
      
      if (currentUserId && data.deletedBy !== currentUserId) {
        toast({
          title: "Conversation supprimée",
          description: "L'autre utilisateur a supprimé cette conversation.",
          variant: "destructive",
        });
      }
      
      removeConversation(data.conversationId);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  };
};

export const useMessagesSocket = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const listenersInitialized = useRef(false);
  const handlersRef = useRef<ReturnType<typeof createMessageHandlers> | null>(null);

  // Fonction pour envoyer un message via socket
  const sendMessage = useCallback((messageData: {
    conversation_id: string;
    content: string;
  }) => {
    console.log('🔌 Tentative d\'envoi WebSocket:', { isConnected, socket: !!socket, messageData });
    
    if (!socket || !isConnected) {
      console.error('❌ Impossible d\'envoyer via WebSocket:', { 
        socket: !!socket, 
        isConnected, 
        messageData 
      });
      return;
    }
    
    console.log('✅ Envoi WebSocket en cours...');
    socket.emit('sendMessage', messageData);
    
    socket.once('messageSent', (data) => {
      console.log('✅ Message confirmé par le serveur WebSocket:', data);
    });
    
    socket.once('error', (error) => {
      console.error('❌ Erreur WebSocket lors de l\'envoi:', error);
    });
  }, [socket, isConnected]);

  // Fonction pour rejoindre une conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (!socket || !isConnected) return;
    
    if (currentConversationId) {
      socket.emit('leaveConversation', currentConversationId);
    }
    
    socket.emit('joinConversation', conversationId);
    setCurrentConversationId(conversationId);
  }, [socket, isConnected, currentConversationId]);

  // Fonction pour quitter une conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (!socket || !isConnected) return;
    
    socket.emit('leaveConversation', conversationId);
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  }, [socket, isConnected, currentConversationId]);

  // Fonction pour gérer l'indicateur de frappe
  const handleTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
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
      console.log('🗑️ Demande de suppression de conversation via WebSocket:', conversationId);
      socket.emit('deleteConversation', conversationId);
    }
  }, [socket, isConnected]);

  // Fonction pour obtenir les utilisateurs en ligne
  const getOnlineUsers = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('getOnlineUsers');
    }
  }, [socket, isConnected]);

  // Gestion des événements socket - ne se remonte qu'une seule fois
  useEffect(() => {
    if (!socket || listenersInitialized.current) return;

    console.log('🔌 Initialisation des listeners WebSocket...');
    listenersInitialized.current = true;

    // Créer les handlers
    const handlers = createMessageHandlers(queryClient, toast);
    handlersRef.current = handlers;

    // Écouter les événements
    socket.on('newMessage', handlers.handleNewMessage);
    socket.on('newConversation', handlers.handleNewConversation);
    socket.on('messagesRead', handlers.handleMessagesRead);
    socket.on('userTyping', (data) => setTypingUsers(handlers.handleUserTyping(data)));
    socket.on('userOnline', (data) => setOnlineUsers(handlers.handleUserOnline(data)));
    socket.on('userOffline', (data) => setOnlineUsers(handlers.handleUserOffline(data)));
    socket.on('onlineUsers', (data) => setOnlineUsers(handlers.handleOnlineUsers(data)));
    socket.on('unreadMessage', handlers.handleUnreadMessage);
    socket.on('conversationDeleted', handlers.handleConversationDeleted);

    // Nettoyer les listeners
    return () => {
      console.log('🔌 Nettoyage des listeners WebSocket...');
      if (handlersRef.current) {
        const handlers = handlersRef.current;
        socket.off('newMessage', handlers.handleNewMessage);
        socket.off('newConversation', handlers.handleNewConversation);
        socket.off('messagesRead', handlers.handleMessagesRead);
        socket.off('userTyping', handlers.handleUserTyping);
        socket.off('userOnline', handlers.handleUserOnline);
        socket.off('userOffline', handlers.handleUserOffline);
        socket.off('onlineUsers', handlers.handleOnlineUsers);
        socket.off('unreadMessage', handlers.handleUnreadMessage);
        socket.off('conversationDeleted', handlers.handleConversationDeleted);
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
    handleTyping(conversationId, true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(conversationId, false);
    }, 5000);
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
    
    const currentUserId = getCurrentUserIdFromToken();
    
    return typingUserIds
      .filter(userId => userId !== currentUserId)
      .map(() => conversation.name ?? 'Quelqu\'un');
  }, [typingUsers, queryClient]);

  // Vérifier si un utilisateur est en ligne
  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Effet pour obtenir les utilisateurs en ligne au chargement
  useEffect(() => {
    if (isConnected) {
      console.log('🔍 Récupération du statut des utilisateurs en ligne...');
      getOnlineUsers();
    }
  }, [isConnected]);

  // Effet pour obtenir les utilisateurs en ligne quand on rejoint une conversation
  useEffect(() => {
    if (isConnected && currentConversationId) {
      getOnlineUsers();
    }
  }, [isConnected, currentConversationId]);

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
    
    // Utilitaires
    getTypingUsers,
    isUserOnline,
  };
}; 