"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GenderEnum } from "@/lib/routes/profiles/enums/gender.enum";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_STEPS } from "../StepComponent";
import { SelectorComponent } from "@/components/profile/SelectorComponent";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";
import { getEnumOptions } from "@/lib/utils/enum-utils";

export function PersonalInfoComponent() {
  const { personalInfo, setPersonalInfo, goToNextStep, goToPreviousStep } =
    useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!personalInfo.name?.trim()) newErrors.name = "Name is required";
    if (!personalInfo.surname?.trim())
      newErrors.surname = "Surname is required";
    if (typeof personalInfo.gender !== "number")
      newErrors.gender = "Gender is required";
    if (typeof personalInfo.orientation !== "number")
      newErrors.orientation = "Orientation is required";

    if (personalInfo.age !== undefined) {
      if (personalInfo.age < 18)
        newErrors.age = "You must be at least 18 years old";
      if (personalInfo.age > 120) newErrors.age = "Please enter a valid age";
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) goToNextStep(step as string, PROFILE_STEPS);
  };

  const genderOptions = getEnumOptions(GenderEnum);
  const orientationOptions = getEnumOptions(GenderEnum);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">First Name</Label>
              <Input
                id="name"
                value={personalInfo.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                placeholder="Your first name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Last Name</Label>
              <Input
                id="surname"
                value={personalInfo.surname || ""}
                onChange={(e) => handleChange("surname", e.target.value)}
                className={errors.surname ? "border-red-500" : ""}
                placeholder="Your last name"
              />
              {errors.surname && (
                <p className="text-sm text-red-500">{errors.surname}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={personalInfo.age || ""}
                onChange={(e) => handleChange("age", Number(e.target.value))}
                className={errors.age ? "border-red-500" : ""}
                placeholder="Your age"
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Your Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectorComponent
              value={personalInfo.gender}
              onChange={handleChange}
              options={genderOptions}
              label="Gender"
              fieldName="gender"
              errors={errors.gender}
              placeholder="Select your gender"
            />
            <SelectorComponent
              value={personalInfo.orientation}
              onChange={handleChange}
              options={orientationOptions}
              label="Orientation"
              fieldName="orientation"
              errors={errors.orientation}
              placeholder="Select your orientation"
            />
          </div>
        </Card>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToPreviousStep(step as string, PROFILE_STEPS)}
        >
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
