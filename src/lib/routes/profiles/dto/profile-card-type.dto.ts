import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";
import { RarityEnum } from "@/lib/routes/booster/dto/rarity.enum";

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
  rarity?: RarityEnum;
  isRevealed: boolean;
}
