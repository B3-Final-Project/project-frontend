import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";
import {
  UpdatePreferenceDto
} from "@/lib/routes/preferences/dto/update-preference.dto";
import {
  Preference
} from "@/lib/routes/preferences/interfaces/preference.interface";

export class PreferenceRouter {
  public static readonly updatePreference = createFetcher<Preference, UpdatePreferenceDto>(RESTServerRoute.REST_PREFERENCE, "PUT");
  public static readonly getPreference = createFetcher<Preference, undefined >(RESTServerRoute.REST_PREFERENCES, "GET");
  public static readonly getAllPreferences = createFetcher<Preference[], undefined>(RESTServerRoute.REST_PREFERENCES_ALL, "GET");
}
