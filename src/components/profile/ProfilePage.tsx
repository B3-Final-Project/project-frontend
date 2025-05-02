'use client'
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useRouter } from "next/navigation";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter()
  const { data, isLoading, isSuccess } = useProfileQuery()

  useEffect(() => {
    if (isSuccess && !data?.profile) {
      router.push('/profile/create/welcome')
    }
  }, [isSuccess, data, router])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <ProfileHeader />
      <div className={"w-full h-full bg-background shadow-lg flex flex-col items-center justify-center"}>
        <ProfileAvatar />
        <ProfileDialogContent />
      </div>
    </div>
  );
}
