import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MatchRouter } from "@/lib/routes/matches";
import { toast } from "@/hooks/use-toast";

// Fetch all matches
export function useMatchesQuery() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: () => MatchRouter.getMatches(),
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refetch every 30 seconds for new matches
    refetchOnMount: true
  });
}

// Fetch pending matches
export function usePendingMatchesQuery() {
  return useQuery({
    queryKey: ["matches", "pending"],
    queryFn: () => MatchRouter.getPendingMatches(),
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    refetchOnMount: true
  });
}

// Fetch sent matches
export function useSentMatchesQuery() {
  return useQuery({
    queryKey: ["matches", "sent"],
    queryFn: () => MatchRouter.getSentMatches(),
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Less frequent for sent matches
    refetchOnMount: false
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
    onSuccess: (data, matchId) => {
      // Invalidate and refetch match-related queries
      queryClient.invalidateQueries({ queryKey: ["matches"] });

      // Show success message
      if (data.isMatch) {
        toast({
          title: "It's a match! 🎉",
          description: "You and this person liked each other!",
        });
      } else {
        toast({
          title: "Match liked",
          description: "Your like has been sent!",
        });
      }
    },
    onError: (error) => {
      console.error("Failed to like match", error);
      toast({
        title: "Failed to like match",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
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

      toast({
        title: "Match passed",
        description: "This profile has been passed.",
      });
    },
    onError: (error) => {
      console.error("Failed to pass match", error);
      toast({
        title: "Failed to pass match",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

// Combined hook for match actions
export function useMatchActions() {
  const likeMutation = useLikeMatchMutation();
  const passMutation = usePassMatchMutation();

  return {
    likeMatch: likeMutation.mutate,
    passMatch: passMutation.mutate,
    isLiking: likeMutation.isPending,
    isPassing: passMutation.isPending,
    likeError: likeMutation.error,
    passError: passMutation.error,
  };
}
