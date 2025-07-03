import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MessageRouter } from '../../../lib/routes/messages';
import { CreateMessageDto } from '../../../lib/routes/messages/dto/create-message.dto';
import { CreateConversationDto } from '../../../lib/routes/messages/dto/create-conversation.dto';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        const result = await MessageRouter.getConversations();
        return result || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
        return [];
      }
    },
    staleTime: 30000, // 30 secondes
    refetchOnWindowFocus: false,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      try {
        const result = await MessageRouter.getMessages(undefined, { id: conversationId });
        

        
        return result || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        return [];
      }
    },
    enabled: !!conversationId,
    staleTime: 10000, // 10 secondes
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateConversationDto) => MessageRouter.createConversation(dto),
    onSuccess: () => {
      // Invalider et refetch les conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateMessageDto) => MessageRouter.sendMessage(dto),
    onSuccess: (data, variables) => {
      // Mettre à jour les messages de la conversation directement
      queryClient.setQueryData(['messages', variables.conversation_id], (oldData: any[] | undefined) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
      
      // Mettre à jour la liste des conversations directement
      queryClient.setQueryData(['conversations'], (oldData: any[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(conv => {
          if (conv.id === variables.conversation_id) {
            return {
              ...conv,
              lastMessage: data,
              lastActive: data.timestamp,
              unread: conv.unread + 1,
            };
          }
          return conv;
        });
      });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => MessageRouter.markMessagesAsRead(undefined, { id: conversationId }),
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
    mutationFn: (conversationId: string) => MessageRouter.deleteConversation(undefined, { id: conversationId }),
    onSuccess: () => {
      // Invalider et refetch les conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Rediriger vers la liste des conversations
      router.push('/messages');
    },
  });
}; 