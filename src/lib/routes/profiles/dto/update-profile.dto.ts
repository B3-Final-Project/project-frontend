import {
  LifestyleInfo,
  LocationWorkInfo,
  PersonalInfo,
  PreferenceInfo
} from "@/hooks/useProfileCreation";

export interface UpdateProfileDto {
  personalInfo: PersonalInfo;
  preferenceInfo: PreferenceInfo;
  locationWork: LocationWorkInfo;
  lifestyleInfo: LifestyleInfo;
}
