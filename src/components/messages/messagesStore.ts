import type { Message, Conversation } from './types';
import { getMessagesForConversation, mockConversations } from './mockData';

// Stockage en mémoire des messages et conversations
const messagesStore: { [key: number]: Message[] } = {};
const conversationsStore: Conversation[] = [...mockConversations];
let typingTimeout: { [key: number]: NodeJS.Timeout } = {};
// Ajout d'un état de typing indépendant pour chaque utilisateur dans chaque conversation
const typingStatus: { [key: number]: { me: boolean; other: boolean } } = {};

// Initialisation avec les données mockées pour toutes les conversations
mockConversations.forEach((conv) => {
  messagesStore[conv.id] = [...getMessagesForConversation(conv.id)];
  typingStatus[conv.id] = { me: false, other: false };
});

export const getMessages = (conversationId: number): Message[] => {
  return messagesStore[conversationId] || [];
};

export const getConversations = (): Conversation[] => {
  return conversationsStore;
};

export const addMessage = (conversationId: number, content: string, sender: string): void => {
  const messages = messagesStore[conversationId] || [];
  const newMessage: Message = {
    id: messages.length + 1,
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
    conversationsStore[conversationIndex] = {
      ...conversationsStore[conversationIndex],
      lastMessage: content,
      timestamp: newMessage.timestamp,
      lastMessageDate: new Date()
    };
  }
};

export const markConversationAsRead = (conversationId: number): void => {
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
};

// Nouvelle fonction pour gérer le typing indépendant
export const setTypingStatus = (conversationId: number, who: 'me' | 'other', isTyping: boolean): void => {
  if (!typingStatus[conversationId]) {
    typingStatus[conversationId] = { me: false, other: false };
  }
  typingStatus[conversationId][who] = isTyping;
  if (!isTyping && typingTimeout[conversationId]) {
    clearTimeout(typingTimeout[conversationId]);
  }
  if (isTyping) {
    if (typingTimeout[conversationId]) {
      clearTimeout(typingTimeout[conversationId]);
    }
    typingTimeout[conversationId] = setTimeout(() => {
      typingStatus[conversationId][who] = false;
    }, 2000);
  }
};

export const getTypingStatus = (conversationId: number): { me: boolean; other: boolean } => {
  return typingStatus[conversationId] || { me: false, other: false };
};

// Fonction pour obtenir le nombre de messages non lus
export const getUnreadCount = (conversationId: number): number => {
  return messagesStore[conversationId]?.filter(msg => !msg.isRead && !msg.isMe).length || 0;
}; 