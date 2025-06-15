"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { z } from "zod";

// Common constants and types
export const INTEREST_PROMPTS = [
  "A perfect day for me is...",
  "I'm passionate about...",
  "The way to my heart is...",
  "My ideal weekend includes...",
  "I get excited when...",
  "My biggest goal is...",
  "I love to talk about...",
  "My favorite hobby is...",
  "Something I'll never get tired of...",
  "The best advice I've received is...",
  "My hidden talent is...",
  "I'm always down for...",
  "Something that makes me laugh is...",
  "My biggest pet peeve is...",
  "I can't live without...",
];

export interface InterestItem {
  prompt: string;
  answer: string;
}

export interface InterestsInfo {
  interests: InterestItem[];
}

// Zod schemas for validation
export const InterestItemSchema = z.object({
  prompt: z.string().min(1, "Please select a prompt"),
  answer: z.string()
    .min(10, "Answer should be at least 10 characters")
    .max(300, "Answer should be less than 300 characters")
    .refine((val) => val.trim().length >= 10, "Answer should be at least 10 characters")
});

export const InterestsInfoSchema = z.object({
  interests: z.array(InterestItemSchema)
    .min(1, "Please add at least one interest")
    .max(2, "Maximum 2 prompts allowed")
    .refine(
      (interests) => {
        const prompts = interests.map(i => i.prompt);
        return new Set(prompts).size === prompts.length;
      },
      "Each prompt can only be selected once"
    )
});

// Props interface for the shared component
interface SharedInterestsFormProps {
  readonly formData: InterestsInfo;
  readonly setFormData: (data: InterestsInfo) => void;
  readonly showTitle?: boolean;
  readonly titleText?: string;
  readonly descriptionText?: string;
}

export function SharedInterestsForm({ 
  formData, 
  setFormData,
  showTitle = true,
  titleText = "Your Interests",
  descriptionText = "Choose prompts and share what makes you unique. This helps others get to know you better!"
}: SharedInterestsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldPath: string, value: any) => {
    try {
      if (fieldPath.includes('prompt')) {
        InterestItemSchema.shape.prompt.parse(value);
      } else if (fieldPath.includes('answer')) {
        InterestItemSchema.shape.answer.parse(value);
      }
      // Clear error if validation passes
      setErrors(prev => ({ ...prev, [fieldPath]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [fieldPath]: error.errors[0].message }));
      }
    }
  };

  const handlePromptChange = (index: number, prompt: string) => {
    const updatedInterests = [...formData.interests];
    updatedInterests[index] = { ...updatedInterests[index], prompt };
    setFormData({ interests: updatedInterests });
    
    validateField(`prompt_${index}`, prompt);
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updatedInterests = [...formData.interests];
    updatedInterests[index] = { ...updatedInterests[index], answer };
    setFormData({ interests: updatedInterests });
    
    validateField(`answer_${index}`, answer);
  };

  const addInterest = () => {
    if (formData.interests.length < 2) {
      setFormData({
        interests: [...formData.interests, { prompt: '', answer: '' }]
      });
    }
  };

  const removeInterest = (index: number) => {
    const updatedInterests = formData.interests.filter((interest: InterestItem, i: number) => i !== index);
    setFormData({ interests: updatedInterests });
    
    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`prompt_${index}`];
    delete newErrors[`answer_${index}`];
    setErrors(newErrors);
  };

  const getAvailablePrompts = (currentIndex: number) => {
    const usedPrompts = formData.interests
      .map((interest: InterestItem, index: number) => index !== currentIndex ? interest.prompt : null)
      .filter(Boolean);
    
    return INTEREST_PROMPTS.filter(prompt => !usedPrompts.includes(prompt));
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
      
      <p className="text-sm text-gray-600">
        {descriptionText}
      </p>

      {errors.general && (
        <p className="text-sm text-red-500">{errors.general}</p>
      )}

      <div className="space-y-4">
        {formData.interests.map((interest: InterestItem, index: number) => (
          <Card key={interest.prompt || `interest-${index}`} className="p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-medium">
                  Prompt {index + 1}
                </Label>
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
                  onValueChange={(value) => handlePromptChange(index, value)}
                >
                  <SelectTrigger className={errors[`prompt_${index}`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Choose a prompt..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePrompts(index).map((prompt) => (
                      <SelectItem key={prompt} value={prompt}>
                        {prompt}
                      </SelectItem>
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
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Share your thoughts..."
                  className={errors[`answer_${index}`] ? "min-h-[80px] border-red-500" : "min-h-[80px]"}
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
export function validateInterestsForm(interestsInfo: InterestsInfo): { isValid: boolean; errors: Record<string, string> } {
  try {
    InterestsInfoSchema.parse(interestsInfo);
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors: Record<string, string> = {};
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path.length === 1 && err.path[0] === 'interests') {
          errors.general = err.message;
        } else if (err.path.length === 3) {
          const [, index, field] = err.path;
          errors[`${field}_${index}`] = err.message;
        }
      });
    }
    return { isValid: false, errors };
  }
}
