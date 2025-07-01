"use client";

import { ReactNode } from "react";
import { SocketProvider } from "../../providers/SocketProvider";
import { useAuthToken } from "@/hooks/useAuthToken";

interface MessagesClientWrapperProps {
  readonly children: ReactNode;
}

export function MessagesClientWrapper({ children }: MessagesClientWrapperProps) {
  const token = useAuthToken();

  return (
    <SocketProvider token={token ?? ''}>
      {children}
    </SocketProvider>
  );
} 