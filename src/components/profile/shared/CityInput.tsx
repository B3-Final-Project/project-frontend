"use client";

import { useCitySearchMutation } from "@/hooks/react-query/geolocate";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchCityResponse } from '@/lib/routes/geo-location/response/search-city.response';

interface CityInputProps {
  value: string;
  onChange(value: string): void;
  error?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function CityInput({
  value,
  onChange,
  error,
  placeholder = "Where do you live?",
  label = "City",
  disabled = false
}: CityInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchCityResponse[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mutations
  const citySearchMutation = useCitySearchMutation();

  // Handle city search results
  useEffect(() => {
    if (citySearchMutation.data) {
      setSuggestions(citySearchMutation.data);
    }
  }, [citySearchMutation.data]);

  const handleCityChange = (newValue: string) => {
    onChange(newValue);
    value = newValue; // Update local value for immediate feedback

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newValue.length > 2) {
      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        citySearchMutation.mutate(newValue);
      }, 300); // 300ms delay
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: SearchCityResponse) => {
    const suggestionName = suggestion.name.split(',')[0].trim(); // Get the first part of the suggestion
    onChange(suggestionName);
    value = suggestionName
    setShowSuggestions(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="city">{label}</Label>
      <Input
        id="city"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleCityChange(e.target.value);
          setShowSuggestions(true);
        }}
        className={error ? "border-red-500" : ""}
        autoComplete="off"
        disabled={disabled}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
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
              onClick={() => handleSuggestionClick(s)}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-xs text-gray-500">
        This helps us find people near you
      </p>
    </div>
  );
}
