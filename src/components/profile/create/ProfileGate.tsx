"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileRouter } from "@/lib/routes/profiles";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Make sure this fetch runs only client-side
    ProfileRouter.getProfile().then(profile => {
      if (profile) {
        router.replace("/profile");
      }
    });
  }, [router]);

  return <>{children}</>;
}
