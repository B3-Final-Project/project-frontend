export interface MatchActionResponse {
  success: boolean;
  message: string;
  isMatch?: boolean; // true if both users liked each other
  matchId?: string;
}
