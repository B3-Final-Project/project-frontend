'use client'
import { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_018AFPXZG",
  client_id: "400ece0ohqfefqun2ktbv0403b",
  redirect_uri: "http://localhost:3000",
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
