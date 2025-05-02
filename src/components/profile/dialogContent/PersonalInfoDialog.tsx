"use client";

import { GenderEnum, OrientationEnum } from "@/lib/routes/profiles/enums";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfo } from "@/hooks/useProfileCreation";
import { SelectorComponent } from "@/components/profile/SelectorComponent";
import { getEnumOptions } from "@/lib/utils/enum-utils";

// Define options outside component to prevent recreation on each render
const genderOptions = getEnumOptions(GenderEnum)

const orientationOptions = getEnumOptions(OrientationEnum)

export function PersonalInfoDialog() {
  return (
    <GenericProfileDialog<PersonalInfo>
      title="Personal Information"
      initialFormData={{
        name: "",
        surname: "",
        age: 18,
        gender: undefined,
        orientation: undefined
      }}
      extractFormDataFromProfile={(profile, user) => ({
        name: user.name || "",
        surname: user.surname || "",
        age: user.age || 18,
        gender: user.gender,
        orientation: profile.orientation
      })}
      buildUpdatePayload={(formData) => ({
        personalInfo: formData,
      })}
      renderFormContent={(formData, handleInputChange) => (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">Last Name</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
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
              onChange={(e) => handleInputChange("age", Number(e.target.value))}
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
        </>
      )}
    />
  );
}
