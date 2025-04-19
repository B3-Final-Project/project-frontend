'use client';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { useUpdatePreferenceMutation } from "@/hooks/react-query/preferences";

export interface PersonalInfo {
  name: string;
  surname: string;
  gender: string;
  orientation: string;
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
  relationship_type: string;
}

export interface LifestyleInfo {
  smoking: string;
  drinking: string;
  religion: string;
  politics: string;
  zodiac: string;
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
  const preferenceMutation = useUpdatePreferenceMutation()
  const { userData } = useAuth();

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    surname: '',
    gender: '',
    orientation: '',
  });

  const [locationWork, setLocationWork] = useState<LocationWorkInfo>({
    city: '',
    work: '',
    languages: [],
  });

  const [preferenceInfo, setPreferenceInfo] = useState<PreferenceInfo>({
    min_age: 18,
    max_age: 99,
    max_distance: 50,
    relationship_type: '',
  });

  const [lifestyleInfo, setLifestyleInfo] = useState<LifestyleInfo>({
    smoking: '',
    drinking: '',
    religion: '',
    politics: '',
    zodiac: '',
  });

  const saveProfile = useCallback(async () => {
    try {
      if (!userData) {
        throw new Error("You must be logged in to save a profile");
      }

      try {
        preferenceMutation.mutate({
          personalInfo,
          locationWork,
          lifestyleInfo,
          preferenceInfo,
        })
      } catch (error) {
        console.error("Error saving preferences:", error);
        throw new Error("Failed to save preferences");
      }

      toast({
        title: "Profile saved",
        description: "Your profile preferences have been saved successfully.",
      });

      router.push('/profile');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Couldn't save your profil",
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    }
  }, [personalInfo, preferenceInfo, locationWork, lifestyleInfo, router, userData, preferenceMutation]);

  const goToStep = useCallback(
    (step: string) => {
      router.push(`/profile/create/${step}`);
    },
    [router]
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
    [goToStep, saveProfile]
  );

  const goToPreviousStep = useCallback(
    (currentStep: string, steps: string[]) => {
      const idx = steps.indexOf(currentStep);
      if (idx > 0) {
        goToStep(steps[idx - 1]);
      }
    },
    [goToStep]
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
