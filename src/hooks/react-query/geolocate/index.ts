import { useQuery } from "@tanstack/react-query";
import { authenticatedAxios } from "@/lib/auth-axios";

export interface ReverseGeocodeResultDto {
  city: string | null;
}
export interface SearchCityResultDto {
  name: string;
  lon: number;
  lat: number;
}

class GeolocateRouter {
  static async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResultDto> {
    const res = await authenticatedAxios.get<ReverseGeocodeResultDto>(`/geolocate/reverse`, {
      params: { lat, lon }
    });
    return res.data;
  }

  static async citySearch(query: string): Promise<SearchCityResultDto[]> {
    const res = await authenticatedAxios.get<SearchCityResultDto[]>(`/geolocate/search`, {
      params: { query }
    });
    return res.data;
  }
}

export function useReverseGeocodeQuery(lat: number | null, lon: number | null, enabled: boolean = true) {
  return useQuery<ReverseGeocodeResultDto | null>({
    queryKey: ["reverse-geocode", lat, lon],
    queryFn: () => {
      if (lat == null || lon == null) return Promise.resolve(null);
      return GeolocateRouter.reverseGeocode(lat, lon);
    },
    enabled: enabled && lat != null && lon != null,
    refetchOnWindowFocus: false,
  });
}

export function useCitySearchQuery(query: string, enabled: boolean = true) {
  return useQuery<SearchCityResultDto[]>({
    queryKey: ["city-search", query],
    queryFn: () => {
      if (!query) return Promise.resolve([]);
      return GeolocateRouter.citySearch(query);
    },
    enabled: enabled && !!query,
    refetchOnWindowFocus: false,
  });
}

export { GeolocateRouter }; 