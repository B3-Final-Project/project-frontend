"use client";

import { Button } from "@/components/ui/button";
import { UserCardModal } from "@/components/UserCardModal";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Loader } from "../Loader";
import { mapUserProfileToProfileCardType } from "@/lib/utils/card-utils";

export function ProfileHeader() {
  const [isUserCardModalOpen, setUserCardModalOpen] = useState(false);
  const query = useProfileQuery();

  const handleOpenUserCardModal = () => setUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setUserCardModalOpen(false);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>;
  }

  return (
    <div className="flex justify-between items-center px-5 py-8 w-full md:max-w-[750px] md:mx-auto">
      <Settings />

      {query.data?.profile && (
        <Button
          onClick={handleOpenUserCardModal}
          className="ml-2"
          variant="outline"
          size="sm"
        >
          Voir profil
        </Button>
      )}

      {query.data?.user && query.data?.profile && (
        <UserCardModal
          isOpen={isUserCardModalOpen}
          onCloseAction={handleCloseUserCardModal}
          user={mapUserProfileToProfileCardType(query.data)}
        />
      )}
    </div>
  );
}
