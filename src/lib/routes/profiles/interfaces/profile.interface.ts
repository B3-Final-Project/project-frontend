import {
  DrinkingEnum,
  OrientationEnum,
  PoliticsEnum,
  RelationshipTypeEnum,
  ReligionEnum,
  SmokingEnum,
  ZodiacEnum,
} from "@/lib/routes/profiles/enums";

import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";

export interface Profile {
  id: number;
  city?: string;
  work?: string;
  languages?: string[];
  images?: string[];
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
  userProfile: User;
  interests?: Interest[];
  created_at: Date;
  updated_at: Date;
}
