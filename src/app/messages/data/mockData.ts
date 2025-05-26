import { Conversation, Message } from '../types';

// Fonction utilitaire pour créer un message
const createMessage = (
  id: number,
  sender: string,
  content: string,
  timestamp: string,
  isMe: boolean,
  isRead: boolean
): Message => ({
  id,
  sender,
  content,
  timestamp,
  isMe,
  isRead,
});

// Fonction utilitaire pour créer une conversation
const createConversation = (
  id: number,
  name: string,
  lastMessage: string,
  timestamp: string,
  unread: number,
  isTyping: boolean,
  lastMessageDate: Date
): Conversation => ({
  id,
  name,
  lastMessage,
  timestamp,
  unread,
  isTyping,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.split(' ')[0]}`,
  lastMessageDate,
});

export const mockConversations: Conversation[] = [
  createConversation(
    1,
    "Alice Martin",
    "D'accord, on se voit demain !",
    "10:30",
    2,
    true,
    new Date('2024-03-20T10:30:00')
  ),
  createConversation(
    2,
    "Thomas Bernard",
    "Le projet avance bien ?",
    "09:15",
    0,
    false,
    new Date('2024-03-20T09:15:00')
  ),
  createConversation(
    3,
    "Marie Dubois",
    "Super, merci !",
    "Hier",
    1,
    false,
    new Date('2024-03-19T15:30:00')
  ),
].sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());

export const mockMessagesMap: Record<number, Message[]> = {
  1: [
    createMessage(1, "Alice Martin", "Salut ! Comment vas-tu ?", "10:00", false, true),
    createMessage(2, "Moi", "Très bien merci, et toi ?", "10:15", true, true),
    createMessage(3, "Alice Martin", "Super ! On se voit demain pour le projet ?", "10:20", false, true),
    createMessage(4, "Moi", "D'accord, on se voit demain !", "10:30", true, false)
  ],
  2: [
    createMessage(1, "Thomas Bernard", "As-tu eu le temps de regarder les maquettes ?", "09:00", false, true),
    createMessage(2, "Moi", "Oui, j'ai commencé à travailler dessus", "09:10", true, true),
    createMessage(3, "Thomas Bernard", "Le projet avance bien ?", "09:15", false, false)
  ],
  3: [
    createMessage(1, "Marie Dubois", "J'ai terminé la partie backend", "Hier", false, true),
    createMessage(2, "Moi", "Génial ! Tu peux me faire un résumé des fonctionnalités ?", "Hier", true, true),
    createMessage(3, "Marie Dubois", "Bien sûr ! J'ai implémenté l'authentification, la gestion des utilisateurs et l'API de messagerie", "Hier", false, true),
    createMessage(4, "Moi", "Parfait, merci pour ton travail !", "Hier", true, true),
    createMessage(5, "Marie Dubois", "Super, merci !", "Hier", false, false)
  ]
};

// Helper function to get messages for a specific conversation
export const getMessagesForConversation = (conversationId: number): Message[] => {
  return mockMessagesMap[conversationId] || [];
}; 