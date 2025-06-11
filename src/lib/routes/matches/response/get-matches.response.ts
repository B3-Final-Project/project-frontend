import { MatchDto } from "../dto/match.dto";

export interface GetMatchesResponse {
  matches: MatchDto[];
}

export interface GetPendingMatchesResponse {
  matches: MatchDto[];
}

export interface GetSentMatchesResponse {
  matches: MatchDto[];
}
