"use client";

import { Button } from "@/components/ui/button";
import { GenericProfileDialog } from "@/components/profile/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { useState } from "react";

export function LocationWorkDialog() {
  const [newLanguage, setNewLanguage] = useState<string>("");

  return (
    <GenericProfileDialog<LocationWorkInfo>
      title="Update Location & Work"
      initialFormData={{
        city: "",
        work: "",
        languages: [],
      }}
      extractFormDataFromProfile={(profile) => ({
        city: profile.city ?? "",
        work: profile.work ?? "",
        languages: profile.languages ?? [],
      })}
      buildUpdatePayload={(formData) => ({
        locationWork: formData,
      })}
      renderFormContent={(formData, handleInputChange, setFormData) => {
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

        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                value={formData.work}
                onChange={(e) => handleInputChange("work", e.target.value)}
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
          </>
        );
      }}
    />
  );
}
