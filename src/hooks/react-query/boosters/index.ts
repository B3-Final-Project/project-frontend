import { BoosterRouter } from "@/lib/routes/booster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAvailablePacksQuery() {
  return useQuery({
    queryKey: ["booster"],
    queryFn: () => BoosterRouter.getAvailablePacks(),
  });
}

export function useGetBooster(count: number, boosterType?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["booster", boosterType],
    mutationFn: () => BoosterRouter.getBoosters({ boosterType: boosterType ? Number(boosterType) : undefined }),
    onSuccess: (data) => {
      queryClient.setQueryData(["booster", count, boosterType], data);
    },
  });
}
