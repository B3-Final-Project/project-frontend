'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  userId?: string;
  personalInfo: PersonalInfo
  preferenceInfo: PreferenceInfo
  locationWork: LocationWorkInfo
  lifestyleInfo: LifestyleInfo
}

export interface PersonalInfo{
  name: string;
  surname: string;
  gender: string;
  orientation: string;
}

export interface LocationWorkInfo{
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

export interface LifestyleInfo{
  smoking: string;
  drinking: string;
  religion: string;
  politics: string;
  zodiac: string;
}

export const useProfileCreation = () => {
  const router = useRouter();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    surname: '',
    gender: '',
    orientation: '',
  })
  const [locationWork, setLocationWork] = useState<LocationWorkInfo>({
    city: '',
    work: '',
    languages: []
  })
  const [preferences, setPreferences] = useState<PreferenceInfo>({
    min_age: 18,
    max_age: 99,
    max_distance: 50,
    relationship_type: ''
  })
  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    smoking: '',
    drinking: '',
    religion: '',
    politics: '',
    zodiac: '',
  })

  const saveProfile = async () => {
    // Here you would implement the API call to save the profile
    const profile = {
      personalInfo,
      preferences,
      locationWork,
      lifestyle
    }
    console.log('Saving profile:', profile);
  };

  const goToStep = (step: string) => {
    router.push(`/profile/create/${step}`);
  };

  const goToNextStep = (currentStep: string, steps: string[]) => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    } else {
      saveProfile();
    }
  };

  const goToPreviousStep = (currentStep: string, steps: string[]) => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  };

  return {
    personalInfo,
    preferences,
    locationWork,
    lifestyle,
    setPersonalInfo,
    setLocationWork,
    setPreferences,
    setLifestyle,
    saveProfile,
    goToStep,
    goToNextStep,
    goToPreviousStep
  };
};
