import type { Message, Conversation } from './types';
import { getMessagesForConversation, mockConversations } from './mockData';

// Stockage en mémoire des messages et conversations
const messagesStore: { [key: string]: Message[] } = {};
const conversationsStore: Conversation[] = [...mockConversations];
// Ajout d'un état de typing indépendant pour chaque utilisateur dans chaque conversation
const typingStatus: { [key: string]: { me: boolean; other: boolean } } = {};

// Initialisation avec les données mockées pour toutes les conversations
mockConversations.forEach((conv) => {
  messagesStore[conv.id] = [...getMessagesForConversation(conv.id)];
  typingStatus[conv.id] = { me: false, other: !!conv.isTyping };
});

export const getMessages = (conversationId: string): Message[] => {
  return messagesStore[conversationId] || [];
};

export const getConversations = (): Conversation[] => {
  return conversationsStore;
};

export const addMessage = (conversationId: string, content: string, sender: string): void => {
  const messages = messagesStore[conversationId] || [];
  const newMessage: Message = {
    id: (messages.length + 1).toString(),
    sender,
    content,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    isMe: sender === "Moi",
    isRead: false
  };
  
  messagesStore[conversationId] = [...messages, newMessage];
  
  // Mettre à jour la conversation
  const conversationIndex = conversationsStore.findIndex(c => c.id === conversationId);
  if (conversationIndex !== -1) {
    // Calculer le nouveau nombre de messages non lus
    const newUnreadCount = getUnreadCount(conversationId);
    
    conversationsStore[conversationIndex] = {
      ...conversationsStore[conversationIndex],
      lastMessage: content,
      timestamp: newMessage.timestamp,
      lastMessageDate: new Date(),
      unread: newUnreadCount
    };
  }
};

export const markConversationAsRead = (conversationId: string): void => {
  // Marquer tous les messages comme lus
  if (messagesStore[conversationId]) {
    messagesStore[conversationId] = messagesStore[conversationId].map(msg => ({
      ...msg,
      isRead: true
    }));
  }

  // Mettre à jour le compteur de messages non lus
  const conversationIndex = conversationsStore.findIndex(c => c.id === conversationId);
  if (conversationIndex !== -1) {
    conversationsStore[conversationIndex] = {
      ...conversationsStore[conversationIndex],
      unread: 0
    };
  }
  
  // Synchroniser tous les compteurs pour s'assurer de la cohérence
  syncUnreadCounts();
};

// Fonction simplifiée pour gérer le typing basé sur le contenu de l'input
export const setTypingStatus = (conversationId: string, who: 'me' | 'other', isTyping: boolean): void => {
  // Initialiser la structure si elle n'existe pas
  if (!typingStatus[conversationId]) {
    typingStatus[conversationId] = { me: false, other: false };
  }

  // Mettre à jour le statut
  typingStatus[conversationId][who] = isTyping;
};

export const getTypingStatus = (conversationId: string): { me: boolean; other: boolean } => {
  return typingStatus[conversationId] || { me: false, other: false };
};

// Fonction pour obtenir le nombre de messages non lus
export const getUnreadCount = (conversationId: string): number => {
  return messagesStore[conversationId]?.filter(msg => !msg.isRead && !msg.isMe).length || 0;
};

// Fonction pour synchroniser les compteurs de messages non lus dans toutes les conversations
export const syncUnreadCounts = (): void => {
  conversationsStore.forEach((conversation, index) => {
    const unreadCount = getUnreadCount(conversation.id);
    conversationsStore[index] = {
      ...conversation,
      unread: unreadCount
    };
  });
}; 