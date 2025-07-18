export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  isRead: boolean;
  conversationId: string;
  sender_id?: string;
  senderName?: string;
  senderAvatar?: string;
  replyTo?: {
    id: string;
    content: string;
    sender_id: string;
  } | null;
  reactions?: Record<string, string[]>; // emoji -> array of user IDs
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

export interface MatchedWith {
  userId: string;
  name: string;
  avatar: string | null;
  age: number | null;
}

export interface NewMatchData {
  type: 'match';
  conversation: Conversation;
  matchedWith: MatchedWith;
  timestamp: Date;
} 