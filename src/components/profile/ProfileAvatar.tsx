'use client'

import { useEffect, useState } from "react";
import { FullScreenLoading } from "../FullScreenLoading";
import Image from 'next/image';
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import {
  mapUserProfileToProfileCardType
} from "@/lib/utils/card-utils";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";

export function ProfileAvatar() {
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);
  const [userCard, setUserCard] = useState<ProfileCardType>();
  const query = useProfileQuery();

  useEffect(() => {
    if (query.data){
    setUserCard(mapUserProfileToProfileCardType(query.data));
    }
  }, [query.data]);

  const handleOpenUserCardModal = () => setIsUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setIsUserCardModalOpen(false);

  if (query.isLoading) {
    return <FullScreenLoading />
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>
  }

  return (
    <>
      <div className="w-[100px] h-[100px] border-4 border-background bg-red-500 rounded-full flex items-center justify-center -translate-y-1/2 overflow-hidden">
        <Image
          src={userCard?.image_url ?? '/vintage.png'}
          alt="Profile"
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      {userCard?.name && (
        <div className={'flex justify-between items-center gap-4'}>
          <button
            className="text-2xl font-bold cursor-pointer bg-transparent border-none p-0 text-inherit"
            onClick={handleOpenUserCardModal}
          >
            {userCard.name}
          </button>
        </div>
      )}
      {userCard && (
        <UserCardModal
          isOpen={isUserCardModalOpen}
          onCloseAction={handleCloseUserCardModal}
          user={userCard}
        />
      )}
    </>
  );
}
