"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { UserCardModal } from "./UserCardModal";

interface ProfileAvatarProps {
  name: string;
  age?: number;
  location?: string;
  description?: string;
}

export function ProfileAvatar({
  name,
  age,
  location,
  description,
}: ProfileAvatarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="w-[100px] h-[100px] border-4 border-background bg-red-500 rounded-full flex items-center justify-center -translate-y-1/2 overflow-hidden">
        <Image
          src="/vintage.png"
          alt="Profile"
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex justify-between items-center w-full max-w-[300px]">
        <h3 className="text-2xl font-bold">{name}</h3>
        <Button variant="outline" size="sm" onClick={openModal}>
          Aperçu
        </Button>
      </div>

      <UserCardModal
        name={name}
        age={age}
        location={location}
        description={description}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
