import {
  Booster,
} from "@/lib/routes/booster/interfaces/booster.interface";
import { ProfileCardType } from "@/lib/routes/profiles/dto/profile-card-type.dto";
import {
  formatDrinkingEnum, formatRarityEnum,
  formatSmokingEnum,
  formatZodiacEnum
} from "@/lib/utils/enum-utils";
import { GetProfileResponse } from "@/lib/routes/profiles/response/get-profile.response";
import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export const mapBoosterToProfileCardType = (
  booster: Booster,
): ProfileCardType => {
  let mainImage = "/vintage.png";
  if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0];
  } else if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  }

  const validImages = (booster.images?.filter((img) => img) as string[]) || [];

  return {
    id: booster.id.toString(),
    name: booster.name || "Utilisateur Holomatch",
    surname: booster.surname,
    image_url: mainImage,
    images: validImages,
    age: booster.age,
    location: booster.city || "Non précisé",
    work: booster.work || "",
    languages: booster.languages || [],
    smoking: formatSmokingEnum(booster.smoking),
    drinking: formatDrinkingEnum(booster.drinking),
    zodiac: formatZodiacEnum(booster.zodiac),
    interests:
      booster.interests?.map((interest: Interest) => ({
        id: interest.id,
        prompt: interest.prompt,
        answer: interest.answer,
        created_at: interest.created_at,
        updated_at: interest.updated_at,
      })) || [],
    rarity: formatRarityEnum(booster.rarity),
    isRevealed: true,
  };
};
