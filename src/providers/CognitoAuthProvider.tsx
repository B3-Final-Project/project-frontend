"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { LoadingFallback } from "@/components/auth/LoadingFallback";
import { AuthProvider } from "react-oidc-context";
import { useAuthSettingsQuery } from "@/hooks/react-query/settings";

interface CognitoAuthProviderProps {
  readonly children: ReactNode;
}

const baseOIDCConfig = {
  response_type: "code",
  scope: "email openid profile",
  onSigninCallback: () => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, "/");
    }
  },
};

export function CognitoAuthProvider({ children }: CognitoAuthProviderProps) {
  const { data: config, isLoading, isError, error } = useAuthSettingsQuery();
  const [showFallback, setShowFallback] = useState(true);

  // Show loading fallback for a brief moment, then render auth provider regardless
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(false);
    }, 100); // Very brief delay to avoid flash

    return () => clearTimeout(timer);
  }, []);

  const oidcConfig = useMemo(() => {
    // If still loading or no config, provide minimal config to prevent auth provider from initializing
    if (isLoading || !config) {
      return {
        ...baseOIDCConfig,
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
        scope: "email openid profile",
        // Disable automatic signin attempts during loading
        automaticSilentRenew: false,
        loadUserInfo: false,
      };
    }

    return {
      ...baseOIDCConfig,
      authority: config.userPool,
      client_id: config.userPoolClient,
      redirect_uri: config.callbackUrl,
      post_logout_redirect_uri: config.callbackUrl,
    };
  }, [config, isLoading]);

  // Show error UI only if there's actually an error
  if (isError) {
    console.error("Auth config failed to load:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Failed to load authentication configuration. Please try refreshing
            the page.
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading only briefly to prevent layout shift
  if (isLoading && showFallback) {
    return <LoadingFallback />;
  }

  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
