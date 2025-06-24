import { BoosterRouter } from "@/lib/routes/booster";
import { useQuery } from "@tanstack/react-query";

export function useGetAvailablePacksQuery() {
  return useQuery({
    queryKey: ["booster"],
    queryFn: () => BoosterRouter.getAvailablePacks()
  });
}
