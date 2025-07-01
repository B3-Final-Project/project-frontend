import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

export default function ProfilePage() {

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
