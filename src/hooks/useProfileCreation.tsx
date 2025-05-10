"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { DrinkingEnum } from "@/lib/routes/profiles/enums/drinking.enum";
import { GenderEnum } from "@/lib/routes/profiles/enums/gender.enum";
import { OrientationEnum } from "@/lib/routes/profiles/enums/orientation.enum";
import { PoliticsEnum } from "@/lib/routes/profiles/enums/politics.enum";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";
import { ReligionEnum } from "@/lib/routes/profiles/enums/religion.enum";
import { SmokingEnum } from "@/lib/routes/profiles/enums/smoking.enum";
import { ZodiacEnum } from "@/lib/routes/profiles/enums/zodiac.enum";
import { useAuth } from "react-oidc-context";
import {
  useCreateProfileMutation,
} from "@/hooks/react-query/profiles";
import { useRouter } from "next/navigation";

export interface PersonalInfo {
  name: string;
  surname: string;
  age: number;
  gender?: GenderEnum;
  orientation?: OrientationEnum;
}

export interface LocationWorkInfo {
  city: string;
  work: string;
  languages: string[];
}

export interface PreferenceInfo {
  min_age: number;
  max_age: number;
  max_distance: number;
  relationship_type?: RelationshipTypeEnum;
}

export interface LifestyleInfo {
  smoking?: SmokingEnum;
  drinking?: DrinkingEnum;
  religion?: ReligionEnum;
  politics?: PoliticsEnum;
  zodiac?: ZodiacEnum;
}

export interface ProfileCreationApi {
  personalInfo: PersonalInfo;
  setPersonalInfo: Dispatch<SetStateAction<PersonalInfo>>;
  locationWork: LocationWorkInfo;
  setLocationWork: Dispatch<SetStateAction<LocationWorkInfo>>;
  preferenceInfo: PreferenceInfo;
  setPreferenceInfo: Dispatch<SetStateAction<PreferenceInfo>>;
  lifestyleInfo: LifestyleInfo;
  setLifestyleInfo: Dispatch<SetStateAction<LifestyleInfo>>;
  saveProfile: () => Promise<void>;
  goToStep: (step: string) => void;
  goToNextStep: (currentStep: string, steps: string[]) => void;
  goToPreviousStep: (currentStep: string, steps: string[]) => void;
}

export const useProfileCreation = (): ProfileCreationApi => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.profile?.sub;
  const preferenceMutation = useCreateProfileMutation();

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    surname: "",
    age: 18,
  });

  const [locationWork, setLocationWork] = useState<LocationWorkInfo>({
    city: "",
    work: "",
    languages: [],
  });

  const [preferenceInfo, setPreferenceInfo] = useState<PreferenceInfo>({
    min_age: 18,
    max_age: 99,
    max_distance: 50,
  });

  const [lifestyleInfo, setLifestyleInfo] = useState<LifestyleInfo>({});

  const saveProfile = useCallback(async () => {
    if (!userId) {
      console.error("User ID not loaded yet");
      return;
    }

    preferenceMutation.mutate({
      personalInfo,
      locationWork,
      lifestyleInfo,
      preferenceInfo,
    });
  }, [
    userId,
    personalInfo,
    locationWork,
    lifestyleInfo,
    preferenceInfo,
    preferenceMutation,
  ]);

  const goToStep = useCallback(
    (step: string) => {
      router.push(`/profile/create/${step}`);
    },
    [router],
  );

  const goToNextStep = useCallback(
    (currentStep: string, steps: string[]) => {
      const idx = steps.indexOf(currentStep);
      if (idx < steps.length - 1) {
        goToStep(steps[idx + 1]);
      } else {
        saveProfile();
      }
    },
    [goToStep, saveProfile],
  );

  const goToPreviousStep = useCallback(
    (currentStep: string, steps: string[]) => {
      const idx = steps.indexOf(currentStep);
      if (idx > 0) {
        goToStep(steps[idx - 1]);
      }
    },
    [goToStep],
  );

  return {
    personalInfo,
    setPersonalInfo,
    locationWork,
    setLocationWork,
    preferenceInfo,
    setPreferenceInfo,
    lifestyleInfo,
    setLifestyleInfo,
    saveProfile,
    goToStep,
    goToNextStep,
    goToPreviousStep,
  };
};
