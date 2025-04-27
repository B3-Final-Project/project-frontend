'use client'
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  useProfileQuery
} from "@/hooks/react-query/profiles";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";

const userData = {
  description:
    "Passionné de photographie et de voyages. J'aime découvrir de nouveaux endroits et rencontrer des personnes intéressantes.",
};

export default function ProfilePage() {
  const query = useProfileQuery()

  if (query.isLoading){
    return <div>Loading...</div>
  }

  if (query.isError){
    return <div>{JSON.stringify(query.error)}</div>
  }

  return query.data && (
    <div className="h-full w-full flex flex-col justify-between">
      <ProfileHeader />
      <div className={"w-full h-full bg-background shadow-lg flex flex-col items-center justify-center"}>
        <ProfileAvatar
          name={query.data?.name ?? ""}
          age={query.data.min_age}
          location={query.data.city}
          description={userData.description}
        />
        <ProfileDialogContent />
      </div>
    </div>
  );
}
