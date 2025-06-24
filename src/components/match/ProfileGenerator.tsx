import { BoosterRouter } from '@/lib/routes/booster';
import { Booster } from '@/lib/routes/booster/interfaces/booster.interface';
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

export const fetchBoosters = async (count: number): Promise<any> => {
  return BoosterRouter.getBoosters(undefined, { count: count.toString() });
};

export const mapBoosterToProfileCardType = (booster: Booster): ProfileCardType => {
  // Gérer l'image principale
  let mainImage = '/vintage.png';
  if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0];
  } else if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  }

  // Filtrer les images null ou vides
  const validImages = booster.images?.filter(img => img) as string[] ?? [];

  // Conversion des énumérations en chaînes lisibles
  const getSmokingLabel = (value: number): string => {
    switch (value) {
      case SmokingEnum.NEVER:
        return 'Non fumeur';
      case SmokingEnum.OCCASIONALLY:
        return 'Occasionnellement';
      case SmokingEnum.REGULARLY:
        return 'Régulièrement';
      case SmokingEnum.TRYING_TO_QUIT:
        return 'Essaie d\'arrêter';
      default:
        return 'Non précisé';
    }
  };

  const getDrinkingLabel = (value: number): string => {
    switch (value) {
      case DrinkingEnum.NEVER:
        return 'Non buveur';
      case DrinkingEnum.SOCIALLY:
        return 'Socialement';
      case DrinkingEnum.REGULARLY:
        return 'Régulièrement';
      default:
        return 'Non précisé';
    }
  };

  const getZodiacLabel = (value: number): string => {
    switch (value) {
      case ZodiacEnum.ARIES:
        return 'Bélier';
      case ZodiacEnum.TAURUS:
        return 'Taureau';
      case ZodiacEnum.GEMINI:
        return 'Gémeaux';
      case ZodiacEnum.CANCER:
        return 'Cancer';
      case ZodiacEnum.LEO:
        return 'Lion';
      case ZodiacEnum.VIRGO:
        return 'Vierge';
      case ZodiacEnum.LIBRA:
        return 'Balance';
      case ZodiacEnum.SCORPIO:
        return 'Scorpion';
      case ZodiacEnum.SAGITTARIUS:
        return 'Sagittaire';
      case ZodiacEnum.CAPRICORN:
        return 'Capricorne';
      case ZodiacEnum.AQUARIUS:
        return 'Verseau';
      case ZodiacEnum.PISCES:
        return 'Poissons';
      case ZodiacEnum.DONT_BELIEVE:
        return 'N\'y croit pas';
      default:
        return 'Non précisé';
    }
  };

  return {
    id: booster.id.toString(),
    name: booster.name ?? 'Utilisateur Holomatch',
    surname: booster.surname,
    image_url: mainImage,
    images: validImages,
    age: booster.age,
    location: booster.city ?? 'Non précisé',
    work: booster.work ?? '',
    description: booster.work ?? `Découvre ${booster.name ?? 'cette personne'} !`,
    languages: booster.languages ?? [],
    smoking: typeof booster.smoking === 'number' ? getSmokingLabel(booster.smoking) : String(booster.smoking ?? ''),
    drinking: typeof booster.drinking === 'number' ? getDrinkingLabel(booster.drinking) : String(booster.drinking ?? ''),
    zodiac: typeof booster.zodiac === 'number' ? getZodiacLabel(booster.zodiac) : String(booster.zodiac ?? ''),
    interests: booster.interests,
    rarity: typeof booster.rarity === 'number' ?
      (booster.rarity === 0 ? 'COMMON' :
       booster.rarity === 1 ? 'UNCOMMON' :
       booster.rarity === 2 ? 'RARE' :
       booster.rarity === 3 ? 'EPIC' :
       booster.rarity === 4 ? 'LEGENDARY' : 'COMMON') :
      String(booster.rarity ?? 'COMMON'),
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
