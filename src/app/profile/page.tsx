'use client'
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useRouter } from "next/navigation";
import {
  useProfileQuery
} from "@/hooks/react-query/profiles";
import { useAuth } from "react-oidc-context";

const userData = {
  name: "John Doe",
  age: 28,
  location: "Paris",
  description:
    "Passionné de photographie et de voyages. J'aime découvrir de nouveaux endroits et rencontrer des personnes intéressantes.",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth()
  const query = useProfileQuery()

  if (!query.data || query.data) {
    router.push('/profile/create/welcome')
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between">
        <ProfileHeader />
        <ProfileContainer>
          <ProfileAvatar
            name={user?.profile.name ?? ""}
            age={user?.profile.birthdate ?? 28}
            location={userData.location}
            description={userData.description}
          />
          <ProfileDialogContent />
        </ProfileContainer>
    </div>
  );
}
