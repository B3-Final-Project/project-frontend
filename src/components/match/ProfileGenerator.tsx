import React, { useEffect } from "react";
import { useGetBooster } from "@/hooks/react-query/boosters";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { mapBoosterToProfileCardType } from "@/lib/utils/card-utils";

interface ProfileGeneratorProps {
  count: number;
  onProfilesLoaded: (boosters: ProfileCardType[]) => void;
  onError: (err: Error) => void;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({
  count,
  onProfilesLoaded,
  onError,
}) => {
  const { data: boosterData, isError, error, mutate } = useGetBooster(count);

  // Trigger the mutation when component mounts or count changes
  useEffect(() => {
    mutate();
  }, [count, mutate]);

  // Handle errors
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching boosters:", error);
      onError(error);
    }
  }, [isError, error, onError]);

  // Handle successful data
  useEffect(() => {
    if (boosterData) {
      const profileCards: ProfileCardType[] = boosterData.map(mapBoosterToProfileCardType);
      onProfilesLoaded(profileCards);
    }
  }, [boosterData, onProfilesLoaded]);

  return null;
};

export default ProfileGenerator;
