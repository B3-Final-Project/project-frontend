"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { useState } from "react";

export function LocationWorkDialog() {
  const { data , isLoading } = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const profile = data?.profile

  const [formData, setFormData] = useState<LocationWorkInfo>({
    city: profile?.city || "",
    work: profile?.work || "",
    languages: profile?.languages || [],
  });

  const [newLanguage, setNewLanguage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    updateProfile.mutate({
      personalInfo: {
        name: "",
        surname: "",
        age: 0,
        gender: 0,
        orientation: profile.orientation
      },
      preferenceInfo: {
        min_age: profile.min_age || 18,
        max_age: profile.max_age || 99,
        max_distance: profile.max_distance || 50,
        relationship_type: profile.relationship_type
      },
      locationWork: formData,
      lifestyleInfo: {
        smoking: profile.smoking,
        drinking: profile.drinking,
        religion: profile.religion,
        politics: profile.politics,
        zodiac: profile.zodiac
      }
    });
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage]
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(lang => lang !== language)
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DialogContent>
      <DialogTitle className="text-lg font-semibold mb-4">Update Location & Work</DialogTitle>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter your city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work">Work</Label>
            <Input
              id="work"
              value={formData.work}
              onChange={(e) => setFormData({ ...formData, work: e.target.value })}
              placeholder="Enter your occupation"
            />
          </div>

          <div className="space-y-2">
            <Label>Languages</Label>
            <div className="flex gap-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add a language"
              />
              <Button type="button" onClick={addLanguage}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.languages.map((lang, index) => (
                <div key={index} className="bg-gray-100 rounded-md px-2 py-1 flex items-center">
                  {lang}
                  <button
                    type="button"
                    className="ml-1 text-red-500"
                    onClick={() => removeLanguage(lang)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
