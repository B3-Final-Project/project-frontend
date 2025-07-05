import { User } from "@/lib/routes/profiles/interfaces/user.interface";

export interface ProfileWithUser {
  id: number;
  city?: string;
  work?: string;
  languages?: string[];
  images?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  orientation?: string;
  relationship_type?: string;
  smoking?: string;
  drinking?: string;
  religion?: string;
  politics?: string;
  zodiac?: string;
  interests?: string[];
  created_at: Date;
  updated_at: Date;
  userProfile: User;
} 