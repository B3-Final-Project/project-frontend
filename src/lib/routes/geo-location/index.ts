import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import {
  ReverseGeocodeDto
} from "@/lib/routes/geo-location/dto/reverse-geo.dto";
import {
  ReverseGeocodeResponse
} from "@/lib/routes/geo-location/response/reverse-geo.response";
import {
  SearchCityResponse
} from "@/lib/routes/geo-location/response/search-city.response";

export class GeolocateRouter {
  public static readonly reverseGeocode = createFetcher<ReverseGeocodeResponse, ReverseGeocodeDto>(RESTServerRoute.REST_GEOLOCATION_REVERSE, "PUT")

  public static readonly citySearch = createFetcher<SearchCityResponse[], undefined>(RESTServerRoute.REST_GEOLOCATION_SEARCH, "GET");
}
