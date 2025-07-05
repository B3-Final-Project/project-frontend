import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import { Message, Conversation } from './interfaces/message.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

export class MessageRouter {
  public static readonly getConversations = createFetcher<Conversation[]>(
    RESTServerRoute.REST_MESSAGES_CONVERSATIONS,
    "GET"
  );
  
  public static readonly getMessages = createFetcher<Message[]>(
    RESTServerRoute.REST_MESSAGES_CONVERSATION,
    "GET"
  );
  
  public static readonly createConversation = createFetcher<
    Conversation,
    CreateConversationDto
  >(RESTServerRoute.REST_MESSAGES_CONVERSATIONS, "POST");
  
  public static readonly sendMessage = createFetcher<
    Message,
    CreateMessageDto
  >(RESTServerRoute.REST_MESSAGES, "POST");
  
  public static readonly markMessagesAsRead = createFetcher<void>(
    RESTServerRoute.REST_MESSAGES_CONVERSATION_READ,
    "POST"
  );
  
  public static readonly deleteConversation = createFetcher<void>(
    RESTServerRoute.REST_MESSAGES_CONVERSATION,
    "DELETE"
  );
} 