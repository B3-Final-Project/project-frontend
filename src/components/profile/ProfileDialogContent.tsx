"use client";

import { DialogContentSelector } from "@/components/profile/DialogContentSelector";
import { ProfileOptions } from "@/components/profile/ProfileOptions";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { Book, Camera, Circle, Heart, MoreHorizontal } from "lucide-react";

export enum DialogContentChoices {
  LIFESTYLE = "lifestyle",
  LOCATION_WORK = "location_work",
  PERSONAL_INFO = "personal_info",
  PREFERENCES = "preferences",
  PICTURES = "pictures",
  INTERESTS = "interests",
}

export const editProfileData = [
  {
    key: DialogContentChoices.PICTURES,
    title: "Pictures",
    description: "1/6",
    icon: Camera,
  },
  {
    key: DialogContentChoices.PREFERENCES,
    title: "Preferences",
    description: "Description",
    icon: Circle,
  },
  {
    key: DialogContentChoices.PERSONAL_INFO,
    title: "Personal info",
    description: "Description",
    icon: MoreHorizontal,
  },
  {
    key: DialogContentChoices.LOCATION_WORK,
    title: "Location / Work",
    description: "Description",
    icon: Book,
  },
  {
    key: DialogContentChoices.LIFESTYLE,
    title: "Lifestyle",
    description: "Description",
    icon: Circle,
  },
  {
    key: DialogContentChoices.INTERESTS,
    title: "Interests",
    description: "Custom prompts",
    icon: Heart,
  },
];

export function ProfileDialogContent() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Dialog>
      <ProfileOptions
        data={editProfileData}
        setSelectedOption={setSelectedOption}
      />
      <DialogContentSelector selectedOption={selectedOption} />
    </Dialog>
  );
}
