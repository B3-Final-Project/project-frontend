"use client";

import { Button } from "@/components/ui/button";
import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { SearchCityResponse } from '@/lib/routes/geo-location/response/search-city.response';
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { useState } from "react";
import {
  useCitySearchMutation,
  useReverseGeocodeMutation
} from "@/hooks/react-query/geolocate";

export function LocationWorkDialog() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchCityResponse[]>([]);

  // Mutations
  const reverseGeocodeMutation = useReverseGeocodeMutation()
  const citySearchMutation = useCitySearchMutation();

  const handleDetectLocation = async (setFormData: (data: LocationWorkInfo) => void, currentData: LocationWorkInfo) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await reverseGeocodeMutation.mutateAsync({ lat: latitude, lon: longitude });
          if (result && result.city) {
            setFormData({
              ...currentData,
              coordinates: [longitude, latitude],
              city: result.city ?? currentData.city,
            });
          } else {
            alert("Could not determine city from your location.");
          }
        } catch {
          alert("Failed to fetch city from coordinates. Please try again.");
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied. Please allow access to use this feature.");
        } else {
          alert("Unable to retrieve your location.");
        }
      }
    );
  };

  return (
    <GenericProfileDialog<LocationWorkInfo>
      title="Update Location & Work"
      initialFormData={{
        city: "",
        work: "",
        languages: [],
      }}
      extractFormDataFromProfile={(profile, _user) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
        city: profile.city ?? "",
        work: profile.work ?? "",
        languages: profile.languages ?? [],
      })}
      buildUpdatePayload={(formData) =>
        ({
          locationWork: formData,
        }) as Partial<UpdateProfileDto>
      }
      renderFormContent={(formData, handleInputChange, setFormData) => {
        const handleCityChange = (value: string) => {
          handleInputChange("city", value);
          if (value.length > 2) {
            // Trigger city search
            citySearchMutation.mutate(value, {
              onSuccess: (data) => {
                setSuggestions(data || []);
              },
              onError: () => {
                setSuggestions([]);
              }
            });
          } else {
            setSuggestions([]);
          }
        };

        const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const languagesStr = e.target.value;
          const languagesList = languagesStr
            .split(",")
            .map((lang: string) => lang.trim())
            .filter((lang: string) => lang !== "");

          setFormData({ ...formData, languages: languagesList });
        };

        return (
          <>
            <div className="space-y-2 relative">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => {
                  handleCityChange(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Enter your city"
                autoComplete="off"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleDetectLocation(setFormData, formData)}
                  disabled={reverseGeocodeMutation.isPending}
                >
                  {reverseGeocodeMutation.isPending ? "Detecting..." : "Use my location"}
                </Button>
                {formData.coordinates && (
                  <span className="text-xs text-green-600">
                    ✓ Detected: {formData.coordinates.join(', ')}
                  </span>
                )}
              </div>
              {citySearchMutation.isPending && showSuggestions && (
                <div className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 p-2 text-sm text-gray-500">Loading...</div>
              )}
              {citySearchMutation.isError && showSuggestions && (
                <div className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 p-2 text-sm text-red-500">City search failed. Please try again.</div>
              )}
              {suggestions.length > 0 && showSuggestions && !citySearchMutation.isPending && !citySearchMutation.isError && (
                <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 max-h-48 overflow-auto">
                  {suggestions.map((s: SearchCityResponse, idx: number) => (
                    <li
                      key={idx}
                      className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => {
                        setFormData({
                          ...formData,
                          city: s.name,
                          coordinates: [s.lon, s.lat],
                        });
                        setShowSuggestions(false);
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                value={formData.work}
                onChange={(e) => handleInputChange("work", e.target.value)}
                placeholder="Enter your occupation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Preferred Language</Label>
              <Input
                id="languages"
                value={formData.languages?.join(", ") ?? ""}
                onChange={handleLanguageChange}
                placeholder="English, Spanish, French, etc."
              />
            </div>
          </>
        );
      }}
    />
  );
}
