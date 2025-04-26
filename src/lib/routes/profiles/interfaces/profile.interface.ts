import { Interest } from "@/lib/routes/profiles/interfaces/interface";
import {
  LifestyleInfo,
  LocationWorkInfo,
  PersonalInfo,
  PreferenceInfo
} from "@/hooks/useProfileCreation";

export interface Profile {
  userId?: string;
  personalInfo: PersonalInfo;
  preferenceInfo: PreferenceInfo;
  locationWork: LocationWorkInfo;
  lifestyleInfo: LifestyleInfo;
  interests?: Interest[];
}
