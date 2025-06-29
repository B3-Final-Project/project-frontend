import { GetProfileResponse } from "@/lib/routes/profiles/response/get-profile.response";
import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";
import { ReportDto, ReportReason } from "./dto/report.dto";

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export class AdminRouter {
  // Ban a user
  public static readonly banUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_BAN_USER,
    "POST"
  );

  // Unban a user
  public static readonly unbanUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_UNBAN_USER,
    "POST"
  );

  // Get user profile for admin view
  public static readonly getUserProfile = createFetcher<GetProfileResponse>(
    RESTServerRoute.REST_ADMIN_USER_PROFILE,
    "GET"
  );

  // Report a user
  public static readonly reportUser = createFetcher<AdminActionResponse, ReportDto>(
    RESTServerRoute.REST_ADMIN_REPORT_USER,
    "POST"
  );
}
