import { ReportResponseDto, ReportsListResponseDto } from "./dto/reports.dto";
import { createFetcher, createPaginatedFetcher } from "@/lib/utils";

import { RESTServerRoute } from "@/lib/routes/server";
import { ReportDto } from "./dto/report.dto";

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export class AdminRouter {
  // Ban a user
  public static readonly banUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_BANS,
    "POST",
  );

  // Unban a user
  public static readonly unbanUser = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_ADMIN_BANS,
    "DELETE",
  );

  // Report a user
  public static readonly reportUser = createFetcher<
    AdminActionResponse,
    ReportDto
  >(RESTServerRoute.REST_USER_REPORTS, "POST");

  // Get all reports with pagination and filtering
  public static readonly getReports = createPaginatedFetcher<ReportsListResponseDto>(
    RESTServerRoute.REST_USER_REPORTS,
    "GET",
  );

  // Get a specific report by ID
  public static readonly getReport = createFetcher<ReportResponseDto>(
    RESTServerRoute.REST_USER_REPORT,
    "GET",
  );

  // Delete a report by ID
  public static readonly deleteReport = createFetcher<AdminActionResponse>(
    RESTServerRoute.REST_USER_REPORT,
    "DELETE",
  );
}
