import { SettingsRouter } from "@/lib/routes/settings";
import { useQuery } from "@tanstack/react-query";

export function useAuthSettingsQuery() {
  return useQuery({
    queryKey: ["auth-settings"],
    queryFn: () => SettingsRouter.getAuthSettings(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
