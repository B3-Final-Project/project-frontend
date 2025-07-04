import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";

export interface UserManagementResponseDto {
  profiles: UserManagementDto[];
  totalCount: number;
}
