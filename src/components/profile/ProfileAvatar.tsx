'use client'
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import Image from 'next/image';
import { useState } from 'react';
import { FullScreenLoading } from "../FullScreenLoading";
import {
  formatDrinkingEnum,
  formatSmokingEnum,
  formatZodiacEnum
} from "@/lib/utils/enum-utils";

export function ProfileAvatar() {
  const [isUserCardModalOpen, setUserCardModalOpen] = useState(false);

  const query = useProfileQuery();

  const handleOpenUserCardModal = () => setUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setUserCardModalOpen(false);

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
          src="/vintage.png"
          alt="Profile"
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      {query.data?.profile && (
        <div className={'flex justify-between items-center gap-4'}>
          <h3 className="text-2xl font-bold cursor-pointer" onClick={handleOpenUserCardModal}>{query.data?.user.name}</h3>
        </div>
      )}
      {query.data?.user && query.data?.profile && (
        <UserCardModal
          isOpen={isUserCardModalOpen}
          onCloseAction={handleCloseUserCardModal}
          name={query.data.user.name}
          age={query.data.user.age}
          location={query.data.user.location}
          image_url={(query.data.profile.images && query.data.profile.images.length > 0 && query.data.profile.images[0]) || '/vintage.png'}
          interests={query.data.profile.interests}
          languages={query.data.profile.languages}
          zodiac={formatZodiacEnum(query.data.profile.zodiac ?? '')}
          smoking={formatSmokingEnum(query.data.profile.smoking ?? '')}
          drinking={formatDrinkingEnum(query.data.profile.drinking ?? '')}
        />
      )}
    </>
  );
}
