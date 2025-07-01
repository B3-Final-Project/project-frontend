"use client";

import { useProfileByIdMutation } from "@/hooks/react-query/profiles";
import { UserCardModal } from "@/components/UserCardModal";
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import { useEffect, useState } from "react";
import { mapUserProfileToProfileCardType } from "@/lib/utils/card-utils";
import { ProfileCardType } from "@/lib/routes/profiles/dto/profile-card-type.dto";

interface UserProfileModalLoaderProps {
  readonly user: UserManagementDto;
  readonly isOpen: boolean;
  onClose(): void;
}

export function UserProfileModalLoader({
  user,
  isOpen,
  onClose,
}: UserProfileModalLoaderProps) {
  const { mutate, data } = useProfileByIdMutation(user.userId);
  const [fetched, setFetched] = useState(false);
  const [profileCard, setProfileCard] = useState<ProfileCardType>();

  useEffect(() => {
    if (isOpen && !fetched) {
      mutate();
      setFetched(true);
    }
    if (!isOpen) {
      setFetched(false);
    }
  }, [isOpen, fetched, mutate]);

  useEffect(() => {
    if (data) {
      setProfileCard(mapUserProfileToProfileCardType(data));
    }
  }, [data]);

  if (!profileCard) {
    return null; // or a loading spinner
  }
  return (
    <UserCardModal
      user={profileCard}
      isOpen={isOpen}
      onCloseAction={onClose}
      isConnectedUser={true}
    />
  );
}
