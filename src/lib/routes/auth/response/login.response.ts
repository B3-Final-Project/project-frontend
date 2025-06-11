export interface LoginResponse {
  AccessToken: string;
  ExpiresIn: number;
  TokenType: string;
  RefreshToken: string;
  IdToken: string;
  NewDeviceMetadata?: string;
}
