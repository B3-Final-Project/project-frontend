import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";

export interface UserManagementResponseDto{
  data: {
    profiles: UserManagementDto[];
    totalCount: number;
  };
  _links: Record<string, unknown>;
}
