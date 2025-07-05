"use client";

import { InterestsComponent } from "@/components/profile/create/steps/InterestsComponent";
import { LifestyleComponent } from "@/components/profile/create/steps/LifestyleComponent";
import Link from "next/link";
import { LocationWorkComponent } from "@/components/profile/create/steps/LocationWorkComponent";
import { PersonalInfoComponent } from "@/components/profile/create/steps/PersonalInfoComponent";
import { PreferencesComponent } from "@/components/profile/create/steps/PreferencesComponent";
import { ReviewComponent } from "@/components/profile/create/steps/ReviewComponent";
import { StartComponent } from "@/components/profile/create/steps/StartComponent";
import { useParams } from "next/navigation";

export const PROFILE_STEPS = [
  "welcome",
  "personal-info",
  "location-work",
  "preferences",
  "lifestyle",
  "interests",
  "review",
];

export function StepComponent() {
  const params = useParams<{ step: string }>();

  const currentStep = params?.step || "welcome";

  const profileSteps = [
    {
      param: "welcome",
      description: "Start your profile creation",
      component: <StartComponent />,
    },
    {
      param: "personal-info",
      description: "Tell us about yourself",
      component: <PersonalInfoComponent />,
    },
    {
      param: "location-work",
      description: "Where are you based?",
      component: <LocationWorkComponent />,
    },
    {
      param: "preferences",
      description: "What are you looking for?",
      component: <PreferencesComponent />,
    },
    {
      param: "lifestyle",
      description: "Your lifestyle profiles",
      component: <LifestyleComponent />,
    },
    {
      param: "interests",
      description: "Share your interests",
      component: <InterestsComponent />,
    },
    {
      param: "review",
      description: "Review your profile",
      component: <ReviewComponent />,
    },
  ];

  const availableParams: string[] = profileSteps.map((step) => step.param);
  const stepIndex = availableParams.indexOf(currentStep);

  if (stepIndex === -1) {
    return (
      <div>
        Step not found.{" "}
        <Link
          href="/profile/create/welcome"
          className="text-blue-500 underline"
        >
          Go back to start
        </Link>
      </div>
    );
  }

  const step = profileSteps[stepIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="my-6 mx-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">{step.description}</h2>
          <p className="text-sm text-gray-500">
            Step {stepIndex + 1} of {profileSteps.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{
              width: `${((stepIndex + 1) / profileSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">{step.component}</div>
    </div>
  );
}
