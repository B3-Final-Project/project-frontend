"use client";

import { GenderEnum, OrientationEnum } from "@/lib/routes/profiles/enums";
import { useEffect, useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfo } from "@/hooks/useProfileCreation";
import { SelectorComponent } from "@/components/profile/SelectorComponent";

export function PersonalInfoDialog() {
  const { data, isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const profile = data?.profile;
  const user = data?.user;

  const [formData, setFormData] = useState<PersonalInfo>({
    name: "",
    surname: "",
    age: 18,
    gender: undefined,
    orientation: undefined
  });

  useEffect(() => {
    if (profile && user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        age: user.age || 18,
        gender: user.gender,
        orientation: profile.orientation
      });
    }
  }, [data, profile, user]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    updateProfile.mutate({
      personalInfo: formData,
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
      lifestyleInfo: {
        smoking: profile.smoking,
        drinking: profile.drinking,
        religion: profile.religion,
        politics: profile.politics,
        zodiac: profile.zodiac
      }
    });
  };

  const genderOptions = Object.keys(GenderEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const orientationOptions = Object.keys(OrientationEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DialogContent>
      <DialogTitle >Personal Information</DialogTitle>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Last Name</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              placeholder="Enter your last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={18}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            />
          </div>

          <SelectorComponent
            value={formData.gender}
            fieldName="gender"
            options={genderOptions}
            label="Gender"
            onChange={handleInputChange}
            placeholder="Select your gender"
          />

          <SelectorComponent
            value={formData.orientation}
            fieldName="orientation"
            options={orientationOptions}
            label="Sexual Orientation"
            onChange={handleInputChange}
            placeholder="Select your orientation"
          />

          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
