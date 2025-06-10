import { BoosterRouter } from '@/lib/routes/booster';
import { Booster } from '@/lib/routes/booster/interfaces/booster.interface';
export interface ProfileCardType {
  id: string;
  name: string;
  image: string;
  age?: number;
  location?: string;
  description: string;
  isRevealed: boolean;
}

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

export const fetchBoosters = async (count: number): Promise<Booster[]> => {
  return BoosterRouter.getBooster(undefined, { count: count.toString() });
};

export const mapBoosterToProfileCardType = (booster: Booster): ProfileCardType => {
  let mainImage = '/vintage.png';
  if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  } else if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0];
  }

  console.log('booster', booster);

  return {
    id: booster.id.toString(),
    name: booster.userProfile?.name || 'Utilisateur Holomatch',
    image: mainImage,
    age: booster.userProfile?.age,
    location: booster.city,
    description: booster.work || `Découvre ${booster.userProfile?.name || 'cette personne'} !`,
    isRevealed: true,
  };
};

interface ProfileGeneratorProps {
  count: number;
  onProfilesLoaded: (boosters: Booster[]) => void;
  onError: (err: Error) => void;
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ count, onProfilesLoaded, onError }) => {

  const {
    data: boosterData,
    isLoading,
    isError,
    error,
  } = useQuery<Booster[], Error>({
    queryKey: ['boosters', count],
    queryFn: () => fetchBoosters(count),
  });

  useEffect(() => {
    if (boosterData) {
      onProfilesLoaded(boosterData);
    }
  }, [boosterData, onProfilesLoaded]);

  useEffect(() => {
    if (isError && error) {
      onError(error);
    }
  }, [isError, error, onError]);

  // This component is responsible for fetching booster profiles and calling the appropriate
  // callbacks (onProfilesLoaded or onError). It does not render any UI itself.
  // The isLoading, isError, and error states from useQuery can be used by the parent component
  // if it needs to display loading or error states.
  return null;
};

export default ProfileGenerator;