"use client";

import { DrinkingEnum, PoliticsEnum, ReligionEnum, SmokingEnum, ZodiacEnum } from "@/lib/routes/profiles/enums";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { LifestyleInfo } from "@/hooks/useProfileCreation";
import { SelectorComponent } from "@/components/profile/SelectorComponent";
import { getEnumOptions } from "@/lib/utils/enum-utils";


// Define options outside component to prevent recreation on each render
const smokingOptions = getEnumOptions(SmokingEnum)
const drinkingOptions = getEnumOptions(DrinkingEnum)
const religionOptions = getEnumOptions(ReligionEnum)
const politicsOptions = getEnumOptions(PoliticsEnum)
const zodiacOptions = getEnumOptions(ZodiacEnum)

export function LifestyleDialog() {
  return (
    <GenericProfileDialog<LifestyleInfo>
      title="Lifestyle Information"
      initialFormData={{
        smoking: undefined,
        drinking: undefined,
        religion: undefined,
        politics: undefined,
        zodiac: undefined
      }}
      extractFormDataFromProfile={(profile) => ({
        smoking: profile.smoking,
        drinking: profile.drinking,
        religion: profile.religion,
        politics: profile.politics,
        zodiac: profile.zodiac
      })}
      buildUpdatePayload={(formData) => ({
        lifestyleInfo: formData
      })}
      renderFormContent={(formData, handleInputChange) => (
        <>
          <SelectorComponent
            value={formData.smoking}
            fieldName="smoking"
            options={smokingOptions}
            label="Smoking"
            onChange={handleInputChange}
            placeholder="Select smoking preference"
          />

          <SelectorComponent
            value={formData.drinking}
            fieldName="drinking"
            options={drinkingOptions}
            label="Drinking"
            onChange={handleInputChange}
            placeholder="Select drinking preference"
          />

           <SelectorComponent
            value={formData.religion}
            fieldName="religion"
            options={religionOptions}
            label="Religion"
            onChange={handleInputChange}
            placeholder="Select religion"
          />

         <SelectorComponent
            value={formData.politics}
            fieldName="politics"
            options={politicsOptions}
            label="Politics"
            onChange={handleInputChange}
            placeholder="Select political view"
          />

         <SelectorComponent
            value={formData.zodiac}
            fieldName="zodiac"
            options={zodiacOptions}
            label="Zodiac Sign"
            onChange={handleInputChange}
            placeholder="Select zodiac sign"
          />
        </>
      )}
    />
  );
}
