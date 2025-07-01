import { authenticatedAxios } from '../../auth-axios';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Message, Conversation } from './interfaces/message.interface';

export const messagesApi = {
  // Récupérer toutes les conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await authenticatedAxios.get('/messages/conversations');
    return response.data;
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await authenticatedAxios.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },

  // Créer une nouvelle conversation
  createConversation: async (dto: CreateConversationDto): Promise<Conversation> => {
    const response = await authenticatedAxios.post('/messages/conversations', dto);
    return response.data;
  },

  // Envoyer un message
  sendMessage: async (dto: CreateMessageDto): Promise<Message> => {
    const response = await authenticatedAxios.post('/messages', dto);
    return response.data;
  },

  // Marquer les messages comme lus
  markMessagesAsRead: async (conversationId: string): Promise<void> => {
    await authenticatedAxios.post(`/messages/conversations/${conversationId}/read`);
  },

  // Supprimer une conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    await authenticatedAxios.delete(`/messages/conversations/${conversationId}`);
  },
}; 