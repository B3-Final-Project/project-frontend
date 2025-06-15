import {
  DrinkingEnum,
  SmokingEnum,
  ZodiacEnum
} from "@/lib/routes/profiles/enums";
import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export interface UserCardDto {
  id: number;
  name: string;
  age: number;
  city: string;
  work: string;
  images: string[];
  languages?: string[];
  smoking?: SmokingEnum;
  drinking?: DrinkingEnum;
  zodiac?: ZodiacEnum;
  interests?: Interest[];
}
