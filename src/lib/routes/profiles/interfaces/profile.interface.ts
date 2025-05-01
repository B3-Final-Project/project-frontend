import { Interest } from "@/lib/routes/profiles/interfaces/interface";
import {
  DrinkingEnum,
  GenderEnum,
  OrientationEnum, PoliticsEnum,
  RelationshipTypeEnum, ReligionEnum, SmokingEnum, ZodiacEnum
} from "@/lib/routes/profiles/enums";
export interface Profile {
  id: number;
  user_id: string;
  name?: string;
  surname?: string;
  gender?: GenderEnum;
  orientation?: OrientationEnum;
  city?: string;
  work?: string;
  languages?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  gender_preference?: GenderEnum;
  relationship_type?: RelationshipTypeEnum;
  smoking?: SmokingEnum;
  drinking?: DrinkingEnum;
  religion?: ReligionEnum;
  politics?: PoliticsEnum;
  zodiac?: ZodiacEnum;
  interests?: Interest[];
}
