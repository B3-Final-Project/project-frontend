"use client";

import { InterestsInfo, InterestsInfoSchema, SharedInterestsForm } from "@/components/profile/shared/SharedInterestsForm";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";

export function InterestsDialog() {
  return (
    <GenericProfileDialog<InterestsInfo>
      title="Edit Interests & Prompts"
      initialFormData={{
        interests: [{ prompt: '', answer: '' }]
      }}
      extractFormDataFromProfile={(profile) => ({
        // Initialize with empty interests since backend Interest structure is different from our InterestItem
        interests: [{ prompt: '', answer: '' }]
      })}
      buildUpdatePayload={(formData) => {
        // Validate before submitting
        try {
          InterestsInfoSchema.parse(formData);
          return { interestsInfo: formData };
        } catch (error) {
          console.error('Validation failed:', error);
          throw new Error('Please fix validation errors before submitting');
        }
      }}
      renderFormContent={(formData, handleInputChange, setFormData) => (
        <SharedInterestsForm formData={formData} setFormData={setFormData} />
      )}
    />
  );
}
