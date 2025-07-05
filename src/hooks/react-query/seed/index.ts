import { SeedRouter } from "@/lib/routes/seed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export function useSeedUsers()  {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (count: number) => SeedRouter.SeedAll({count}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['stats', 'profiles', 'reports', 'users']})
      toast({
        title: "Users seeded successfully",
        description: "All users have been seeded.",
      })
    }
  })
}

export function useSeedBoosters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SeedRouter.SeedBoosters(),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['stats','booster']})
      toast({
        title: "Boosters seeded successfully",
        description: "All boosters have been seeded.",
      })
    }
  })
}
