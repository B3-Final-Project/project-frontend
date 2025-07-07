"use client";

import { GenericProfileDialog } from "@/components/profile/dialogContent/GenericProfileDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationWorkInfo } from "@/hooks/useProfileCreation";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { useCitySearch, useReverseGeocode } from "@/hooks/react-query/geolocate";
import { Loader2, Check, MapPin } from "lucide-react";
import React from "react";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { GeolocateAPI } from "@/lib/routes/geolocate";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function LocationWorkDialog() {
  const [formData, setFormData] = React.useState({ city: "", work: "", languages: [] });
  const [cityInput, setCityInput] = React.useState("");
  const debouncedCity = useDebouncedValue(cityInput, 2000);
  const { data: citySuggestions, isLoading: isCityLoading } = useCitySearch(debouncedCity);
  const [coords, setCoords] = React.useState<{ lat: number; lon: number } | null>(null);
  const { data: reverseResult, isLoading: isReverseLoading } = useReverseGeocode(coords?.lat ?? null, coords?.lon ?? null, !!coords);
  const [geoState, setGeoState] = React.useState<'idle' | 'loading' | 'success' | 'error'>("idle");
  const [geoMsg, setGeoMsg] = React.useState("");

  React.useEffect(() => {
    if (reverseResult?.city) {
      setCityInput(reverseResult.city);
      setFormData((prev) => ({ ...prev, city: reverseResult.city }));
    }
  }, [reverseResult?.city]);

  const handleGeolocate = () => {
    setGeoState("loading");
    setGeoMsg("");
    if (!navigator.geolocation) {
      setGeoState("error");
      setGeoMsg("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        GeolocateAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          .then((data) => {
            if (data.city) {
              setCityInput(data.city);
              setGeoState("success");
              setGeoMsg("Location found!");
            } else {
              setGeoState("error");
              setGeoMsg("Could not find city");
            }
          })
          .catch(() => {
            setGeoState("error");
            setGeoMsg("Error getting city");
          });
      },
      () => {
        setGeoState("error");
        setGeoMsg("Permission denied");
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
                  disabled={geoState === "loading"}
                />
                <button
                  type="button"
                  className={`ml-2 rounded-md border px-2 py-1 flex items-center gap-1 transition-colors ${geoState === "success" ? "border-green-500 bg-green-50 text-green-700" : geoState === "error" ? "border-red-500 bg-red-50 text-red-700" : "border-input bg-background text-foreground"}`}
                  onClick={handleGeolocate}
                  disabled={geoState === "loading"}
                  title={geoState === "loading" ? "Getting your location..." : geoState === "success" ? geoMsg : geoState === "error" ? geoMsg : "Use my location"}
                >
                  {geoState === "loading" ? <Loader2 className="animate-spin h-4 w-4" /> : geoState === "success" ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  <span className="sr-only">Use my location</span>
                </button>
              </div>
              {geoState !== "idle" && geoMsg && (
                <p className={`text-xs ${geoState === "error" ? "text-red-500" : geoState === "success" ? "text-green-500" : "text-gray-500"}`}>{geoMsg}</p>
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
