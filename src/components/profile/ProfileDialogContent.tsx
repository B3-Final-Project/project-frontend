"use client";

import { DialogContentSelector } from "@/components/profile/DialogContentSelector";
import { ProfileOptions } from "@/components/profile/ProfileOptions";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { Book, Camera, Circle, MoreHorizontal } from "lucide-react";

export enum DialogContentChoices {
  LIFESTYLE = 'lifestyle',
  LOCATION_WORK = 'location_work',
  PERSONAL_INFO = 'personal_info',
  PREFERENCES = 'preferences',
  PICTURES = 'pictures',
}

export const editProfileData = [
  {
    key: DialogContentChoices.PICTURES,
    title: "Photos",
    description: "1/6",
    icon: Camera,
  },
  {
    key: DialogContentChoices.PREFERENCES,
    title: "Préférences",
    description: "Description",
    icon: Circle,
  },
  {
    key: DialogContentChoices.PERSONAL_INFO,
    title: "Informations personnelles",
    description: "Description",
    icon: MoreHorizontal,
  },
  {
    key: DialogContentChoices.LOCATION_WORK,
    title: "Ville / Travail",
    description: "Description",
    icon: Book,
  },
  {
    key: DialogContentChoices.LIFESTYLE,
    title: "Style de vie",
    description: "Description",
    icon: Circle,
  }
];

export function ProfileDialogContent() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Dialog>
      <ProfileOptions data={editProfileData} setSelectedOption={setSelectedOption} />
      <DialogContentSelector  selectedOption={selectedOption} />
    </Dialog>
  );
}
