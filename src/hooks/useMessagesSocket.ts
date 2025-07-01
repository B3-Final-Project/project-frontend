import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { Message, Conversation } from '../lib/routes/messages/interfaces/message.interface';

interface TypingUser {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

interface OnlineUser {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

// Set global pour tracker les messages déjà traités
const processedMessages = new Set<string>();

export const useMessagesSocket = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const listenersInitialized = useRef(false);
  const handlersRef = useRef<{
    handleNewMessage: (message: Message) => void;
    handleNewConversation: (conversation: Conversation) => void;
    handleMessagesRead: (data: { conversationId: string; readBy: string; timestamp: Date }) => void;
    handleUserTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => void;
    handleUserOnline: (data: { userId: string }) => void;
    handleUserOffline: (data: { userId: string }) => void;
    handleOnlineUsers: (data: { users: string[] }) => void;
    handleUnreadMessage: (data: { conversationId: string; messageCount: number; timestamp: Date }) => void;
    handleConversationDeleted: (data: { conversationId: string; deletedBy: string; timestamp: Date }) => void;
  } | null>(null);

  // Fonction pour envoyer un message via socket
  const sendMessage = useCallback((messageData: {
    conversation_id: string;
    content: string;
  }) => {
    console.log('🔌 Tentative d\'envoi WebSocket:', { isConnected, socket: !!socket, messageData });
    
    if (socket && isConnected) {
      console.log('✅ Envoi WebSocket en cours...');
      socket.emit('sendMessage', messageData);
      
      // Ajouter un listener pour confirmer l'envoi
      socket.once('messageSent', (data) => {
        console.log('✅ Message confirmé par le serveur WebSocket:', data);
      });
      
      socket.once('error', (error) => {
        console.error('❌ Erreur WebSocket lors de l\'envoi:', error);
      });
    } else {
      console.error('❌ Impossible d\'envoyer via WebSocket:', { 
        socket: !!socket, 
        isConnected, 
        messageData 
      });
    }
  }, [socket, isConnected]);

  // Fonction pour rejoindre une conversation
  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      // Quitter la conversation précédente si elle existe
      if (currentConversationId) {
        socket.emit('leaveConversation', currentConversationId);
      }
      
      socket.emit('joinConversation', conversationId);
      setCurrentConversationId(conversationId);
    }
  }, [socket, isConnected, currentConversationId]);

  // Fonction pour quitter une conversation
  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveConversation', conversationId);
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
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

    // Créer les handlers une seule fois
    handlersRef.current = {
      // Nouveau message reçu
      handleNewMessage: (message: Message) => {
        console.log('🔄 Nouveau message reçu via WebSocket:', message);
        
        // Vérifier si le message a déjà été traité
        if (message.id && processedMessages.has(message.id)) {
          console.log('⚠️ Message déjà présent, ignoré:', message.id);
          return;
        }
        
        // Marquer le message comme traité
        if (message.id) {
          processedMessages.add(message.id);
          
          // Limiter la taille du Set pour éviter les fuites mémoire
          if (processedMessages.size > 1000) {
            const firstKey = processedMessages.values().next().value;
            if (firstKey) {
              processedMessages.delete(firstKey);
            }
          }
        }
        
        console.log('✅ Message ajouté à la conversation:', message.id ?? 'ID manquant');
        
        // Récupérer l'ID utilisateur actuel depuis le token
        const token = localStorage.getItem('auth_token');
        let currentUserId: string | null = null;
        
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.sub ?? payload.username;
          } catch (error) {
            console.error('❌ Erreur lors du décodage du token:', error);
          }
        }
        
        // Recalculer isMe en comparant avec l'utilisateur actuel
        const isMe = currentUserId && message.sender_id === currentUserId;
        
        // Créer le message avec isMe recalculé
        const correctedMessage = {
          ...message,
          isMe
        };
        
        // Mettre à jour les messages de la conversation
        queryClient.setQueryData(['messages', message.conversationId], (oldData: Message[] | undefined) => {
          if (!oldData) return [correctedMessage];
          
          // Vérifier si le message existe déjà
          const existingMessage = oldData.find(m => m.id === message.id);
          if (existingMessage) {
            console.log('⚠️ Message déjà dans la liste, ignoré:', message.id);
            return oldData;
          }
          
          return [...oldData, correctedMessage];
        });

        // Mettre à jour la liste des conversations
        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.map(conv => {
            if (conv.id === message.conversationId) {
              return {
                ...conv,
                lastMessage: correctedMessage,
                unread: conv.unread + (isMe ? 0 : 1),
                lastActive: message.timestamp,
              };
            }
            return conv;
          });
        });
        
        // Invalider les requêtes pour forcer un refresh
        queryClient.invalidateQueries({ queryKey: ['messages', message.conversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },

      // Nouvelle conversation créée
      handleNewConversation: (conversation: Conversation) => {
        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
          if (!oldData) return [conversation];
          // Vérifier si la conversation existe déjà
          if (oldData.some(conv => conv.id === conversation.id)) {
            return oldData;
          }
          return [conversation, ...oldData];
        });
      },

      // Messages marqués comme lus
      handleMessagesRead: (data: { conversationId: string; readBy: string; timestamp: Date }) => {
        queryClient.setQueryData(['messages', data.conversationId], (oldData: Message[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.map(message => ({
            ...message,
            isRead: message.isMe ? message.isRead : true,
          }));
        });

        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.map(conv => {
            if (conv.id === data.conversationId) {
              return {
                ...conv,
                unread: 0,
              };
            }
            return conv;
          });
        });
      },

      // Utilisateur en train de taper
      handleUserTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => {
        setTypingUsers(prev => {
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
        });
      },

      // Utilisateur en ligne
      handleUserOnline: (data: { userId: string }) => {
        console.log('🟢 Utilisateur en ligne:', data.userId);
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      },

      // Utilisateur hors ligne
      handleUserOffline: (data: { userId: string }) => {
        console.log('🔴 Utilisateur hors ligne:', data.userId);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      },

      // Liste des utilisateurs en ligne
      handleOnlineUsers: (data: { users: string[] }) => {
        console.log('📋 Liste des utilisateurs en ligne reçue:', data.users);
        // Filtrer les doublons explicitement
        const uniqueUsers = Array.from(new Set(data.users));
        setOnlineUsers(new Set(uniqueUsers));
      },

      // Message non lu
      handleUnreadMessage: (data: { conversationId: string; messageCount: number; timestamp: Date }) => {
        console.log('🔔 Notification de message non lu reçue:', data);
        
        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.map(conv => {
            if (conv.id === data.conversationId) {
              console.log(`📈 Mise à jour du compteur pour la conversation ${data.conversationId}: ${conv.unread} + ${data.messageCount}`);
              return {
                ...conv,
                unread: conv.unread + data.messageCount,
              };
            }
            return conv;
          });
        });
        
        // Invalider les requêtes pour forcer un refresh
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },

      // Conversation supprimée
      handleConversationDeleted: (data: { conversationId: string; deletedBy: string; timestamp: Date }) => {
        console.log('🗑 Conversation supprimée:', data.conversationId);
        
        // Récupérer l'ID utilisateur actuel depuis le token
        const token = localStorage.getItem('auth_token');
        let currentUserId: string | null = null;
        
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.sub ?? payload.username;
          } catch (error) {
            console.error('❌ Erreur lors du décodage du token:', error);
          }
        }
        
        // Afficher une notification seulement si la conversation a été supprimée par l'autre utilisateur
        if (currentUserId && data.deletedBy !== currentUserId) {
          toast({
            title: "Conversation supprimée",
            description: "L'autre utilisateur a supprimé cette conversation.",
            variant: "destructive",
          });
        }
        
        queryClient.setQueryData(['conversations'], (oldData: Conversation[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.filter(conv => conv.id !== data.conversationId);
        });
        
        // Invalider les requêtes pour forcer un refresh
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    };

    // Écouter les événements avec les handlers stockés
    const handlers = handlersRef.current;
    socket.on('newMessage', handlers.handleNewMessage);
    socket.on('newConversation', handlers.handleNewConversation);
    socket.on('messagesRead', handlers.handleMessagesRead);
    socket.on('userTyping', handlers.handleUserTyping);
    socket.on('userOnline', handlers.handleUserOnline);
    socket.on('userOffline', handlers.handleUserOffline);
    socket.on('onlineUsers', handlers.handleOnlineUsers);
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
    
    // Arrêter l'indicateur de frappe après 3 secondes
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
    
    // Récupérer les données des conversations pour mapper les IDs vers les noms
    const conversations = queryClient.getQueryData(['conversations']) as Conversation[] | undefined;
    if (!conversations) return typingUserIds.map(() => 'Quelqu\'un');
    
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return typingUserIds.map(() => 'Quelqu\'un');
    
    // Récupérer l'ID utilisateur actuel depuis le token
    const token = localStorage.getItem('auth_token');
    let currentUserId: string | null = null;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.sub ?? payload.username;
      } catch (error) {
        console.error('❌ Erreur lors du décodage du token:', error);
      }
    }
    
    // Retourner les noms des utilisateurs qui tapent (exclure l'utilisateur actuel)
    return typingUserIds
      .filter(userId => userId !== currentUserId) // Exclure l'utilisateur actuel
      .map(() => conversation.name ?? 'Quelqu\'un'); // Utiliser le nom de la conversation
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
  }, [isConnected, getOnlineUsers]);

  // Effet pour obtenir les utilisateurs en ligne quand on rejoint une conversation
  useEffect(() => {
    if (isConnected && currentConversationId) {
      // Récupérer les utilisateurs en ligne quand on rejoint une conversation
      getOnlineUsers();
    }
  }, [isConnected, currentConversationId, getOnlineUsers]);

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