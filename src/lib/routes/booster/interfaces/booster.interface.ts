import {
  DrinkingEnum,
  OrientationEnum, PoliticsEnum,
  RelationshipTypeEnum, ReligionEnum, SmokingEnum, ZodiacEnum
} from "@/lib/routes/profiles/enums";
import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export interface BoosterUserProfile {
  id: string;
  name?: string;
  surname?: string;
  age?: number;
}

export interface Booster {
  id: number;
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
  userProfile: BoosterUserProfile;
  created_at: Date;
  updated_at: Date;
}

