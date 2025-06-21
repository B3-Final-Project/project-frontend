"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTEREST_PROMPTS } from "@/components/profile/shared/interest-prompts";
import { InterestInfo } from "@/hooks/useProfileCreation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { z } from "zod";

// Zod schemas for validation
export const InterestItemSchema = z.object({
  prompt: z.string().min(1, "Please select a prompt"),
  answer: z.string()
    .nonempty("Please provide an answer")
    .max(300, "Answer should be less than 300 characters"),
});

export const InterestsInfoSchema = z.object({
  interests: z.array(InterestItemSchema)
    .min(1, "Please add at least one interest")
    .max(2, "Maximum 2 prompts allowed")
    .refine(
      (interests) => new Set(interests.map(i => i.prompt)).size === interests.length,
      "Each prompt can only be selected once"
    ),
});

// Props interface for the shared component
interface SharedInterestsFormProps {
  readonly formData: InterestInfo;
  readonly setFormData: (data: InterestInfo) => void;
  readonly showTitle?: boolean;
  readonly titleText?: string;
  readonly descriptionText?: string;
}

export function SharedInterestsForm({
                                      formData,
                                      setFormData,
                                      showTitle = true,
                                      titleText = "Your Interests",
                                      descriptionText = "Choose prompts and share what makes you unique. This helps others get to know you better!",
                                    }: SharedInterestsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: 'prompt' | 'answer', index: number, value: string) => {
    try {
      if (field === 'prompt') {
        InterestItemSchema.shape.prompt.parse(value);
      } else {
        InterestItemSchema.shape.answer.parse(value);
      }
      setErrors(prev => ({ ...prev, [`${field}_${index}`]: '' }));
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [`${field}_${index}`]: e.errors[0].message }));
      }
    }
  };

  const handlePromptChange = (index: number, prompt: string) => {
    const updated = [...formData.interests];
    updated[index] = { ...updated[index], prompt };
    setFormData({ interests: updated });
    validateField('prompt', index, prompt);
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updated = [...formData.interests];
    updated[index] = { ...updated[index], answer };
    setFormData({ interests: updated });
    validateField('answer', index, answer);
  };

  const addInterest = () => {
    if (formData.interests.length < 2) {
      setFormData({ interests: [...formData.interests, { prompt: '', answer: '' }] });
    }
  };

  const removeInterest = (index: number) => {
    const updated = formData.interests.filter((_, i) => i !== index);
    setFormData({ interests: updated });
    // Re-validate all to shift errors correctly
    try {
      InterestsInfoSchema.parse({ interests: updated });
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrs: Record<string, string> = {};
        e.errors.forEach(err => {
          if (err.path.length === 3) {
            const [, idx, field] = err.path;
            newErrs[`${field}_${idx}`] = err.message;
          } else {
            newErrs.general = err.message;
          }
        });
        setErrors(newErrs);
      }
    }
  };

  const getAvailablePrompts = (currentIndex: number) => {
    const used = formData.interests
      .map((item, i) => (i !== currentIndex ? item.prompt : null))
      .filter(Boolean) as string[];
    return INTEREST_PROMPTS.filter(p => !used.includes(p));
  };

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">{titleText}</Label>
          <p className="text-sm text-gray-500">
            {formData.interests.length}/2 prompts
          </p>
        </div>
      )}

      <p className="text-sm text-gray-600">{descriptionText}</p>
      {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}

      <div className="space-y-4">
        {formData.interests.map((interest, index) => (
          <Card key={`interest-${index}`} className="p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-medium">Prompt {index + 1}</Label>
                {formData.interests.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInterest(index)}
                    className="text-red-500 hover:text-red-700 h-6 px-2"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Select
                  value={interest.prompt}
                  onValueChange={value => handlePromptChange(index, value)}
                >
                  <SelectTrigger className={`${errors[`prompt_${index}`] ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Choose a prompt..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePrompts(index).map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`prompt_${index}`] && (
                  <p className="text-sm text-red-500">{errors[`prompt_${index}`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  value={interest.answer}
                  onChange={e => handleAnswerChange(index, e.target.value)}
                  placeholder="Share your thoughts..."
                  className={`${errors[`answer_${index}`] ? 'min-h-[80px] border-red-500' : 'min-h-[80px]'}`}
                  maxLength={300}
                />
                <div className="flex justify-between items-center">
                  <div>
                    {errors[`answer_${index}`] && (
                      <p className="text-sm text-red-500">{errors[`answer_${index}`]}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {interest.answer.length}/300
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {formData.interests.length < 2 && (
          <Button
            type="button"
            variant="outline"
            onClick={addInterest}
            className="w-full border-dashed border-2 border-gray-300 py-6"
          >
            + Add Another Prompt
          </Button>
        )}
      </div>
    </div>
  );
}

// Validation function that can be used by both components
export function validateInterestsForm(interestsInfo: InterestInfo): { isValid: boolean; errors: Record<string, string> } {
  try {
    InterestsInfoSchema.parse(interestsInfo);
    return { isValid: true, errors: {} };
  } catch (e) {
    const errors: Record<string, string> = {};
    if (e instanceof z.ZodError) {
      e.errors.forEach(err => {
        if (err.path.length === 3) {
          const [, index, field] = err.path;
          errors[`${field}_${index}`] = err.message;
        } else {
          errors.general = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
}
