"use client";

import { Background } from "@/components/Background";
import { DialogContentSelector } from "@/components/profile/DialogContentSelector";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileOptions } from "@/components/profile/ProfileOptions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const userData = {
  name: "John Doe",
  age: 28,
  location: "Paris",
  description:
    "Passionné de photographie et de voyages. J'aime découvrir de nouveaux endroits et rencontrer des personnes intéressantes.",
};

export default function ProfilePage() {
  const [selectedOption, setSelectedOption] = useState("");

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
          <Dialog>
            <ProfileOptions setSelectedOption={setSelectedOption} />
            <DialogContent className="sm:max-w-[425px]">
              <DialogContentSelector selectedOption={selectedOption} />
            </DialogContent>
          </Dialog>
        </ProfileContainer>
      </div>
    </div>
  );
}
