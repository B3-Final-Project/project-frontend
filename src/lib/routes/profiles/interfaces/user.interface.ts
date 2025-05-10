import { GenderEnum } from "@/lib/routes/profiles/enums";

export interface User {
  id: string;
  user_id: string;
  name: string;
  surname: string;
  gender: GenderEnum;
  age: number;
  location: string;
  rarity: number;
  currency: number;
  images: string[]
  created_at: Date;
  updated_at: Date;
}
