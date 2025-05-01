import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";
import {
  UpdateProfileDto
} from "@/lib/routes/profiles/dto/update-profile.dto";
import {
  Profile
} from "@/lib/routes/profiles/interfaces/profile.interface";
import {
  GetProfileResponse
} from "@/lib/routes/profiles/response/get-profile.response";

export class ProfileRouter {
  public static readonly updateProfile = createFetcher<Profile, UpdateProfileDto>(RESTServerRoute.REST_PROFILES, "PUT");
  public static readonly createProfile = createFetcher<Profile, UpdateProfileDto>(RESTServerRoute.REST_PROFILES, "POST");
  public static readonly getProfile = createFetcher<GetProfileResponse, undefined >(RESTServerRoute.REST_PROFILES, "GET");
  public static readonly getAllProfiles = createFetcher<Profile[], undefined>(RESTServerRoute.REST_PROFILES_ALL, "GET");
}
