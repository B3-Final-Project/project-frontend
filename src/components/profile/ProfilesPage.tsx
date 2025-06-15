'use client'

import { FullScreenLoading } from "@/components/FullScreenLoading";
import { ProfileRouter } from "@/lib/routes/profiles";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilesPage() {
  const router = useRouter();

  useEffect(() => {
    // Make sure this fetch runs only client-side
    ProfileRouter.getProfile()
      .then(profile => {
        if (!profile) {
          // No profile found, redirect to profile creation
          router.replace("/profiles/create/welcome");
        }
        // If profile exists, stay on this page (we can implement profiles list logic here later)
      })
      .catch(error => {
        // If there's an error (likely no profile found), redirect to creation
        console.log("No profile found, redirecting to creation:", error);
        router.replace("/profiles/create/welcome");
      });
  }, [router]);

  // For now, just show a loading screen while checking profile status
  // Later you can implement the actual profiles list/display logic here
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <FullScreenLoading />
      <p className="mt-4 text-gray-600">Checking profile status...</p>
    </div>
  );
}
