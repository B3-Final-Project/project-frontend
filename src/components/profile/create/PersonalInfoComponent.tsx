'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GenderEnum } from "@/lib/routes/preferences/enums/gender.enum";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrientationEnum } from "@/lib/routes/preferences/enums/orientation.enum";
import { PROFILE_STEPS } from "./StepComponent";
import { SelectorComponent } from "@/components/SelectorComponent";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";

export function PersonalInfoComponent() {
  const { personalInfo, setPersonalInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setPersonalInfo((prev => ({ ...prev, [field]: value })));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!personalInfo.name?.trim()) newErrors.name = 'Name is required';
    if (!personalInfo.surname?.trim()) newErrors.surname = 'Surname is required';
    if (!personalInfo.gender) newErrors.gender = 'Gender is required';
    if (!personalInfo.orientation) newErrors.orientation = 'Orientation is required';
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) goToNextStep(step as string, PROFILE_STEPS);
  };

  // Convert enum to array of options for the selector
  const genderOptions = Object.values(GenderEnum);
  const orientationOptions = Object.values(OrientationEnum);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              placeholder="Enter your first name"
              value={personalInfo.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Last Name</Label>
            <Input
              id="surname"
              placeholder="Enter your last name"
              value={personalInfo.surname || ''}
              onChange={(e) => handleChange('surname', e.target.value)}
              className={errors.surname ? 'border-red-500' : ''}
            />
            {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
          </div>
        </div>
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
        <Button type="button" variant="outline" onClick={() => goToPreviousStep(step as string, PROFILE_STEPS)}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
