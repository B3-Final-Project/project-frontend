interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
}

interface ConversationMessages {
  [conversationId: number]: Message[];
}

// Store initial des messages par conversation
const messagesStore: ConversationMessages = {
  1: [ // Alice Martin
    {
      id: 1,
      sender: "Alice Martin",
      content: "Salut ! Comment se passe le développement du projet ?",
      timestamp: "10:00",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Ça avance bien ! J'ai presque fini la partie frontend.",
      timestamp: "10:15",
      isMe: true,
      isRead: true,
    },
  ],
  2: [ // Thomas Bernard
    {
      id: 1,
      sender: "Thomas Bernard",
      content: "Tu as vu les dernières modifications du backend ?",
      timestamp: "09:15",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Pas encore, je regarde ça tout de suite !",
      timestamp: "09:20",
      isMe: true,
      isRead: true,
    },
  ],
  3: [ // Marie Dubois
    {
      id: 1,
      sender: "Marie Dubois",
      content: "La réunion est confirmée pour demain 14h",
      timestamp: "Hier",
      isMe: false,
      isRead: true,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Super, merci pour l'info !",
      timestamp: "Hier",
      isMe: true,
      isRead: true,
    },
  ],
  4: [ // Lucas Petit
    {
      id: 1,
      sender: "Lucas Petit",
      content: "Tu peux m'aider sur la partie authentification ?",
      timestamp: "Hier",
      isMe: false,
      isRead: false,
    },
    {
      id: 2,
      sender: "Lucas Petit",
      content: "J'ai un problème avec les tokens",
      timestamp: "Hier",
      isMe: false,
      isRead: false,
    },
    {
      id: 3,
      sender: "Lucas Petit",
      content: "Tu es disponible aujourd'hui ?",
      timestamp: "Hier",
      isMe: false,
      isRead: false,
    },
  ],
  5: [ // Emma Richard
    {
      id: 1,
      sender: "Emma Richard",
      content: "Le document de spécifications est prêt",
      timestamp: "19/03",
      isMe: false,
      isRead: true,
    },
  ],
};

// Fonction pour ajouter un message
export const addMessage = (conversationId: number, content: string, sender: string): void => {
  if (!messagesStore[conversationId]) {
    messagesStore[conversationId] = [];
  }

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  const newMessage: Message = {
    id: (messagesStore[conversationId].length + 1),
    sender,
    content,
    timestamp: `${hours}:${minutes}`,
    isMe: sender === "Moi",
    isRead: false,
  };

  messagesStore[conversationId].push(newMessage);
};

// Fonction pour récupérer les messages d'une conversation
export const getMessages = (conversationId: number): Message[] => {
  return messagesStore[conversationId] || [];
};

export default messagesStore; 