import { Interest } from "@/lib/routes/profiles/interfaces/interface";
export interface Profile {
  id: number;
  user_id: string;
  name?: string;
  surname?: string;
  gender?: string;
  orientation?: string;
  city?: string;
  work?: string;
  languages?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  gender_preference?: number;
  relationship_type?: string;
  smoking?: string;
  drinking?: string;
  religion?: string;
  politics?: string;
  zodiac?: string;
  interests?: Interest[];
}
