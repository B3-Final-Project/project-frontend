'use client';
import { Button } from "@/components/ui/button";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import { PROFILE_STEPS } from "./StepComponent";

export function StartComponent() {
  const { goToStep } = useProfileCreation();

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">Create Your Dating Profile</h1>
      <p className="text-lg text-gray-600">
        Welcome to Holomatch! We&#39;ll guide you through creating a profile that shows your best self.
      </p>

      <div className="flex flex-col space-y-4 max-w-md mx-auto">
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">What you&#39;ll need:</h3>
          <ul className="list-disc text-left pl-5 space-y-1">
            <li>Personal information like name and gender</li>
            <li>Your location and occupation</li>
            <li>Preferences for potential matches</li>
            <li>Lifestyle details</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          This should take about 5 minutes to complete. You can edit your responses anytime.
        </p>
      </div>

      <Button
        size="lg"
        className="mt-8"
        onClick={() => goToStep(PROFILE_STEPS[1])}
      >
        Let&#39;s Get Started
      </Button>
    </div>
  );
}
