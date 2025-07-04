import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { ReportReason } from "@/lib/routes/admin/dto/report.dto";

export interface ReportResponseDto {
  id: number;
  reported_profile_id: number;
  reporterUserId: string;
  reason: ReportReason;
  status: string;
  reportedProfile: Profile;
  message?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReportsListResponseDto {
  reports: ReportResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
