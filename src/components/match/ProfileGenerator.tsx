import { useGetBooster } from "@/hooks/react-query/boosters";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";
import { mapBoosterToProfileCardType } from "@/lib/utils/card-utils";
import React, { useEffect } from "react";

interface ProfileGeneratorProps {
  count: number;
  onProfilesLoaded: (boosters: ProfileCardType[]) => void;
  onError: (err: Error) => void;
  boosterType?: RelationshipTypeEnum | null;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  count,
  onProfilesLoaded,
  onError,
  boosterType,
}) => {
  const { data: boosterData, isError, error, mutate } = useGetBooster(count, boosterType ? String(boosterType) : null);

  useEffect(() => {
    mutate();
  }, [count, mutate]);

  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching boosters:", error);
      onError(error);
    }
  }, [isError, error, onError]);

  useEffect(() => {
    if (boosterData && Array.isArray(boosterData)) {
      const profileCards: ProfileCardType[] = boosterData.map(mapBoosterToProfileCardType);
      onProfilesLoaded(profileCards);
    }
  }, [boosterData, onProfilesLoaded]);

  return null;
};

export default ProfileGenerator;
