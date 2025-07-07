"use client";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { useCitySearch } from "@/hooks/react-query/geolocate";
import React from "react";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { MapPin, Loader2 } from "lucide-react";
import { GeolocateRouter } from "@/lib/routes/geo-location";

export function LocationWorkDialog() {
  const [cityInput, setCityInput] = React.useState("");
  const isInitialized = React.useRef(false);
  const debouncedCity = useDebouncedValue(cityInput, 2000);
  const { data: citySuggestions, isLoading: isCityLoading } = useCitySearch(debouncedCity);
  const [geoLoading, setGeoLoading] = React.useState(false);

  const handleGeolocate = (handleInputChange: (field: string, value: string) => void) => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        GeolocateRouter.reverseGeocode({lat: pos.coords.latitude, lon: pos.coords.longitude})
          .then((data) => {
            if (data.city) {
              setCityInput(data.city);
              handleInputChange("city", data.city ?? "");
            }
          })
          .finally(() => setGeoLoading(false));
      },
      () => { setGeoLoading(false); }
    );
  };

  return (
    <GenericProfileDialog<LocationWorkInfo>
      title="Update Location & Work"
      initialFormData={{ city: "", work: "", languages: [] }}
      extractFormDataFromProfile={(profile) => ({
        city: profile.city ?? "",
        work: profile.work ?? "",
        languages: profile.languages ?? [],
      })}
      buildUpdatePayload={(formData) => {
        return ({ locationWork: formData }) as Partial<UpdateProfileDto>;
      }}
      renderFormContent={(formData, handleInputChange) => {
        // Initialize cityInput with formData.city if it exists and we haven't initialized yet
        if (formData.city && !isInitialized.current) {
          isInitialized.current = true;
          // Use setTimeout to defer the state update to avoid React error
          setTimeout(() => {
            setCityInput(formData.city);
          }, 0);
        }

        const handleCityChange = (val: string) => {
          setCityInput(val);
          handleInputChange("city", val);
        };

        const handleCitySelect = (val: string) => {
          setCityInput(val);
          handleInputChange("city", val);
        };

        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <div className="flex gap-2 items-center">
                <Autocomplete
                  value={cityInput}
                  onChange={handleCityChange}
                  onSelect={handleCitySelect}
                  suggestions={citySuggestions?.map((c) => c.name) || []}
                  loading={isCityLoading}
                  placeholder="Enter your city"
                />
                <button
                  type="button"
                  className="ml-2 rounded-md border px-2 py-1 flex items-center gap-1 transition-colors border-input bg-background text-foreground"
                  onClick={() => handleGeolocate(handleInputChange)}
                  disabled={geoLoading}
                >
                  <span className="sr-only">Use my location</span>
                  {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                </button>
              </div>
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
              <Label>Preferred Language</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.languages}
                  onChange={(e) =>
                    handleInputChange("languages", e.target.value.split(",")[0])
                  }
                  placeholder="Add a language"
                />
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
