import { createFetcher, createPaginatedFetcher } from "@/lib/utils";
import {
  GetProfileResponse
} from "@/lib/routes/profiles/response/get-profile.response";
import {
  Profile
} from "@/lib/routes/profiles/interfaces/profile.interface";
import { RESTServerRoute } from "@/lib/routes/server";
import {
  UpdateProfileDto
} from "@/lib/routes/profiles/dto/update-profile.dto";
import {
  UserManagementResponseDto
} from "@/lib/routes/admin/user-management-response.dto";

export class ProfileRouter {
  public static readonly updateProfile = createFetcher<Profile, UpdateProfileDto>(RESTServerRoute.REST_PROFILES, "PUT");
  public static readonly updatePartialProfile = createFetcher<Profile, Partial<UpdateProfileDto>>(RESTServerRoute.REST_PROFILES, "PATCH");
  public static readonly createProfile = createFetcher<Profile, UpdateProfileDto>(RESTServerRoute.REST_PROFILES, "POST");
  public static readonly getProfile = createFetcher<GetProfileResponse>(RESTServerRoute.REST_PROFILES, "GET");
  public static readonly getProfileById = createFetcher<GetProfileResponse>(RESTServerRoute.REST_PROFILE, "GET");
  public static readonly getAllProfiles = createPaginatedFetcher<UserManagementResponseDto>(RESTServerRoute.REST_PROFILES_ALL, "GET");
}
