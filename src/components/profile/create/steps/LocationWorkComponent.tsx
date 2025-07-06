"use client";

import React, { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityInput } from "@/components/profile/shared/CityInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { PROFILE_STEPS } from "../StepComponent";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";

export function LocationWorkComponent() {
  const { locationWork, setLocationWork, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: string, value: string) => {
    setLocationWork((prev: LocationWorkInfo) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: "" }));
    }
  }, [errors, setLocationWork]);

  const handleCityChange = useCallback((city: string) => {
    setLocationWork((prev: LocationWorkInfo) => ({ ...prev, city }));
    if (errors.city) {
      setErrors((prev: Record<string, string>) => ({ ...prev, city: "" }));
    }
  }, [errors.city, setLocationWork]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesStr = e.target.value;
    const languagesList = languagesStr
      .split(",")
      .map((lang: string) => lang.trim())
      .filter((lang: string) => lang !== "");

    setLocationWork({ ...locationWork, languages: languagesList });

    if (errors.languages) {
      setErrors((prev: Record<string, string>) => ({ ...prev, languages: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!locationWork.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!locationWork.work?.trim()) {
      newErrors.work = "Occupation is required";
    }

    if (!locationWork.languages || locationWork.languages.length === 0) {
      newErrors.languages = "At least one language is required";
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
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Location & Work</h3>

        <div className="space-y-4">
          {/* City field */}
          <CityInput
            value={locationWork.city || ""}
            onChange={handleCityChange}
            error={errors.city}
            placeholder="Where do you live?"
            label="City"
          />

          {/* Work field */}
          <div className="space-y-2">
            <Label htmlFor="work">Occupation</Label>
            <Input
              id="work"
              placeholder="What do you do?"
              value={locationWork.work ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("work", e.target.value)}
              className={errors.work ? "border-red-500" : ""}
            />
            {errors.work && (
              <p className="text-sm text-red-500">{errors.work}</p>
            )}
          </div>

          {/* Language field */}
          <div className="space-y-2">
            <Label htmlFor="languages">Preferred Language</Label>
            <Input
              id="languages"
              placeholder="English, Spanish, French, etc."
              value={locationWork.languages?.join(", ") ?? ""}
              onChange={handleLanguageChange}
              className={errors.languages ? "border-red-500" : ""}
            />
            {errors.languages && (
              <p className="text-sm text-red-500">{errors.languages}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation buttons */}
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
