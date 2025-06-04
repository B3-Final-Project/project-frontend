import type { Conversation, Message } from './types';

export const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Alice Martin",
    lastMessage: "Super, à demain alors !",
    timestamp: "10:30",
    unread: 2,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessageDate: new Date("2024-03-20T10:30:00")
  },
  {
    id: 2,
    name: "Thomas Bernard",
    lastMessage: "Je t'envoie le document ce soir",
    timestamp: "09:15",
    unread: 0,
    isTyping: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    lastMessageDate: new Date("2024-03-20T09:15:00")
  },
  {
    id: 3,
    name: "Marie Dubois",
    lastMessage: "Merci pour ton aide sur le projet !",
    timestamp: "Hier",
    unread: 3,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    lastMessageDate: new Date("2024-03-19T15:45:00")
  },
  {
    id: 4,
    name: "Lucas Petit",
    lastMessage: "On se retrouve à la cafétéria ?",
    timestamp: "Hier",
    unread: 1,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    lastMessageDate: new Date("2024-03-19T14:20:00")
  },
  {
    id: 5,
    name: "Emma Richard",
    lastMessage: "J'ai terminé la partie front-end",
    timestamp: "Lundi",
    unread: 0,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessageDate: new Date("2024-03-18T11:10:00")
  },
  {
    id: 6,
    name: "Sophie Moreau",
    lastMessage: "Tu as vu la dernière mise à jour ?",
    timestamp: "Lundi",
    unread: 4,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    lastMessageDate: new Date("2024-03-18T09:30:00")
  }
];

const mockMessagesMap: { [key: number]: Message[] } = {
  1: [
    {
      id: 1,
      sender: "Alice Martin",
      content: "Bonjour ! Comment va le projet ?",
      timestamp: "2024-03-20 10:25",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Ça avance bien ! Je viens de finir la partie authentification",
      timestamp: "2024-03-20 10:26",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Alice Martin",
      content: "Super ! Tu peux me montrer ?",
      timestamp: "2024-03-20 10:28",
      isMe: false,
      isRead: false
    },
    {
      id: 4,
      sender: "Alice Martin",
      content: "Super, à demain alors !",
      timestamp: "2024-03-20 10:30",
      isMe: false,
      isRead: false
    }
  ],
  2: [
    {
      id: 1,
      sender: "Thomas Bernard",
      content: "Salut ! Tu as le temps de regarder le code ?",
      timestamp: "2024-03-20 09:10",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Oui bien sûr, envoie-moi ça",
      timestamp: "2024-03-20 09:12",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Thomas Bernard",
      content: "Je t'envoie le document ce soir",
      timestamp: "2024-03-20 09:15",
      isMe: false,
      isRead: true
    },
    {
      id: 4,
      sender: "Moi",
      content: "Ok, je regarderai dès que possible.",
      timestamp: "2024-03-20 09:16",
      isMe: true,
      isRead: false
    },
    {
      id: 5,
      sender: "Thomas Bernard",
      content: "Merci ! Tu es au top.",
      timestamp: "2024-03-20 09:17",
      isMe: false,
      isRead: false
    }
  ],
  3: [
    {
      id: 1,
      sender: "Marie Dubois",
      content: "Salut ! J'ai un problème avec l'API",
      timestamp: "2024-03-19 15:40",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Dis-moi ce qui ne va pas",
      timestamp: "2024-03-19 15:42",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Marie Dubois",
      content: "Les requêtes POST ne fonctionnent pas",
      timestamp: "2024-03-19 15:43",
      isMe: false,
      isRead: false
    },
    {
      id: 4,
      sender: "Marie Dubois",
      content: "J'ai trouvé le problème !",
      timestamp: "2024-03-19 15:44",
      isMe: false,
      isRead: false
    },
    {
      id: 5,
      sender: "Marie Dubois",
      content: "Merci pour ton aide sur le projet !",
      timestamp: "2024-03-19 15:45",
      isMe: false,
      isRead: false
    }
  ],
  4: [
    {
      id: 1,
      sender: "Lucas Petit",
      content: "Hey ! Tu es là ?",
      timestamp: "2024-03-19 14:15",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Oui, je suis là !",
      timestamp: "2024-03-19 14:18",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Lucas Petit",
      content: "On se retrouve à la cafétéria ?",
      timestamp: "2024-03-19 14:20",
      isMe: false,
      isRead: false
    }
  ],
  5: [
    {
      id: 1,
      sender: "Emma Richard",
      content: "Salut ! Comment avance le projet ?",
      timestamp: "2024-03-18 11:05",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Ça avance bien, et toi ?",
      timestamp: "2024-03-18 11:08",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Emma Richard",
      content: "J'ai terminé la partie front-end",
      timestamp: "2024-03-18 11:10",
      isMe: false,
      isRead: true
    },
    {
      id: 4,
      sender: "Moi",
      content: "Super, on pourra faire la démo demain !",
      timestamp: "2024-03-18 11:12",
      isMe: true,
      isRead: false
    },
    {
      id: 5,
      sender: "Emma Richard",
      content: "Oui, parfait !",
      timestamp: "2024-03-18 11:13",
      isMe: false,
      isRead: false
    }
  ],
  6: [
    {
      id: 1,
      sender: "Sophie Moreau",
      content: "Tu as vu la dernière mise à jour de React ?",
      timestamp: "2024-03-18 09:25",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Non, pas encore. Quoi de neuf ?",
      timestamp: "2024-03-18 09:27",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Sophie Moreau",
      content: "Il y a plein de nouvelles fonctionnalités !",
      timestamp: "2024-03-18 09:28",
      isMe: false,
      isRead: false
    },
    {
      id: 4,
      sender: "Sophie Moreau",
      content: "Notamment pour les hooks",
      timestamp: "2024-03-18 09:29",
      isMe: false,
      isRead: false
    },
    {
      id: 5,
      sender: "Sophie Moreau",
      content: "Tu as vu la dernière mise à jour ?",
      timestamp: "2024-03-18 09:30",
      isMe: false,
      isRead: false
    }
  ]
};

export const getMessagesForConversation = (conversationId: number): Message[] => {
  return mockMessagesMap[conversationId] || [];
}; 