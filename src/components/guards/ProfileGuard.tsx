"use client";

import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { Loader } from "@/components/Loader";

interface ProfileGuardProps {
  readonly children: React.ReactNode;
}

export function ProfileGuard({ children }: ProfileGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  // Only call useProfileQuery if user is authenticated
  const query = useProfileQuery(auth.user != null);

  // Define allowed routes for users without a profile
  const allowedRoutes = [
    "/", // Home page
    "/profile/create", // Profile creation pages
  ];

  // Check if current route is allowed
  const isAllowedRoute = allowedRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });

  useEffect(() => {
    // Only proceed if user is authenticated
    if (!auth.user) {
      router.replace('/')
      return;
    }

    // Only redirect if:
    // 1. Query has completed successfully
    // 2. No profile exists
    // 3. User is not already on an allowed route
    // 4. User is not already on the profile creation welcome page
    if (
      query.isSuccess &&
      !query.data?.profile &&
      !isAllowedRoute &&
      !pathname.startsWith("/profile/create/welcome")
    ) {
      console.log("Redirecting to profile creation - no profile found");
      router.push("/profile/create/welcome");
    }
  }, [
    query.isSuccess,
    query.data?.profile,
    pathname,
    isAllowedRoute,
    router,
    auth.user,
  ]);

  // If user is not authenticated, render children (let HomePage handle auth flow)
  if (!auth.user) {
    return <>{children}</>;
  }

  // Show loading while query is in progress
  if (query.isLoading) {
    return <Loader />;
  }

  // Show error if query failed
  if (query.isError) {
    console.error("Profile query error:", query.error);
    return <div>Error loading profile: {JSON.stringify(query.error)}</div>;
  }

  // If no profile exists and user is not on an allowed route, show loading
  // (they will be redirected by the useEffect)
  if (
    !query.data?.profile &&
    !isAllowedRoute &&
    !pathname.startsWith("/profile/welcome/create")
  ) {
    return <Loader />;
  }

  // Render children for all other cases
  return <>{children}</>;
}
