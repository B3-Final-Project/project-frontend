"use client";

import { useMatchesQuery } from "@/hooks/react-query/matches";
import { useConversations } from '@/hooks/react-query/messages';
import { useMessagesSocket } from '@/hooks/useMessagesSocket';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MatchList() {
  const router = useRouter();
  const query = useMatchesQuery();
  const { data: conversations = [], refetch: refetchConversations } = useConversations();

  const { isConnected } = useMessagesSocket();

  useEffect(() => {
    if (isConnected) {
      refetchConversations();
      query.refetch();
    }

    // Refetch périodique pour s'assurer que les données sont à jour
    const intervalId = setInterval(() => {
      console.log('Rafraîchissement périodique des conversations et matches');
      refetchConversations();
      query.refetch();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isConnected, refetchConversations, query]);

  // Fonction pour trouver l'ID de conversation correspondant à un match par son user_id
  const findConversationIdByUserId = (userId: string) => {
    if (!conversations || !Array.isArray(conversations)) return null;

    // Chercher la conversation où otherUserId correspond au user_id du match
    const conversation = conversations.find(conv => conv.otherUserId === userId);
    return conversation ? conversation.id : null;
  };

  // Récupère le nombre de messages non lus pour un match depuis sa conversation correspondante
  const getUnreadMessagesCount = (match: any) => {
    if (!match || !match.user_id) return 0;

    const conversationId = findConversationIdByUserId(match.user_id);
    if (!conversationId) return 0;

    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation && conversation.unread ? conversation.unread : 0;
  };

  const hasUnreadMessages = (match: any) => {
    return getUnreadMessagesCount(match) > 0;
  };

  const handleMatchClick = (match: any) => {
    const conversationId = findConversationIdByUserId(match.user_id);

    if (conversationId) {
      console.log(`Redirection vers la conversation ${conversationId} pour le match ${match.name} (user_id: ${match.user_id})`);
      router.push(`/messages/${conversationId}`);
    } else {
      console.log(`Aucune conversation trouvée pour le match ${match.name} (user_id: ${match.user_id})`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-foreground">Your Matches</h2>
        <Link
          href="/messages"
          className="text-sm text-secondary hover:text-secondary/80 flex items-center gap-1"
        >
          <span>View all</span>
        </Link>
      </div>

      <div className="relative overflow-hidden">
        {query.isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-pulse flex justify-center">
              <div className="h-12 w-12 rounded-full bg-muted"></div>
            </div>
            <p className="mt-3 text-muted-foreground">Loading your matches...</p>
          </div>
        ) : query.isError ? (
          <div className="p-4 text-center bg-destructive/10 text-destructive rounded-md">
            <p>Unable to load matches</p>
            <p className="text-sm mt-1">{query.error.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {query.data && Array.isArray(query.data) && query.data.length > 0 ? (
              query.data.slice(0, 10).map((match: any, index: number) => (
                <div
                  key={match.id || index}
                  className="group cursor-pointer"
                  onClick={() => handleMatchClick(match)}
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm transition-all">
                    <div className="aspect-square relative">
                      <Image
                        src={match.imageUrl && match.imageUrl.trim() !== "" ? match.imageUrl : "/vintage.png"}
                        alt={match.name ?? "Match"}
                        fill
                        className="object-cover"
                      />
                      {match.isOnline && (
                        <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate text-sm">{match.name}</p>

                      </div>
                      {(match.unread === true || hasUnreadMessages(match)) ? (
                        <div className="mt-1 w-full">
                          <div className="bg-secondary/10 px-2 py-0.5 rounded text-[10px] font-medium text-secondary animate-pulse text-center">
                            New message ({match.unreadCount > 0 ? match.unreadCount : getUnreadMessagesCount(match)})
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">No matches available yet</p>
                <p className="text-sm mt-1">Open boosters to discover new matches!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
