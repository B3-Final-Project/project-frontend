import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GeolocateRouter } from "@/lib/routes/geo-location";
import {
  SearchCityResponse
} from "@/lib/routes/geo-location/response/search-city.response";
import {
  ReverseGeocodeResponse
} from "@/lib/routes/geo-location/response/reverse-geo.response";

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
  return useQuery<SearchCityResponse[]>({
    queryKey: ["geolocate", "city-search", debouncedQuery],
    queryFn: () => GeolocateRouter.citySearch(undefined, {city: debouncedQuery}),
    enabled: enabled && !!debouncedQuery && debouncedQuery.length > 1,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReverseGeocode(lat: number | null, lon: number | null, enabled = true) {
  return useQuery<ReverseGeocodeResponse>({
    queryKey: ["geolocate", "reverse", lat, lon],
    queryFn: () => {
      if (lat == null || lon == null) throw new Error("Missing coordinates");
      return GeolocateRouter.reverseGeocode({lat, lon});
    },
    enabled: enabled && lat != null && lon != null,
    staleTime: 5 * 60 * 1000,
  });
}
