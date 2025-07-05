"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "../Loader";
import { Settings } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import { UserCardModal } from "@/components/UserCardModal";
import { mapUserProfileToProfileCardType } from "@/lib/utils/card-utils";
import { useProfileQuery } from "@/hooks/react-query/profiles";
import { useState } from "react";

export function ProfileHeader() {
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const query = useProfileQuery();

  const handleOpenUserCardModal = () => setIsUserCardModalOpen(true);
  const handleCloseUserCardModal = () => setIsUserCardModalOpen(false);
  const handleOpenSettingsDialog = () => setIsSettingsDialogOpen(true);
  const handleCloseSettingsDialog = () => setIsSettingsDialogOpen(false);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.isError) {
    return <div>{JSON.stringify(query.error)}</div>;
  }

  return (
    <div className="flex justify-between items-center px-5 py-8 w-full md:max-w-[750px] md:mx-auto">
      <Button
        onClick={handleOpenSettingsDialog}
        variant="ghost"
        size="icon"
        className="hover:bg-accent"
      >
        <Settings className="h-5 w-5" />
      </Button>

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
          isConnectedUser={true}
        />
      )}

      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={handleCloseSettingsDialog}
      />
    </div>
  );
}
