'use client'

import { useEffect } from 'react'
import { StepComponent } from "@/components/profile/create/StepComponent";
import { useRouter } from "next/navigation";
import { useProfileQuery } from "@/hooks/react-query/profiles";

export function CreationPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isSuccess,
  } = useProfileQuery();

  useEffect(() => {
    if (data && data?.profile || data?.user) {
      router.replace("/profile")
    }
  }, [isSuccess, data, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex mx-auto justify-center flex-col">
      <StepComponent />
    </div>
  );
}
