import { useAuthSettingsQuery } from "@/hooks/react-query/settings";

/**
 * Hook to check if authentication configuration is ready and loaded
 * @returns boolean indicating if auth config is available
 */
export function useAuthConfigReady() {
  const { data: config, isLoading, isError } = useAuthSettingsQuery();
  
  return {
    isReady: !isLoading && !isError && !!config,
    isLoading,
    isError,
    config
  };
}
