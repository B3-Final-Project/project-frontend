"use client";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";

export function LocationWorkDialog() {
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
      buildUpdatePayload={(formData) =>
        ({
          locationWork: formData,
        }) as Partial<UpdateProfileDto>
      }
      renderFormContent={(formData, handleInputChange) => {
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
              <Label>Preferred Language</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.languages}
                  onChange={(e) =>
                    handleInputChange("languages", e.target.value.split(",")[0])
                  }
                  placeholder="Add a language"
                />
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
