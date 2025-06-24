import { BoosterRouter } from '@/lib/routes/booster';
import { Booster } from '@/lib/routes/booster/interfaces/booster.interface';
import { formatDrinkingEnum, formatSmokingEnum, formatZodiacEnum } from '@/lib/utils/enum-utils';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { ZodiacEnum } from '@/lib/routes/profiles/enums/zodiac.enum';
import { SmokingEnum } from '@/lib/routes/profiles/enums/smoking.enum';
import { DrinkingEnum } from '@/lib/routes/profiles/enums/drinking.enum';
export interface ProfileCardType {
  id: string;
  name: string;
  surname?: string;
  image_url: string;
  images?: string[];
  age?: number;
  location?: string;
  description: string;
  work?: string;
  languages?: string[];
  smoking?: string;
  drinking?: string;
  zodiac?: string;
  interests?: Interest[];
  rarity?: string;
  isRevealed: boolean;
}

import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export const mapBoosterToProfileCardType = (booster: Booster): ProfileCardType => {
  let mainImage = '/vintage.png';
  if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0];
  } else if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  }

  const validImages = booster.images?.filter(img => img) as string[] || [];


  return {
    id: booster.id.toString(),
    name: booster.name || 'Utilisateur Holomatch',
    surname: booster.surname,
    image_url: mainImage,
    images: validImages,
    age: booster.age,
    location: booster.city || 'Non précisé',
    work: booster.work || '',
    description: booster.work || `Découvre ${booster.name || 'cette personne'} !`,
    languages: booster.languages || [],
    smoking: typeof booster.smoking === 'number' ? formatSmokingEnum(booster.smoking) : String(booster.smoking || ''),
    drinking: typeof booster.drinking === 'number' ? formatDrinkingEnum(booster.drinking) : String(booster.drinking || ''),
    zodiac: typeof booster.zodiac === 'number' ? formatZodiacEnum(booster.zodiac) : String(booster.zodiac || ''),
    interests: booster.interests?.map(interest => ({
      id: typeof interest.id === 'string' ? parseInt(interest.id, 10) || 0 : Number(interest.id),
      name: interest.name,
      icon: interest.icon || 'sparkles'
    })) || [],
    rarity: typeof booster.rarity === 'number' ?
      (booster.rarity === 0 ? 'COMMON' :
        booster.rarity === 1 ? 'UNCOMMON' :
          booster.rarity === 2 ? 'RARE' :
            booster.rarity === 3 ? 'EPIC' :
              booster.rarity === 4 ? 'LEGENDARY' : 'COMMON') :
      String(booster.rarity || 'COMMON'),
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


  return null;
};

export default ProfileGenerator;
