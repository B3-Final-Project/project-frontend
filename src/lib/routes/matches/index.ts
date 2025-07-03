import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import { MatchActionResponse } from "./response/match-action.response";
import { MatchDto } from "@/lib/routes/matches/dto/match.dto";

export class MatchRouter {
  // Get all matches
  public static readonly getMatches = createFetcher<MatchDto[]>(
    RESTServerRoute.REST_MATCHES,
    "GET",
  );

  // Get pending matches (matches waiting for user's response)
  public static readonly getPendingMatches =
    createFetcher<MatchDto[]>(
      RESTServerRoute.REST_MATCHES_PENDING,
      "GET",
    );

  // Get sent matches (matches user has liked/passed)
  public static readonly getSentMatches = createFetcher<MatchDto[]>(
    RESTServerRoute.REST_MATCHES_SENT,
    "GET",
  );

  // Get detailed information about a specific match
  public static readonly getMatchDetails = createFetcher<MatchDto[]>(
    RESTServerRoute.REST_MATCHES_DETAILS,
    "GET",
  );

  // Like a match
  public static readonly likeMatch = createFetcher<MatchActionResponse>(
    RESTServerRoute.REST_MATCHES_LIKE,
    "POST",
  );

  // Pass on a match
  public static readonly passMatch = createFetcher<MatchActionResponse>(
    RESTServerRoute.REST_MATCHES_PASS,
    "POST",
  );
}
