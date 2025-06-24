'use client';

import {
  formatDrinkingEnum,
  formatGenderEnum,
  formatOrientationEnum,
  formatPoliticsEnum,
  formatRelationshipTypeEnum,
  formatReligionEnum,
  formatSmokingEnum,
  formatZodiacEnum
} from "@/lib/utils/enum-utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROFILE_STEPS } from "../StepComponent";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ReviewComponent() {
  const { personalInfo, preferenceInfo, locationWork, lifestyleInfo, interestInfo, goToPreviousStep, saveProfile, goToStep } = useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSection = (sectionIndex: number) => {
    goToStep(PROFILE_STEPS[sectionIndex]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveProfile();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: `There was a problem creating your profile. Please try again. ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format array of languages for display
  const formatLanguages = () => {
    if (!locationWork.languages || !locationWork.languages.length) return "None specified";
    return locationWork.languages.join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
        <p className="text-gray-500">Please review your information before submitting.</p>
      </div>

      <Card className="p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(1)}
              >
                Edit
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <p className="text-gray-500">Name:</p>
              <p>{personalInfo.name} {personalInfo.surname}</p>
              <p className="text-gray-500">Gender:</p>
              <p>{formatGenderEnum(personalInfo.gender ?? '')}</p>
              <p className="text-gray-500">Orientation:</p>
              <p>{formatOrientationEnum(personalInfo.orientation ?? '')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Location & Work</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(2)}
              >
                Edit
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <p className="text-gray-500">City:</p>
              <p>{locationWork.city}</p>
              <p className="text-gray-500">Occupation:</p>
              <p>{locationWork.work}</p>
              <p className="text-gray-500">Languages:</p>
              <p>{formatLanguages()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preferences</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(3)}
              >
                Edit
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <p className="text-gray-500">Age Range:</p>
              <p>{preferenceInfo.min_age} - {preferenceInfo.max_age} years</p>
              <p className="text-gray-500">Maximum Distance:</p>
              <p>{preferenceInfo.max_distance} km</p>
              <p className="text-gray-500">Looking For:</p>
              <p>{formatRelationshipTypeEnum(preferenceInfo.relationship_type ?? '')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lifestyle & Values</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(4)}
              >
                Edit
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <p className="text-gray-500">Smoking:</p>
              <p>{formatSmokingEnum(lifestyleInfo.smoking ?? '')}</p>
              <p className="text-gray-500">Drinking:</p>
              <p>{formatDrinkingEnum(lifestyleInfo.drinking ?? '')}</p>
              {typeof lifestyleInfo.religion === 'number' && (
                <>
                  <p className="text-gray-500">Religion:</p>
                  <p>{formatReligionEnum(lifestyleInfo.religion)}</p>
                </>
              )}
              {typeof lifestyleInfo.politics === 'number' && (
                <>
                  <p className="text-gray-500">Political Views:</p>
                  <p>{formatPoliticsEnum(lifestyleInfo.politics)}</p>
                </>
              )}
              {typeof lifestyleInfo.zodiac === 'number' && (
                <>
                  <p className="text-gray-500">Zodiac Sign:</p>
                  <p>{formatZodiacEnum(lifestyleInfo.zodiac)}</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Interests & Prompts</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditSection(5)}
              >
                Edit
              </Button>
            </div>
            <Separator />
            <div className="space-y-3 pt-2">
              {interestInfo.interests.length > 0 ? (
                interestInfo.interests.map((interest, index) => (
                  <div key={interest.prompt || `review-interest-${index}`} className="border-l-4 border-blue-500 pl-3">
                    <p className="text-sm font-medium text-gray-700">{interest.prompt}</p>
                    <p className="text-gray-600">{interest.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No interests added yet</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => step && goToPreviousStep(step, PROFILE_STEPS)}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Profile..." : "Create Profile"}
        </Button>
      </div>
    </div>
  );
}
