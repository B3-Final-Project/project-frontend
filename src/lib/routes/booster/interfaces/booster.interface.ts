import {
  DrinkingEnum,
  OrientationEnum,
  PoliticsEnum,
  RelationshipTypeEnum,
  ReligionEnum,
  SmokingEnum,
  ZodiacEnum,
} from "@/lib/routes/preferences/enums";
import { Interest } from "@/lib/routes/preferences/interfaces/interface";

export interface BoosterUserProfile {
  id: string;
  name?: string;
  surname?: string;
  age?: number;
}

export interface Booster {
  id: number;
  name?: string;
  surname?: string;
  age?: number;
  city?: string;
  work?: string;
  languages?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  orientation?: OrientationEnum;
  relationship_type?: RelationshipTypeEnum;
  smoking?: SmokingEnum;
  drinking?: DrinkingEnum;
  religion?: ReligionEnum;
  politics?: PoliticsEnum;
  zodiac?: ZodiacEnum;
  images?: (string | null)[];
  avatarUrl?: string;
  interests?: Interest[];
  userProfile?: BoosterUserProfile; // Rendu optionnel car l'API peut ne pas l'inclure
  created_at?: Date; // Rendu optionnel car peut être absent
  updated_at?: Date; // Rendu optionnel car peut être absent
  rarity?: RarityEnum;
}
