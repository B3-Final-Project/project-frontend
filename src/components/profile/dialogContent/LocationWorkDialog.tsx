"use client";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useCitySearch } from "@/hooks/react-query/geolocate";
import { Loader2, Check, MapPin } from "lucide-react";
import React from "react";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { GeolocateAPI } from "@/lib/routes/geolocate";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function LocationWorkDialog() {
  const [formData, setFormData] = React.useState({ city: "", work: "", languages: [] });
  const [cityInput, setCityInput] = React.useState("");
  const debouncedCity = useDebouncedValue(cityInput, 2000);
  const { data: citySuggestions, isLoading: isCityLoading } = useCitySearch(debouncedCity);

  React.useEffect(() => {
    if (citySuggestions?.length > 0) {
      setCityInput(citySuggestions[0].name);
      setFormData((prev) => ({ ...prev, city: citySuggestions[0].name }));
    }
  }, [citySuggestions]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        GeolocateAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          .then((data) => {
            if (data.city) {
              setCityInput(data.city);
              setFormData((prev) => ({ ...prev, city: data.city }));
            }
          })
          .catch(() => {
            // Handle error
          });
      },
      () => {
        // Handle permission denied
      },
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
      extractFormDataFromProfile={(profile) => ({
        city: profile.city ?? "",
        work: profile.work ?? "",
        languages: profile.languages ?? [],
      })}
      buildUpdatePayload={(formData) =>
        ({
          locationWork: formData,
        }) as Partial<UpdateProfileDto>
      }
      renderFormContent={(_, handleInputChange) => {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <div className="flex gap-2 items-center">
                <Autocomplete
                  value={cityInput}
                  onChange={(val) => {
                    setCityInput(val);
                    handleInputChange("city", val);
                  }}
                  onSelect={(val) => {
                    setCityInput(val);
                    handleInputChange("city", val);
                  }}
                  suggestions={citySuggestions?.map((c) => c.name) || []}
                  loading={isCityLoading}
                  placeholder="Enter your city"
                />
                <button
                  type="button"
                  className="ml-2 rounded-md border px-2 py-1 flex items-center gap-1 transition-colors border-input bg-background text-foreground"
                  onClick={handleGeolocate}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="sr-only">Use my location</span>
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
