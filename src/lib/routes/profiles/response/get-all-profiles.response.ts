import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
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
  orientation?: any;
  relationship_type?: any;
  smoking?: any;
  drinking?: any;
  religion?: any;
  politics?: any;
  zodiac?: any;
  interests?: any[];
  created_at: Date;
  updated_at: Date;
  userProfile: User;
} 