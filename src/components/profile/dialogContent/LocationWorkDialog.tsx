"use client";

import { CityInput } from "@/components/profile/shared/CityInput";
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
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      extractFormDataFromProfile={(profile, _user) => ({
        city: profile.city ?? "",
        work: profile.work ?? "",
        languages: profile.languages ?? [],
      })}
      buildUpdatePayload={(formData) =>
        ({
          locationWork: formData,
        }) as Partial<UpdateProfileDto>
      }
      renderFormContent={(formData, handleInputChange, setFormData) => {
        const handleCityChange = (city: string) => {
          handleInputChange("city", city);
          console.log("After handleInputChange call");
        };

        const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const languagesStr = e.target.value;
          const languagesList = languagesStr
            .split(",")
            .map((lang: string) => lang.trim())
            .filter((lang: string) => lang !== "");

          setFormData({ ...formData, languages: languagesList });
        };

        return (
          <>
            <CityInput
              value={formData.city}
              onChange={handleCityChange}
              placeholder="Enter your city"
              label="City"
            />

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
              <Label htmlFor="languages">Preferred Language</Label>
              <Input
                id="languages"
                value={formData.languages?.join(", ") ?? ""}
                onChange={handleLanguageChange}
                placeholder="English, Spanish, French, etc."
              />
            </div>
          </>
        );
      }}
    />
  );
}
