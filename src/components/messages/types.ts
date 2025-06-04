export interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isTyping: boolean;
  avatar: string;
  lastMessageDate: Date;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
} 