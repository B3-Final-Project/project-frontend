"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Book, Camera, Circle, MoreHorizontal } from "lucide-react";

export const editProfileData = {
  pictures: {
    title: "Photos",
    description: "1/6",
    icon: Camera,
  },
  description: {
    title: "Description",
    description: "Description",
    icon: Book,
  },
  genre: {
    title: "Genre",
    description: "Description",
    icon: Circle,
  },
  preferences: {
    title: "Préférences",
    description: "Description",
    icon: Circle,
  },
  others: {
    title: "Autres",
    description: "Description",
    icon: MoreHorizontal,
  },
};

interface ProfileOptionsProps {
  setSelectedOption: (option: string) => void;
}

export function ProfileOptions({ setSelectedOption }: ProfileOptionsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-10 w-full">
      {Object.entries(editProfileData).map(([key, value]) => (
        <DialogTrigger key={key} asChild onClick={() => setSelectedOption(key)}>
          <Button
            variant="secondary"
            className="flex items-center justify-between w-full max-w-[300px]"
          >
            <div className="flex items-center gap-4">
              <value.icon />
              {value.title}
            </div>
          </Button>
        </DialogTrigger>
      ))}
    </div>
  );
}
