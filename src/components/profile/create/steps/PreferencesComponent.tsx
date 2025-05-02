'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PROFILE_STEPS } from "../StepComponent";
import { Slider } from "@/components/ui/slider";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";
import { SelectorComponent } from "@/components/profile/SelectorComponent";

export function PreferencesComponent() {
  const { preferenceInfo, setPreferenceInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setPreferenceInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!preferenceInfo.min_age || preferenceInfo.min_age < 18) {
      newErrors.min_age = 'Minimum age must be at least 18';
    }

    if (!preferenceInfo.max_age || preferenceInfo.max_age < preferenceInfo.min_age) {
      newErrors.max_age = 'Maximum age must be greater than minimum age';
    }

    if (!preferenceInfo.max_distance) {
      newErrors.max_distance = 'Maximum distance is required';
    }

    if (typeof preferenceInfo.relationship_type !== 'number') {
      newErrors.relationship_type = 'Relationship type is required';
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

  // Default values for min and max age sliders
  const minAge = preferenceInfo.min_age || 18;
  const maxAge = preferenceInfo.max_age || 99;

  // Extract only numeric values from the RelationshipTypeEnum
  const relationshipTypeOptions = Object.keys(RelationshipTypeEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Dating Preferences</h3>

        <div className="space-y-6">
          {/* Age Range */}
          <div className="space-y-4">
            <Label>Age Range</Label>
            <div className="flex justify-between items-center">
              <span>{minAge} years</span>
              <span>to</span>
              <span>{maxAge} years</span>
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="min-age" className="text-sm">
                  Minimum Age
                </Label>
                <Slider
                  id="min-age"
                  min={18}
                  max={99}
                  step={1}
                  value={[minAge]}
                  onValueChange={(value) => handleChange("min_age", value[0])}
                  className={errors.min_age ? "border-red-500" : ""}
                />
                {errors.min_age && (
                  <p className="text-sm text-red-500">{errors.min_age}</p>
                )}
              </div>
              <div>
                <Label htmlFor="max-age" className="text-sm">
                  Maximum Age
                </Label>
                <Slider
                  id="max-age"
                  min={18}
                  max={99}
                  step={1}
                  value={[maxAge]}
                  onValueChange={(value) => handleChange("max_age", value[0])}
                  className={errors.max_age ? "border-red-500" : ""}
                />
                {errors.max_age && (
                  <p className="text-sm text-red-500">{errors.max_age}</p>
                )}
              </div>
            </div>
          </div>

          {/* Maximum Distance */}
          <div className="space-y-2">
            <Label>Maximum Distance</Label>
            <div className="flex justify-between items-center">
              <span>{preferenceInfo.max_distance || 50} km</span>
            </div>
            <Slider
              id="max-distance"
              min={5}
              max={150}
              step={5}
              value={[preferenceInfo.max_distance || 50]}
              onValueChange={(value) => handleChange("max_distance", value[0])}
              className={errors.max_distance ? "border-red-500" : ""}
            />
            {errors.max_distance && (
              <p className="text-sm text-red-500">{errors.max_distance}</p>
            )}
          </div>

          {/* Relationship Type */}
          <SelectorComponent
            value={preferenceInfo.relationship_type}
            fieldName="relationship_type"
            options={relationshipTypeOptions}
            label="Relationship Type"
            onChange={handleChange}
            placeholder="What are you into?"
          />
        </div>
      </Card>

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
