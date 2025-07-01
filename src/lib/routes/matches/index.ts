import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import {
  GetMatchesResponse,
  GetPendingMatchesResponse,
  GetSentMatchesResponse
} from "./response/get-matches.response";
import { MatchActionResponse } from "./response/match-action.response";

export class MatchRouter {
  // Get all matches
  public static readonly getMatches = createFetcher<GetMatchesResponse>(
    RESTServerRoute.REST_MATCHES,
    "GET"
  );

  // Get pending matches (matches waiting for user's response)
  public static readonly getPendingMatches = createFetcher<GetPendingMatchesResponse>(
    RESTServerRoute.REST_MATCHES_PENDING,
    "GET"
  );

  // Get sent matches (matches user has liked/passed)
  public static readonly getSentMatches = createFetcher<GetSentMatchesResponse>(
    RESTServerRoute.REST_MATCHES_SENT,
    "GET"
  );

  // Get detailed information about a specific match
  public static readonly getMatchDetails = createFetcher<GetMatchesResponse>(
    RESTServerRoute.REST_MATCHES_DETAILS,
    "GET"
  );

  // Like a match
  public static readonly likeMatch = createFetcher<MatchActionResponse>(
    RESTServerRoute.REST_MATCHES_LIKE,
    "POST"
  );

  // Pass on a match
  public static readonly passMatch = createFetcher(
    RESTServerRoute.REST_MATCHES_PASS,
    "POST"
  );
}
