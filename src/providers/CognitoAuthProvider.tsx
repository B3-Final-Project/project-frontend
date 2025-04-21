'use client'
import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.COGNITO_USER_POOL,
  client_id: process.env.COGNITO_CLIENT_ID,
  redirect_uri: process.env.COGNITO_CALLBACK_URL,
  response_type: "code",
  scope: "email openid",
};

export function CognitoAuthProvider({children}: {children: ReactNode}){
  return <AuthProvider {...cognitoAuthConfig} >
    {children}
  </AuthProvider>
}
