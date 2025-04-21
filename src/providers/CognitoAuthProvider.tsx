'use client'
import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_USER_POOL,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_CALLBACK_URL,
  response_type: "code",
  scope: "email openid profile",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, "/");
  },
};

export function CognitoAuthProvider({children}: {children: ReactNode}){
  return <AuthProvider {...cognitoAuthConfig} >
    {children}
  </AuthProvider>
}
