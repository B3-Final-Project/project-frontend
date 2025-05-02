"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { GenericProfileDialog } from "@/components/profile/GenericProfileDialog";
import { Label } from "@/components/ui/label";
import { PreferenceInfo } from "@/hooks/useProfileCreation";
import { RelationshipTypeEnum } from "@/lib/routes/profiles/enums";
import { SelectorComponent } from "@/components/profile/SelectorComponent";
import { Slider } from "@/components/ui/slider";
import { getEnumOptions } from "@/lib/utils/enum-utils";

// Define options outside component to prevent recreation on each render
const relationshipTypeOptions = getEnumOptions(RelationshipTypeEnum)

export function PreferencesDialog() {
  return (
    <GenericProfileDialog<PreferenceInfo>
      title="Matching Preferences"
      initialFormData={{
        min_age: 18,
        max_age: 99,
        max_distance: 50,
        relationship_type: undefined,
      }}
      extractFormDataFromProfile={(profile) => ({
        min_age: profile.min_age || 18,
        max_age: profile.max_age || 99,
        max_distance: profile.max_distance || 50,
        relationship_type: profile.relationship_type,
      })}
      buildUpdatePayload={(formData) => ({
        preferenceInfo: formData,
      })}
      renderFormContent={(formData, handleInputChange, setFormData) => (
        <>
          {/* Age Range */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Age Range</Label>
              <div className="flex justify-between text-sm">
                <span>Min: {formData.min_age} yrs</span>
                <span>Max: {formData.max_age} yrs</span>
              </div>

              {/* Min‐Age Slider */}
              <div className="space-y-1">
                <Label htmlFor="min-age" className="text-sm">Minimum Age</Label>
                <Slider
                  id="min-age"
                  className="h-2"
                  min={18}
                  max={formData.max_age - 1}
                  step={1}
                  value={[formData.min_age]}
                  onValueChange={([value]) =>
                    setFormData(prev => ({ ...prev, min_age: value }))
                  }
                >
                  <SliderPrimitive.Track className="relative bg-gray-200 flex-1">
                    <SliderPrimitive.Range className="absolute bg-blue-500 h-full" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border-2 border-blue-500" />
                </Slider>
              </div>

              {/* Max‐Age Slider */}
              <div className="space-y-1">
                <Label htmlFor="max-age" className="text-sm">Maximum Age</Label>
                <Slider
                  id="max-age"
                  className="h-2"
                  min={formData.min_age + 1}
                  max={99}
                  step={1}
                  value={[formData.max_age]}
                  onValueChange={([value]) =>
                    setFormData(prev => ({ ...prev, max_age: value }))
                  }
                >
                  <SliderPrimitive.Track className="relative bg-gray-200 flex-1">
                    <SliderPrimitive.Range className="absolute bg-blue-500 h-full" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border-2 border-blue-500" />
                </Slider>
              </div>
            </div>
          </div>

          {/* Maximum Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance">Maximum Distance: {formData.max_distance} km</Label>
            <div className="flex space-x-4 items-center">
              <span>1</span>
              <Slider
                id="distance"
                className="flex-1"
                min={1}
                max={150}
                step={1}
                value={[formData.max_distance]}
                onValueChange={([value]) =>
                  setFormData(prev => ({ ...prev, max_distance: value }))
                }
              >
                <SliderPrimitive.Track className="relative h-2 bg-gray-200">
                  <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border-2 border-blue-500" />
              </Slider>
              <span>150</span>
            </div>
          </div>

          {/* Relationship Type */}
          <SelectorComponent
            value={formData.relationship_type}
            fieldName="relationship_type"
            options={relationshipTypeOptions}
            label="Relationship Type"
            onChange={handleInputChange}
            placeholder="Select relationship type"
          />
        </>
      )}
    />
  );
}
