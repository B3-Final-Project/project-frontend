'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import { PROFILE_STEPS } from "./StepComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PersonalInfoComponent() {
  const { personalInfo, setPersonalInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setPersonalInfo({...personalInfo, [field]: value});
    console.log(personalInfo)
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!personalInfo.surname?.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!personalInfo.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!personalInfo.orientation) {
      newErrors.orientation = 'Orientation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      goToNextStep(step as string, PROFILE_STEPS);
    }
  };

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
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={personalInfo.gender || ''}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <SelectTrigger id="gender" className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <Select
                value={personalInfo.orientation || ''}
                onValueChange={(value) => handleChange('orientation', value)}
              >
                <SelectTrigger id="orientation" className={errors.orientation ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="gay">Gay</SelectItem>
                  <SelectItem value="lesbian">Lesbian</SelectItem>
                  <SelectItem value="bisexual">Bisexual</SelectItem>
                  <SelectItem value="pansexual">Pansexual</SelectItem>
                  <SelectItem value="asexual">Asexual</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.orientation && <p className="text-sm text-red-500">{errors.orientation}</p>}
            </div>
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
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
