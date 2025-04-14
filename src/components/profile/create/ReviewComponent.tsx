'use client';
import { Button } from "@/components/ui/button";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import { PROFILE_STEPS } from "./StepComponent";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ReviewComponent() {
  const { personalInfo, preferences, locationWork, lifestyle, goToPreviousStep, saveProfile, goToStep } = useProfileCreation();
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
      toast({
        title: "Profile created!",
        description: "Your dating profile has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your profile. Please try again.",
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

  // Capitalize the first letter of a string
  const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
              <p>{capitalize(personalInfo.gender || '')}</p>
              <p className="text-gray-500">Orientation:</p>
              <p>{capitalize(personalInfo.orientation || '')}</p>
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
              <p>{preferences.min_age} - {preferences.max_age} years</p>
              <p className="text-gray-500">Maximum Distance:</p>
              <p>{preferences.max_distance} km</p>
              <p className="text-gray-500">Looking For:</p>
              <p>{capitalize(preferences.relationship_type?.replace('-', ' ') || '')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lifestyle</h3>
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
              <p>{capitalize(lifestyle.smoking || '')}</p>
              <p className="text-gray-500">Drinking:</p>
              <p>{capitalize(lifestyle.drinking || '')}</p>
              {lifestyle.religion && (
                <>
                  <p className="text-gray-500">Religion:</p>
                  <p>{capitalize(lifestyle.religion)}</p>
                </>
              )}
              {lifestyle.politics && (
                <>
                  <p className="text-gray-500">Political Views:</p>
                  <p>{capitalize(lifestyle.politics)}</p>
                </>
              )}
              {lifestyle.zodiac && (
                <>
                  <p className="text-gray-500">Zodiac Sign:</p>
                  <p>{capitalize(lifestyle.zodiac.replace('-', ' '))}</p>
                </>
              )}
            </div>
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
