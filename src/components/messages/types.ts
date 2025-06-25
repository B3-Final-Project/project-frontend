export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isTyping: boolean;
  avatar: string;
  lastMessageDate: Date;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
} 