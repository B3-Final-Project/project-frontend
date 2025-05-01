"use client";

import { DrinkingEnum, PoliticsEnum, ReligionEnum, SmokingEnum, ZodiacEnum } from "@/lib/routes/profiles/enums";
import { useEffect, useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { LifestyleInfo } from "@/hooks/useProfileCreation";
import { SelectorComponent } from "@/components/profile/SelectorComponent";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";

export function LifestyleDialog() {
  const { data, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const profile = data?.profile;
  const user = data?.user;

  const [formData, setFormData] = useState<LifestyleInfo>({
    smoking: undefined,
    drinking: undefined,
    religion: undefined,
    politics: undefined,
    zodiac: undefined
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        smoking: profile.smoking,
        drinking: profile.drinking,
        religion: profile.religion,
        politics: profile.politics,
        zodiac: profile.zodiac
      });
    }
  }, [profile]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile || !user) return;

    updateProfile.mutate({
      personalInfo: {
        name: user.name || "",
        surname: user.surname || "",
        age: user.age || 18,
        gender: user.gender,
        orientation: profile.orientation
      },
      preferenceInfo: {
        min_age: profile.min_age || 18,
        max_age: profile.max_age || 99,
        max_distance: profile.max_distance || 50,
        relationship_type: profile.relationship_type
      },
      locationWork: {
        city: profile.city || "",
        work: profile.work || "",
        languages: profile.languages || [],
      },
      lifestyleInfo: formData
    });
  };

  // Extract only numeric values from enums (not string keys)
  const smokingOptions = Object.keys(SmokingEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const drinkingOptions = Object.keys(DrinkingEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const religionOptions = Object.keys(ReligionEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const politicsOptions = Object.keys(PoliticsEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const zodiacOptions = Object.keys(ZodiacEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));



  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DialogContent>
      <DialogTitle className="text-lg font-semibold mb-4">Lifestyle Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <SelectorComponent
            value={formData.smoking}
            fieldName="smoking"
            options={smokingOptions}
            label="Smoking"
            onChange={handleInputChange}
            placeholder="Select smoking preference"
          />

          <SelectorComponent
            value={formData.drinking}
            fieldName="drinking"
            options={drinkingOptions}
            label="Drinking"
            onChange={handleInputChange}
            placeholder="Select drinking preference"
          />

          <SelectorComponent
            value={formData.religion}
            fieldName="religion"
            options={religionOptions}
            label="Religion"
            onChange={handleInputChange}
            placeholder="Select religion"
          />

          <SelectorComponent
            value={formData.politics}
            fieldName="politics"
            options={politicsOptions}
            label="Politics"
            onChange={handleInputChange}
            placeholder="Select political view"
          />

          <SelectorComponent
            value={formData.zodiac}
            fieldName="zodiac"
            options={zodiacOptions}
            label="Zodiac Sign"
            onChange={handleInputChange}
            placeholder="Select zodiac sign"
          />

          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
