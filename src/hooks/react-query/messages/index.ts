import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { messagesApi } from '../../../lib/routes/messages';
import { CreateMessageDto } from '../../../lib/routes/messages/dto/create-message.dto';
import { CreateConversationDto } from '../../../lib/routes/messages/dto/create-conversation.dto';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesApi.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10000, // 10 secondes
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateConversationDto) => messagesApi.createConversation(dto),
    onSuccess: () => {
      // Invalider et refetch les conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateMessageDto) => messagesApi.sendMessage(dto),
    onSuccess: (data, variables) => {
      // Mettre à jour les messages de la conversation
      queryClient.invalidateQueries({ 
        queryKey: ['messages', variables.conversation_id] 
      });
      // Mettre à jour la liste des conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => messagesApi.markMessagesAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Mettre à jour les messages de la conversation
      queryClient.invalidateQueries({ 
        queryKey: ['messages', conversationId] 
      });
      // Mettre à jour la liste des conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (conversationId: string) => messagesApi.deleteConversation(conversationId),
    onSuccess: () => {
      // Invalider et refetch les conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Rediriger vers la liste des conversations
      router.push('/messages');
    },
  });
}; 