'use client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PROFILE_STEPS } from "./StepComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";

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

    if (!preferenceInfo?.min_age || preferenceInfo?.min_age < 18) {
      newErrors.min_age = 'Minimum age must be at least 18';
    }

    if (!preferenceInfo?.max_age || preferenceInfo?.max_age < preferenceInfo.min_age!) {
      newErrors.max_age = 'Maximum age must be at least the minimum age';
    }

    if (!preferenceInfo.max_distance) {
      newErrors.max_distance = 'Maximum distance is required';
    }

    if (!preferenceInfo.relationship_type) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Your preferenceInfo</h3>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="min-age">Minimum Age: {preferenceInfo.min_age || 18}</Label>
                <Slider
                  id="min-age"
                  min={18}
                  max={99}
                  step={1}
                  value={[minAge]}
                  onValueChange={(value: number[]) => handleChange('min_age', value[0])}
                  className={errors.min_age ? 'border-red-500' : ''}
                />
                {errors.min_age && <p className="text-sm text-red-500">{errors.min_age}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-age">Maximum Age: {preferenceInfo.max_age || 99}</Label>
                <Slider
                  id="max-age"
                  min={18}
                  max={99}
                  step={1}
                  value={[maxAge]}
                  onValueChange={(value: number[]) => handleChange('max_age', value[0])}
                  className={errors.max_age ? 'border-red-500' : ''}
                />
                {errors.max_age && <p className="text-sm text-red-500">{errors.max_age}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-distance">Maximum Distance: {preferenceInfo.max_distance || 50} km</Label>
            <Slider
              id="max-distance"
              min={5}
              max={150}
              step={5}
              value={[preferenceInfo.max_distance || 50]}
              onValueChange={(value: number[]) => handleChange('max_distance', value[0])}
              className={errors.max_distance ? 'border-red-500' : ''}
            />
            {errors.max_distance && <p className="text-sm text-red-500">{errors.max_distance}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship-type">Looking For</Label>
            <Select
              value={preferenceInfo.relationship_type || ''}
              onValueChange={(value: string) => handleChange('relationship_type', value)}
            >
              <SelectTrigger id="relationship-type" className={errors.relationship_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="What type of relationship?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="long-term">Long-term Relationship</SelectItem>
                <SelectItem value="marriage">Marriage</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
                <SelectItem value="unsure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationship_type && <p className="text-sm text-red-500">{errors.relationship_type}</p>}
          </div>
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
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
