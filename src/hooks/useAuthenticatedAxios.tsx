import { authenticatedAxios } from "@/lib/auth-axios";
import { useAuth } from "react-oidc-context";
import { useAuthConfigReady } from "@/hooks/useAuthConfigReady";
import { useMemo } from "react";

/**
 * Hook that provides an axios instance configured with the current auth state
 * This ensures that API calls are made with the correct authentication headers
 */
export function useAuthenticatedAxios() {
  const auth = useAuth();
  const { isReady } = useAuthConfigReady();

  return useMemo(() => {
    // Create a new axios instance for this component
    const instance = authenticatedAxios;

    // Add an interceptor that uses the current auth state
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        // Only add auth headers if we have a valid user and config is ready
        if (isReady && auth.user?.access_token) {
          config.headers.Authorization = `Bearer ${auth.user.access_token}`;
        } else {
          delete config.headers.Authorization;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup function to remove interceptor
    const cleanup = () => {
      instance.interceptors.request.eject(requestInterceptor);
    };

    // Return both instance and cleanup
    return { axios: instance, cleanup };
  }, [auth.user?.access_token, isReady]);
}
