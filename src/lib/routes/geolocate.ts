import { authenticatedAxios } from "@/lib/auth-axios";

export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
}

export interface ReverseGeocodeResult {
  city: string | null;
}

export const GeolocateAPI = {
  async searchCity(query: string): Promise<CitySuggestion[]> {
    const res = await authenticatedAxios.get("/geolocate/search", {
      params: { query },
    });
    return res.data;
  },

  async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult> {
    const res = await authenticatedAxios.get("/geolocate/reverse", {
      params: { lat, lon },
    });
    return res.data;
  },
}; 