// components/LifestyleComponent.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DrinkingEnum } from "@/lib/routes/profiles/enums/drinking.enum";
import { PoliticsEnum } from "@/lib/routes/profiles/enums/politics.enum";
import { PROFILE_STEPS } from "./StepComponent";
import { ReligionEnum } from "@/lib/routes/profiles/enums/religion.enum";
import { SmokingEnum } from "@/lib/routes/profiles/enums/smoking.enum";
import { ZodiacEnum } from "@/lib/routes/profiles/enums/zodiac.enum";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";
import { SelectorComponent } from "@/components/profile/SelectorComponent";

export function LifestyleComponent() {
  const { lifestyleInfo, setLifestyleInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleChange = (field: string, value: string | number) => {
    setLifestyleInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep(step as string, PROFILE_STEPS);
  };

  // Extract only numeric values from enums (not string keys)
  const smokingOptions = Object.keys(SmokingEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const drinkingOptions = Object.keys(DrinkingEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const religionOptions = Object.keys(ReligionEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const politicsOptions = Object.keys(PoliticsEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  const zodiacOptions = Object.keys(ZodiacEnum)
    .filter(key => !isNaN(Number(key)))
    .map(key => Number(key));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectorComponent
              value={lifestyleInfo.smoking}
              fieldName="smoking"
              options={smokingOptions}
              label="Smoking"
              onChange={handleChange}
              placeholder="Your smoking habits"
            />

            <SelectorComponent
              value={lifestyleInfo.drinking}
              fieldName="drinking"
              options={drinkingOptions}
              label="Drinking"
              onChange={handleChange}
              placeholder="Your drinking habits"
            />
          </div>
        </Card>

        <Card className="p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Beliefs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectorComponent
              value={lifestyleInfo.religion}
              fieldName="religion"
              options={religionOptions}
              label="Religion"
              onChange={handleChange}
              placeholder="Your religious beliefs"
            />

            <SelectorComponent
              value={lifestyleInfo.politics}
              fieldName="politics"
              options={politicsOptions}
              label="Politics"
              onChange={handleChange}
              placeholder="Your political stance"
            />

            <SelectorComponent
              value={lifestyleInfo.zodiac}
              fieldName="zodiac"
              options={zodiacOptions}
              label="Zodiac Sign"
              onChange={handleChange}
              placeholder="Your zodiac sign"
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
