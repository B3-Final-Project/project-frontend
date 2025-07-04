export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  isRead: boolean;
  conversationId: string;
  sender_id?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  otherUserId?: string;
  lastMessage?: Message;
  unread: number;
  isTyping: boolean;
  lastActive: Date;
} 