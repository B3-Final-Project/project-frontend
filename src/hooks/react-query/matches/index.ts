import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MatchRouter } from "@/lib/routes/matches";

// Fetch all matches
export function useMatchesQuery() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: () => MatchRouter.getMatches(),
  });
}

// Fetch pending matches
export function usePendingMatchesQuery() {
  return useQuery({
    queryKey: ["matches", "pending"],
    queryFn: () => MatchRouter.getPendingMatches(),
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    refetchOnMount: true,
  });
}

// Fetch sent matches
export function useSentMatchesQuery() {
  return useQuery({
    queryKey: ["matches", "sent"],
    queryFn: () => MatchRouter.getSentMatches(),
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Less frequent for sent matches
    refetchOnMount: false,
  });
}

// Fetch match details
export function useMatchDetailsQuery(matchId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["matches", "details", matchId],
    queryFn: () => MatchRouter.getMatchDetails(undefined, { id: matchId }),
    enabled: enabled && !!matchId,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Like a match mutation
export function useLikeMatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      return MatchRouter.likeMatch(undefined, { id: matchId });
    },
    onSuccess: (data) => {
      // Invalidate and refetch match-related queries
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      
      // Note: Les notifications de match sont gérées dans GlobalMessageNotifications.tsx
      // via l'événement WebSocket 'newMatch'
    },
    onError: (error) => {
      console.error("Failed to like match", error);
      // Note: Les notifications d'erreur sont gérées dans GlobalMessageNotifications.tsx
    },
  });
}

// Pass on a match mutation
export function usePassMatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      return MatchRouter.passMatch(undefined, { id: matchId });
    },
    onSuccess: (data, matchId) => {
      // Invalidate and refetch match-related queries
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["matches", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["matches", "sent"] });

      // Remove the specific match from cache
      queryClient.removeQueries({ queryKey: ["matches", "details", matchId] });
      
      // Note: Les notifications de match sont gérées dans GlobalMessageNotifications.tsx
    },
    onError: (error) => {
      console.error("Failed to pass match", error);
      // Note: Les notifications d'erreur sont gérées dans GlobalMessageNotifications.tsx
    },
  });
}

// Combined hook for match actions
export function useMatchActions() {
  const likeMutation = useLikeMatchMutation();
  const passMutation = usePassMatchMutation();

  return {
    likeMatch: likeMutation.mutateAsync,
    passMatch: passMutation.mutate,
    isLiking: likeMutation.isPending,
    isPassing: passMutation.isPending,
    likeError: likeMutation.error,
    passError: passMutation.error,
  };
}
