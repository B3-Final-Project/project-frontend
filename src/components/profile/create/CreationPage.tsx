'use client'
import { useEffect } from 'react'
import { StepComponent } from "@/components/profile/create/StepComponent";
import { useRouter } from "next/navigation";
import { useProfileQuery } from "@/hooks/react-query/profiles";

export function CreationPage() {
  const router = useRouter()
  const { data, isLoading, isSuccess } = useProfileQuery()

  useEffect(() => {
    if (isSuccess && data?.profile) {
      router.replace('/profile')
    }
  }, [isSuccess, data, router])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSuccess && data?.profile) {
    return null
  }

  return (
    <div className="h-full flex mx-auto justify-center flex-col">
      <StepComponent />
    </div>
  )
}
