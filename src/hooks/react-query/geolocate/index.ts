import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GeolocateAPI, CitySuggestion, ReverseGeocodeResult } from "@/lib/routes/geolocate";

// Debounce utility
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function useCitySearch(query: string, enabled = true) {
  const debouncedQuery = useDebouncedValue(query, 300);
  return useQuery<CitySuggestion[]>({
    queryKey: ["geolocate", "city-search", debouncedQuery],
    queryFn: () => GeolocateAPI.searchCity(debouncedQuery),
    enabled: enabled && !!debouncedQuery && debouncedQuery.length > 1,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReverseGeocode(lat: number | null, lon: number | null, enabled = true) {
  return useQuery<ReverseGeocodeResult>({
    queryKey: ["geolocate", "reverse", lat, lon],
    queryFn: () => {
      if (lat == null || lon == null) throw new Error("Missing coordinates");
      return GeolocateAPI.reverseGeocode(lat, lon);
    },
    enabled: enabled && lat != null && lon != null,
    staleTime: 5 * 60 * 1000,
  });
} 