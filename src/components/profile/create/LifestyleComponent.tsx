// components/LifestyleComponent.tsx
'use client';
import { Button } from "@/components/ui/button";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { PROFILE_STEPS } from "./StepComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "next/navigation";
import { SelectorComponent } from "@/components/SelectorComponent";

export function LifestyleComponent() {
  const { lifestyleInfo, setLifestyleInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setLifestyleInfo((prev => ({ ...prev, [field]: value })));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!lifestyleInfo.smoking) {
      newErrors.smoking = 'Please select an option';
    }
    if (!lifestyleInfo.drinking) {
      newErrors.drinking = 'Please select an option';
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

  const smokingOptions = ['Never', 'Occasionally', 'Regularly', 'Trying to quit'];
  const drinkingOptions = ['Never', 'Socially', 'Regularly'];
  const religionOptions = [
    'Atheist', 'Agnostic', 'Buddhist', 'Christian', 'Hindu', 'Jewish', 'Muslim',
    'Spiritual but not religious', 'Other', 'Prefer not to say'
  ];
  const politicsOptions = [
    'Liberal', 'Moderate', 'Conservative', 'Not political', 'Other', 'Prefer not to say'
  ];
  const zodiacOptions = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', "Don't believe in zodiac"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">lifestyleInfo & Values</h3>
        <div className="grid grid-cols-1 gap-6">
          <SelectorComponent
            value={lifestyleInfo.smoking}
            onChange={handleChange}
            options={smokingOptions}
            label="Smoking"
            fieldName="smoking"
            errors={errors.smoking}
            placeholder="Do you smoke?"
          />
          <SelectorComponent
            value={lifestyleInfo.drinking}
            onChange={handleChange}
            options={drinkingOptions}
            label="Drinking"
            fieldName="drinking"
            errors={errors.drinking}
            placeholder="Do you drink alcohol?"
          />
          <SelectorComponent
            value={lifestyleInfo.religion}
            onChange={handleChange}
            options={religionOptions}
            label="Religion"
            fieldName="religion"
            errors={errors.religion}
            placeholder="Religious beliefs (optional)"
          />
          <SelectorComponent
            value={lifestyleInfo.politics}
            onChange={handleChange}
            options={politicsOptions}
            label="Political Views"
            fieldName="politics"
            errors={errors.politics}
            placeholder="Political views (optional)"
          />
          <SelectorComponent
            value={lifestyleInfo.zodiac}
            onChange={handleChange}
            options={zodiacOptions}
            label="Zodiac Sign"
            fieldName="zodiac"
            errors={errors.zodiac}
            placeholder="Zodiac sign (optional)"
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
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}
