import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="h-full min-h-screen w-full flex flex-col justify-between mb-[75px]">
      <ProfileHeader />
      <div
        className={"w-full h-full shadow-lg flex flex-col items-center"}
      >
        <ProfileAvatar />
        <ProfileDialogContent />
      </div>
    </div>
  );
}
