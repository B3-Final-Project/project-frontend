import { useMutation } from "@tanstack/react-query";
import { GeolocateRouter } from "@/lib/routes/geo-location";

export function useReverseGeocodeMutation() {
  return useMutation({
    mutationKey: ["reverse-geocode"],
    mutationFn: ({lat, lon}: {lat: number, lon: number}) => GeolocateRouter.reverseGeocode({lat, lon}),
  });
}

export function useCitySearchMutation() {
  return useMutation({
    mutationKey: ["city-search"],
    mutationFn: (city: string) => GeolocateRouter.citySearch(undefined, {city})
  });
}
