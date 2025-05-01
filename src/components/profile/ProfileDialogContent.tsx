"use client";

import { DialogContentSelector } from "@/components/profile/DialogContentSelector";
import { ProfileOptions } from "@/components/profile/ProfileOptions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Book, Camera, Circle, MoreHorizontal } from "lucide-react";

export enum DialogContentChoices {
  PICTURES = 'pictures',
  DESCRIPTION = 'description',
  GENRE = 'genre',
  PREFERENCES = 'preferences',
  OTHER = 'other',
}

export const editProfileData = [
  {
    key: DialogContentChoices.PICTURES,
    title: "Photos",
    description: "1/6",
    icon: Camera,
  },
  {
    key: DialogContentChoices.DESCRIPTION,
    title: "Description",
    description: "Description",
    icon: Book,
  },
  {
    key: DialogContentChoices.GENRE,
    title: "Genre",
    description: "Description",
    icon: Circle,
  },
  {
    key: DialogContentChoices.PREFERENCES,
    title: "Préférences",
    description: "Description",
    icon: Circle,
  },
  {
    key: DialogContentChoices.OTHER,
    title: "Autres",
    description: "Description",
    icon: MoreHorizontal,
  },
];

export function ProfileDialogContent() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Dialog>
      <ProfileOptions data={editProfileData} setSelectedOption={setSelectedOption} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogContentSelector  selectedOption={selectedOption} />
      </DialogContent>
    </Dialog>
  );
}
