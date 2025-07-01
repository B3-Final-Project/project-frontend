"use client";

import { ReactNode, useEffect } from "react";

import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

interface AdminGateProps {
  children: ReactNode;
}

export const AdminGate = ({ children }: AdminGateProps) => {
  const auth = useAuth();
  const router = useRouter();

  const groups = auth.user?.profile?.["cognito:groups"] as string[] | undefined;
  const isAdmin = groups?.includes("admin") ?? false;

  useEffect(() => {
    // Only redirect if we have a user but they're not an admin
    if (auth.user && !isAdmin) {
      router.replace("/");
    }
  }, [auth.user, isAdmin, router]);

  // Show loading if auth is still loading
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin access...</div>
      </div>
    );
  }

  // Don't render children if user is not admin
  if (!auth.user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
