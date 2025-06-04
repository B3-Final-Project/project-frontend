import type { Message } from './types';
import { getMessagesForConversation } from './mockData';

// Stockage en mémoire des messages
const messagesStore: { [key: number]: Message[] } = {};

// Initialisation avec les données mockées
Object.keys(getMessagesForConversation(1)).forEach((conversationId) => {
  messagesStore[Number(conversationId)] = [...getMessagesForConversation(Number(conversationId))];
});

export const getMessages = (conversationId: number): Message[] => {
  return messagesStore[conversationId] || [];
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
}; 