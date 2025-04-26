'use client'
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignInButton(){
  const auth = useAuth()
  const router = useRouter()

  const signout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (!confirmLogout) {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const logoutUri = process.env.NEXT_PUBLIC_COGNITO_CALLBACK_URL;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_DOMAIN;

    if (!clientId || !logoutUri || !cognitoDomain) {
      console.error('Missing Cognito environment variables');
      return;
    }

    const redirectUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

    await auth.removeUser();

    router.push(redirectUrl);
  };
  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.user){
    return <Button onClick={() => signout()}>Sign Out</Button>
  }

  if (!auth.user){
    return <Button onClick={() => auth.signinRedirect()}>Log In</Button>
  }
}
