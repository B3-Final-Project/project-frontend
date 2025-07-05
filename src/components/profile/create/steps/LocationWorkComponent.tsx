"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {PROFILE_STEPS} from "../StepComponent";
import {Card} from "@/components/ui/card";
import React, {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import {useProfileCreation} from "@/providers/ProfileCreationProvider";
import { useReverseGeocodeQuery, useCitySearchQuery, SearchCityResultDto, GeolocateRouter } from '@/hooks/react-query/geolocate';

// DTOs matching backend
interface ReverseGeocodeResultDto {
    city: string | null;
}

export function LocationWorkComponent() {
    const {locationWork, setLocationWork, goToNextStep, goToPreviousStep} =
    useProfileCreation();
    const {step} = useParams<{ step: string }>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cityQuery, setCityQuery] = useState(locationWork.city || '');
    const [latLon, setLatLon] = useState<[number, number] | null>(locationWork.coordinates ? [locationWork.coordinates[1], locationWork.coordinates[0]] : null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Use react-query hooks
    const { data: suggestions = [], isLoading: loadingSuggestions, error: suggestionsError } = useCitySearchQuery(cityQuery, !!cityQuery);
    const { data: reverseGeocodeData, refetch: refetchReverseGeocode } = useReverseGeocodeQuery(latLon ? latLon[0] : null, latLon ? latLon[1] : null, false);

    const handleChange = (field: string, value: string) => {
        setLocationWork((prev: any)) => ({...prev, [field]: value}));
        if (field === 'city') setCityQuery(value;
        if (errors[field]) {
            setErrors(((prev: any)) => ({...prev, [field]: ""}));
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const languagesStr = e.target.value;
        const languagesList = languagesStr
            .split(",")
            .map(((lang: string)) => lang.trim())
            .filter(((lang: string)) => lang !== "");

        setLocationWork({ ...locationWork, languages: languagesList});

        if (errors.languages) {
            setErrors(((prev: any)) => ({...prev, languages: ""}));
        }
    };

    const handleDetectLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const result = await GeolocateRouter.reverseGeocode(latitude, longitude);
                    if (result && result.city) {
                        setLocationWork((prev: any) => ({
                            ...prev,
                            coordinates: [longitude, latitude],
                            city: result.city ?? prev.city,
                        }));
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

    useEffect(() => {
        setCityQuery(locationWork.city || "");
    }, [locationWork.city]);

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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-4">
                <h3 className="text-lg font-medium mb-4">Location & Work</h3>

                <div className="space-y-4">
                    {/* City field */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            placeholder="Where do you live?"
                            value={locationWork.city || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange("city", e.target.value);
                                setShowSuggestions(true);
                            }}
                            className={errors.city ? "border-red-500" : ""}
                            autoComplete="off"
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        />
                        <div className="flex items-center gap-2 mt-1">
                            <Button type="button" variant="secondary" onClick={handleDetectLocation}>
                                Use my location
                            </Button>
                            {locationWork.coordinates && (
                                <span className="text-xs text-green-600">
                                    ✓ Detected: {locationWork.coordinates.join(', ')}
                                </span>
                            )}
                        </div>
                        {loadingSuggestions && showSuggestions && (
                            <div className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 p-2 text-sm text-gray-500">Loading...</div>
                        )}
                        {suggestionsError && showSuggestions && (
                            <div className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 p-2 text-sm text-red-500">City search failed. Please try again.</div>
                        )}
                        {suggestions.length > 0 && showSuggestions && !loadingSuggestions && !suggestionsError && (
                            <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 max-h-48 overflow-auto">
                                {suggestions.map((s: SearchCityResultDto, idx: number) => (
                                    <li
                                        key={idx}
                                        className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                        onMouseDown={() => {
                                            setLocationWork((prev: any) => ({
                                                ...prev,
                                                city: s.name,
                                                coordinates: [s.lon, s.lat],
                                            }));
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.city && (
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
                        <p className="text-xs text-gray-500">
              This helps us find people near you
            </p>
                    </div>

                    {/* Work field */}
                    <div className="space-y-2">
                        <Label htmlFor="work">Occupation</Label>
                        <Input
                            id="work"
                            placeholder="What do you do?"
                            value={locationWork.work ?? ""}
                            onChange={(e: { target: { value: string; }; }) => handleChange("work", e.target.value)}
                            className={errors.work ? "border-red-500" : ""}
                        />
                        {errors.work && (
              <p className="text-sm text-red-500">{errors.work}</p>
            )}
                    </div>

                    {/* Language field */}
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

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToPreviousStep(step as string, PROFILE_STEPS)}
                >
                    Back
                </Button>
                <Button type="submit">
                    Next
                </Button>
            </div>
        </form>
    );
}
