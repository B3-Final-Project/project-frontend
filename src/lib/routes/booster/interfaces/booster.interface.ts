import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";
import { RarityEnum } from "@/lib/routes/booster/dto/rarity.enum";

export interface UserCard {
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
  orientation?: number;
  relationship_type?: number;
  smoking?: number;
  drinking?: number;
  religion?: number;
  politics?: number;
  zodiac?: number;
  images?: (string | null)[];
  avatarUrl?: string;
  interests?: Interest[];
  created_at?: Date; // Rendu optionnel car peut être absent
  updated_at?: Date; // Rendu optionnel car peut être absent
  rarity?: RarityEnum
}

