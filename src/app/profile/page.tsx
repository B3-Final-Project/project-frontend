import { Background } from "@/components/Background";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileDialogContent } from "@/components/profile/ProfileDialogContent";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

const userData = {
  name: "John Doe",
  age: 28,
  location: "Paris",
  description:
    "Passionné de photographie et de voyages. J'aime découvrir de nouveaux endroits et rencontrer des personnes intéressantes.",
};

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="relative z-10 flex flex-col justify-between w-full h-screen">
        <ProfileHeader />
        <ProfileContainer>
          <ProfileAvatar
            name={userData.name}
            age={userData.age}
            location={userData.location}
            description={userData.description}
          />
          <ProfileDialogContent />
        </ProfileContainer>
      </div>
    </div>
  );
}
