'use client'
import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_018AFPXZG",
  client_id: "400ece0ohqfefqun2ktbv0403b",
  redirect_uri: "https://localhost:8080/api/cognito/callback",
  response_type: "code",
  scope: "email openid",
};

export function CognitoAuthProvider({children}: {children: ReactNode}){
  return <AuthProvider {...cognitoAuthConfig} >
    {children}
  </AuthProvider>
}
