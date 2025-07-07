"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_STEPS } from "../StepComponent";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useProfileCreation } from "@/providers/ProfileCreationProvider";
import { useCitySearch } from "@/hooks/react-query/geolocate";
import { Loader2, Check, MapPin } from "lucide-react";
import React from "react";
import { Autocomplete } from "@/components/ui/Autocomplete";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { GeolocateRouter } from "@/lib/routes/geo-location";

export function LocationWorkComponent() {
  const { locationWork, setLocationWork, goToNextStep, goToPreviousStep } =
    useProfileCreation();
  const { step } = useParams<{ step: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cityInput, setCityInput] = useState(locationWork.city || "");
  const debouncedCity = useDebouncedValue(cityInput, 2000);
  const { data: citySuggestions, isLoading: isCityLoading } = useCitySearch(debouncedCity);
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'success' | 'error'>("idle");
  const [geoMsg, setGeoMsg] = useState("");

  const handleChange = (field: string, value: string) => {
    setLocationWork((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languagesStr = e.target.value;
    const languagesList = languagesStr
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang !== "");

    setLocationWork({ ...locationWork, languages: languagesList });

    if (errors.languages) {
      setErrors((prev) => ({ ...prev, languages: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!locationWork.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!locationWork.work?.trim()) {
      newErrors.work = "Occupation is required";
    }

    if (!locationWork.languages || locationWork.languages.length === 0) {
      newErrors.languages = "At least one language is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      goToNextStep(step as string, PROFILE_STEPS);
    }
  };

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
        GeolocateRouter.reverseGeocode({lat: pos.coords.latitude, lon: pos.coords.longitude})
          .then((data) => {
            if (data.city) {
              setCityInput(data.city);
              handleChange("city", data.city);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Location & Work</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <div className="flex gap-2 items-center">
              <Autocomplete
                value={cityInput}
                onChange={(val) => {
                  setCityInput(val);
                  handleChange("city", val);
                }}
                onSelect={(val) => {
                  setCityInput(val);
                  handleChange("city", val);
                }}
                suggestions={citySuggestions?.map((c) => c.name) || []}
                loading={isCityLoading}
                placeholder="Where do you live?"
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
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
            <p className="text-xs text-gray-500">
              This helps us find people near you
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="work">Occupation</Label>
            <Input
              id="work"
              placeholder="What do you do?"
              value={locationWork.work ?? ""}
              onChange={(e) => handleChange("work", e.target.value)}
              className={errors.work ? "border-red-500" : ""}
            />
            {errors.work && (
              <p className="text-sm text-red-500">{errors.work}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="languages">Preferred Language</Label>
            <Input
              id="languages"
              placeholder="English, Spanish, French, etc."
              value={locationWork.languages?.join(", ") ?? ""}
              onChange={handleLanguageChange}
              className={errors.languages ? "border-red-500" : ""}
            />
            {errors.languages && (
              <p className="text-sm text-red-500">{errors.languages}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={() => goToPreviousStep(step as string, PROFILE_STEPS)}
        >
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
