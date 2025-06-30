export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date;
    isMe: boolean;
    isRead: boolean;
    conversationId: string;
  };
  unread: number;
  isTyping: boolean;
  lastActive: Date;
  // Propriétés pour compatibilité avec l'ancien format
  lastMessageText?: string;
  timestamp?: string;
  lastMessageDate?: Date;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  isRead: boolean;
  conversationId: string;
  // Propriétés pour compatibilité avec l'ancien format
  sender?: string;
} 