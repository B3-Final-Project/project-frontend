"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useAuthConfigReady } from "@/hooks/useAuthConfigReady";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const { isReady, isLoading, config } = useAuthConfigReady();
  const auth = useAuth();
  const router = useRouter();

  // Show loading state while auth config is being fetched
  if (isLoading || !isReady || !auth) {
    return (
      <Button disabled variant="ghost">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        Loading...
      </Button>
    );
  }

  const signout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (!confirmLogout) {
      return;
    }

    if (!config) return;

    const clientId = config.userPoolClient;
    const logoutUri = config.callbackUrl;
    const cognitoDomain = config.hostedDomain;

    if (!clientId || !logoutUri || !cognitoDomain) {
      console.error("Missing Cognito environment variables");
      return;
    }

    const redirectUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

    await auth.removeUser();

    router.push(redirectUrl);
  };

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.user) {
    return <Button onClick={() => signout()}>Sign Out</Button>;
  }

  if (!auth.user) {
    return <Button onClick={() => auth.signinRedirect()}>Log In</Button>;
  }

  return <div>Unexpected state encountered. Please try again later.</div>;
}
