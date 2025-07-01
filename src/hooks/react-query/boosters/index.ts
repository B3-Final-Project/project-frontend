import { BoosterRouter } from "@/lib/routes/booster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAvailablePacksQuery() {
  return useQuery({
    queryKey: ["booster"],
    queryFn: () => BoosterRouter.getAvailablePacks(),
  });
}

export function useGetBooster(count: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["booster"],
    mutationFn: () => BoosterRouter.getBoosters(),
    onSuccess: (data) => {
      queryClient.setQueryData(["booster", count], data);
    },
  });
}
