import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export interface ProfileCardType {
  id: string;
  name: string;
  surname?: string;
  image_url: string;
  images?: string[];
  age?: number;
  location?: string;
  work?: string;
  languages?: string[];
  smoking?: string;
  drinking?: string;
  zodiac?: string;
  interests?: Interest[];
  rarity: string;
  isRevealed: boolean;
}
