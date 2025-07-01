import { UserCard } from "@/lib/routes/booster/interfaces/booster.interface";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import {
  formatDrinkingEnum,
  formatSmokingEnum,
  formatZodiacEnum
} from "@/lib/utils/enum-utils";
import {
  GetProfileResponse
} from "@/lib/routes/profiles/response/get-profile.response";

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
    id: booster.id?.toString(),
    name: booster.name ?? 'Utilisateur Holomatch',
    surname: booster.surname,
    image_url: mainImage,
    images: validImages,
    age: booster.age,
    location: booster.city ?? 'Non précisé',
    work: booster.work ?? '',
    languages: booster.languages ?? [],
    smoking: formatSmokingEnum(booster.smoking ?? ''),
    drinking:  formatDrinkingEnum(booster.drinking ?? ''),
    zodiac:  formatZodiacEnum(booster.zodiac ?? ''),
    interests: booster.interests,
    rarity: booster.rarity,
    isRevealed: true,
  };
};

export const mapUserProfileToProfileCardType = (userProfile: GetProfileResponse): ProfileCardType => {
  // Gérer l'image principale
  let mainImage = '/vintage.png';
  if (userProfile.profile.images && userProfile.profile.images.length > 0 && userProfile.profile.images[0]) {
    mainImage = userProfile.profile.images[0];
  }

  // Filtrer les images null ou vides
  const validImages = userProfile.profile.images?.filter(img => img) as string[] ?? [];

  return {
    id: userProfile.profile.id.toString(),
    name: userProfile.user.name ?? 'Utilisateur Holomatch',
    surname: userProfile.user.surname,
    image_url: mainImage,
    images: validImages,
    age: userProfile.user.age,
    location: userProfile.profile.city ?? 'Non précisé',
    work: userProfile.profile.work ?? '',
    languages: userProfile.profile.languages ?? [],
    smoking: formatSmokingEnum(userProfile.profile.smoking ?? ''),
    drinking: formatDrinkingEnum(userProfile.profile.drinking ?? ''),
    zodiac: formatZodiacEnum(userProfile.profile.zodiac ?? ''),
    interests: userProfile.profile.interests,
    isRevealed: true,
  };
}
