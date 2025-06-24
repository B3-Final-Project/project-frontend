import { UserCard } from "@/lib/routes/booster/interfaces/booster.interface";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import {
  formatDrinkingEnum,
  formatSmokingEnum,
  formatZodiacEnum
} from "@/lib/utils/enum-utils";

export const mapBoosterToProfileCardType = (booster: UserCard): ProfileCardType => {
  // Gérer l'image principale
  let mainImage = '/vintage.png';
  if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0];
  } else if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  }

  // Filtrer les images null ou vides
  const validImages = booster.images?.filter(img => img) as string[] ?? [];

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
    smoking: formatSmokingEnum(booster.smoking ?? ''),
    drinking:  formatDrinkingEnum(booster.drinking ?? ''),
    zodiac:  formatZodiacEnum(booster.zodiac ?? ''),
    interests: booster.interests,
    rarity: booster.rarity,
    isRevealed: true,
  };
};
