import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";
import { ReportDto } from "./dto/report.dto";

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export class AdminRouter {
  // Ban a user
  public static readonly banUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_BANS,
    "POST"
  );

  // Unban a user
  public static readonly unbanUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_BANS,
    "DELETE"
  );

  // Report a user
  public static readonly reportUser = createFetcher<AdminActionResponse, ReportDto>(
    RESTServerRoute.REST_USER_REPORTS,
    "POST"
  );
}
