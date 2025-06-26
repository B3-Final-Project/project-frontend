import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AdminRouter } from "@/lib/routes/admin";
import { toast } from "@/hooks/use-toast";

// Hook to ban a user
export function useBanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return AdminRouter.banUser(undefined, { userId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "User banned",
        description: data.message || "User has been banned successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to ban user", error);
      toast({
        title: "Failed to ban user",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

// Hook to unban a user
export function useUnbanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return AdminRouter.unbanUser(undefined, { userId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "User unbanned",
        description: data.message || "User has been unbanned successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to unban user", error);
      toast({
        title: "Failed to unban user",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}
