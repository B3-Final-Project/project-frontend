import type { Conversation, Message } from './types';

export const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Alice Martin",
    lastMessage: "Bonjour, comment vas-tu ?",
    timestamp: "10:30",
    unread: 2,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessageDate: new Date("2024-03-20T10:30:00")
  },
  {
    id: 2,
    name: "Thomas Bernard",
    lastMessage: "On se voit demain ?",
    timestamp: "09:15",
    unread: 0,
    isTyping: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    lastMessageDate: new Date("2024-03-20T09:15:00")
  },
  {
    id: 3,
    name: "Marie Dubois",
    lastMessage: "Merci pour ton aide !",
    timestamp: "Hier",
    unread: 0,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    lastMessageDate: new Date("2024-03-19T15:45:00")
  },
  {
    id: 4,
    name: "Lucas Petit",
    lastMessage: "Je t'envoie le document",
    timestamp: "Hier",
    unread: 1,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    lastMessageDate: new Date("2024-03-19T14:20:00")
  },
  {
    id: 5,
    name: "Emma Richard",
    lastMessage: "Super, à bientôt !",
    timestamp: "Lundi",
    unread: 0,
    isTyping: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    lastMessageDate: new Date("2024-03-18T11:10:00")
  }
];

const mockMessagesMap: { [key: number]: Message[] } = {
  1: [
    {
      id: 1,
      sender: "Alice Martin",
      content: "Bonjour, comment vas-tu ?",
      timestamp: "10:30",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Je vais bien, merci ! Et toi ?",
      timestamp: "10:31",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Alice Martin",
      content: "Très bien aussi ! On se voit demain ?",
      timestamp: "10:32",
      isMe: false,
      isRead: false
    }
  ],
  2: [
    {
      id: 1,
      sender: "Thomas Bernard",
      content: "Salut ! Tu as le temps de discuter ?",
      timestamp: "09:10",
      isMe: false,
      isRead: true
    },
    {
      id: 2,
      sender: "Moi",
      content: "Oui bien sûr !",
      timestamp: "09:12",
      isMe: true,
      isRead: true
    },
    {
      id: 3,
      sender: "Thomas Bernard",
      content: "On se voit demain ?",
      timestamp: "09:15",
      isMe: false,
      isRead: true
    }
  ]
};

export const getMessagesForConversation = (conversationId: number): Message[] => {
  return mockMessagesMap[conversationId] || [];
}; 