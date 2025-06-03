import { createFetcher } from "@/lib/utils";
import { AuthSettingsDto } from "@/lib/routes/settings/dto/auth-settings.dto";
import { RESTServerRoute } from "@/lib/routes/server";

export class SettingsRouter {
  public static getAuthSettings = createFetcher<AuthSettingsDto, undefined>(RESTServerRoute.REST_AUTH_SETTINGS, "GET")
}
