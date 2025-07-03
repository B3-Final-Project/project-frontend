"use client";

import { ReactNode } from "react";
import { SocketProvider } from "./SocketProvider";
import { useAuth } from "react-oidc-context";

interface MessagesClientWrapperProps {
  readonly children: ReactNode;
}

export function MessagesClientWrapper({ children }: MessagesClientWrapperProps) {
  const {user} = useAuth();

  return (
    <SocketProvider token={user?.access_token ?? ''}>
      {children}
    </SocketProvider>
  );
} 