import { RarityEnum } from "@/lib/routes/booster/dto/rarity.enum";

export const getRarityGradient = (rarity?: RarityEnum): string => {
  switch (rarity) {
    case RarityEnum.COMMON:
      return 'linear-gradient(to bottom right, #FF6B6B, #ED2272, #6A5ACD)';
    case RarityEnum.UNCOMMON:
      return 'linear-gradient(to bottom right, #00FFCC, #33CC99, #006633)';
    case RarityEnum.RARE:
      return 'linear-gradient(to bottom right, #00CCFF, #0066FF, #3300FF)';
    case RarityEnum.EPIC:
      return 'linear-gradient(to bottom right, #CC33FF, #9900FF, #6600CC)';
    case RarityEnum.LEGENDARY:
      return 'linear-gradient(to bottom right, #FFD700, #FFA500, #FF0000)';
    default:
      return 'linear-gradient(to bottom right, #FF6B6B, #ED2272, #6A5ACD)';
  }
};
