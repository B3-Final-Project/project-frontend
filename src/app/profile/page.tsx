'use client'
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  useProfileQuery
} from "@/hooks/react-query/profiles";

const userData = {
  description:
    "Passionné de photographie et de voyages. J'aime découvrir de nouveaux endroits et rencontrer des personnes intéressantes.",
};

export default function ProfilePage() {
  const query = useProfileQuery()

  if (query.isLoading){
    return <div>Loading...</div>
  }

  return query.data && (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      <ProfileHeader />
      <ProfileContainer>
        <ProfileAvatar
          name={query.data?.name ?? ""}
          age={query.data.min_age}
          location={query.data.city}
          description={userData.description}
        />
        <ProfileDialogContent />
      </ProfileContainer>
    </div>
  );
}
