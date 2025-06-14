'use client'
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import Image from 'next/image';
import { useState } from 'react';
import { FullScreenLoading } from "../FullScreenLoading";

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
          onClose={handleCloseUserCardModal}
          name={query.data.user.name}
          age={query.data.user.age}
          location={query.data.user.location}
          description={query.data.profile.interests?.map((interest: { description: string }) => interest.description).join(', ') ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        />
      )}
    </>
  );
}
