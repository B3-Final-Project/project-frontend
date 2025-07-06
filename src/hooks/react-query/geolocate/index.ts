import { GeolocateRouter } from "@/lib/routes/geo-location";
import { ReverseGeocodeResponse } from "@/lib/routes/geo-location/response/reverse-geo.response";
import { SearchCityResponse } from "@/lib/routes/geo-location/response/search-city.response";
import { useMutation } from "@tanstack/react-query";

export function useReverseGeocodeMutation() {
  return useMutation<ReverseGeocodeResponse, Error, {lat: number, lon: number}>({
    mutationKey: ["reverse-geocode"],
    mutationFn: ({lat, lon}: {lat: number, lon: number}) => GeolocateRouter.reverseGeocode({lat, lon}),
  });
}

export function useCitySearchMutation() {
  return useMutation<SearchCityResponse[], Error, string>({
    mutationKey: ["city-search"],
    mutationFn: (city: string) => GeolocateRouter.citySearch(undefined, {city})
  });
}
