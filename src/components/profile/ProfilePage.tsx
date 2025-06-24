'use client'
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";

export default function ProfilePage() {

  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* <ProfileHeader /> */}
      <div className={"w-full h-full shadow-lg flex flex-col items-center justify-center"}>
        <ProfileAvatar />
        <ProfileDialogContent />
      </div>
    </div>
  );
}
