export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  isRead: boolean;
  conversationId: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  unread: number;
  isTyping: boolean;
  lastActive: Date;
} 