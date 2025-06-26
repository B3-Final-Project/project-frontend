"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDrinkingEnum, formatSmokingEnum, formatZodiacEnum } from "@/lib/utils/enum-utils";

import { UserCardModal } from "@/components/UserCardModal";
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import {
  useProfileByIdMutation,
} from "@/hooks/react-query/profiles";
import { useEffect } from "react";

interface AdminUserProfileModalProps {
  readonly user: UserManagementDto;
  readonly isOpen: boolean;
  onClose(): void;
}

export function AdminUserProfileModal({
  user,
  isOpen,
  onClose
}: AdminUserProfileModalProps) {
  const { mutate, data, isError } = useProfileByIdMutation(user.userId);

  useEffect(
    () => {
      if (isOpen && user.userId) {
        // Fetch the profile data when the modal opens
        mutate();
      }
    },
    [isOpen, mutate, user.userId]
  )


  if (isError || !data?.profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Not Found</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p>This user doesn&#39;t have a profile yet</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { profile, user: profileUser } = data;

  // Use the UserCardModal component with the profile data
  return (
    <UserCardModal
      name={`${user.name} ${user.surname}`}
      age={profileUser.age}
      location={profile.city}
      description={`${profile.work ?? ''} ${profile.religion ?? ''} ${profile.politics ?? ''}`.trim()}
      isOpen={isOpen}
      onCloseAction={onClose}
      rarity={undefined} // Profile doesn't have rarity, using user's rarity number as fallback
      image_url={profile.images?.[0]}
      interests={profile.interests}
      languages={profile.languages}
      zodiac={profile.zodiac ? formatZodiacEnum(profile.zodiac) : undefined}
      smoking={profile.smoking ? formatSmokingEnum(profile.smoking) : undefined}
      drinking={profile.drinking ? formatDrinkingEnum(profile.drinking) : undefined}
    />
  );
}
