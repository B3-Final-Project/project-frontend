"use client";

import {
  InterestsInfoSchema,
  SharedInterestsForm,
} from "@/components/profile/shared/SharedInterestsForm";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { InterestInfo } from "@/hooks/useProfileCreation";

export function InterestsDialog() {
  return (
    <GenericProfileDialog<InterestInfo>
      title="Edit Interests & Prompts"
      initialFormData={{
        interests: [{ prompt: "", answer: "" }],
      }}
      extractFormDataFromProfile={(profile) => {
        // Map backend interests to our InterestItem format
        const mappedInterests =
          profile.interests && profile.interests.length > 0
            ? profile.interests.map((interest) => ({
                prompt: interest.prompt ?? "",
                answer: interest.answer ?? "",
              }))
            : [];

        // Ensure we have at least one interest for the form
        return {
          interests:
            mappedInterests.length > 0
              ? mappedInterests
              : [{ prompt: "", answer: "" }],
        };
      }}
      buildUpdatePayload={(formData) => {
        // Validate before submitting
        try {
          InterestsInfoSchema.parse(formData);
          return { interestInfo: formData };
        } catch (error) {
          console.error("Validation failed:", error);
          throw new Error("Please fix validation errors before submitting");
        }
      }}
      renderFormContent={(formData, handleInputChange, setFormData) => (
        <SharedInterestsForm formData={formData} setFormData={setFormData} />
      )}
    />
  );
}
