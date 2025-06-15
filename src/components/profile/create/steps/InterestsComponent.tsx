'use client';

import { SharedInterestsForm, validateInterestsForm } from "@/components/profile/shared/SharedInterestsForm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROFILE_STEPS } from "../StepComponent";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";

export function InterestsComponent() {
  const { interestsInfo, setInterestsInfo, goToNextStep, goToPreviousStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateInterestsForm(interestsInfo);
    setErrors(validation.errors);

    if (validation.isValid && step) {
      goToNextStep(step, PROFILE_STEPS);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Share Your Interests</h3>
          <p className="text-sm text-gray-500">
            {interestsInfo.interests.length}/2 prompts
          </p>
        </div>

        <div className="mb-6">
          <SharedInterestsForm 
            formData={interestsInfo} 
            setFormData={setInterestsInfo}
            showTitle={false}
          />
        </div>

        {errors.general && (
          <p className="text-sm text-red-500 mb-4">{errors.general}</p>
        )}
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => step && goToPreviousStep(step, PROFILE_STEPS)}
        >
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
