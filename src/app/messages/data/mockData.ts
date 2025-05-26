import { Conversation, Message } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Alice Martin",
    lastMessage: "D'accord, on se voit demain !",
    timestamp: "10:30",
    unread: 2,
    isTyping: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessageDate: new Date('2024-03-20T10:30:00'),
  },
  {
    id: 2,
    name: "Thomas Bernard",
    lastMessage: "Le projet avance bien ?",
    timestamp: "09:15",
    unread: 0,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    lastMessageDate: new Date('2024-03-20T09:15:00'),
  },
  {
    id: 3,
    name: "Marie Dubois",
    lastMessage: "Super, merci !",
    timestamp: "Hier",
    unread: 1,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    lastMessageDate: new Date('2024-03-19T15:30:00'),
  }
].sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());

export const mockMessagesMap: Record<number, Message[]> = {
  1: [ // Messages avec Alice Martin
    {
      id: 1,
      sender: "Alice Martin",
      content: "Salut ! Comment vas-tu ?",
      timestamp: "10:00",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Très bien merci, et toi ?",
      timestamp: "10:15",
      isMe: true,
      isRead: true,
    },
    {
      id: 3,
      sender: "Alice Martin",
      content: "Super ! On se voit demain pour le projet ?",
      timestamp: "10:20",
      isMe: false,
      isRead: true,
    },
    {
      id: 4,
      sender: "Moi",
      content: "D'accord, on se voit demain !",
      timestamp: "10:30",
      isMe: true,
      isRead: false,
    }
  ],
  2: [ // Messages avec Thomas Bernard
    {
      id: 1,
      sender: "Thomas Bernard",
      content: "As-tu eu le temps de regarder les maquettes ?",
      timestamp: "09:00",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Oui, j'ai commencé à travailler dessus",
      timestamp: "09:10",
      isMe: true,
      isRead: true,
    },
    {
      id: 3,
      sender: "Thomas Bernard",
      content: "Le projet avance bien ?",
      timestamp: "09:15",
      isMe: false,
      isRead: false,
    }
  ],
  3: [ // Messages avec Marie Dubois
    {
      id: 1,
      sender: "Marie Dubois",
      content: "J'ai terminé la partie backend",
      timestamp: "Hier",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Génial ! Tu peux me faire un résumé des fonctionnalités ?",
      timestamp: "Hier",
      isMe: true,
      isRead: true,
    },
    {
      id: 3,
      sender: "Marie Dubois",
      content: "Bien sûr ! J'ai implémenté l'authentification, la gestion des utilisateurs et l'API de messagerie",
      timestamp: "Hier",
      isMe: false,
      isRead: true,
    },
    {
      id: 4,
      sender: "Moi",
      content: "Parfait, merci pour ton travail !",
      timestamp: "Hier",
      isMe: true,
      isRead: true,
    },
    {
      id: 5,
      sender: "Marie Dubois",
      content: "Super, merci !",
      timestamp: "Hier",
      isMe: false,
      isRead: false,
    }
  ]
};

// Helper function to get messages for a specific conversation
export const getMessagesForConversation = (conversationId: number): Message[] => {
  return mockMessagesMap[conversationId] || [];
}; 