export interface UserManagementDto {
  userId: string;
  profileId: number;
  name: string;
  surname: string;
  reportCount: number;
  createdAt: Date;
  isBanned?: boolean;
}
