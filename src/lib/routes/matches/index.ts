import { createFetcher } from "@/lib/utils";
import { RESTServerRoute } from "@/lib/routes/server";
import { MatchActionResponse } from "./response/match-action.response";
import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";
import {
  GetProfileResponse
} from "@/lib/routes/profiles/response/get-profile.response";
export class MatchRouter {
  // Get all matches
  public static readonly getMatches = createFetcher<User[]>(
    RESTServerRoute.REST_MATCHES,
    "GET",
  );

  // Get pending matches (matches waiting for user's response)
  public static readonly getPendingMatches =
    createFetcher<Profile[]>(
      RESTServerRoute.REST_MATCHES_PENDING,
      "GET",
    );

  // Get sent matches (matches user has liked/passed)
  public static readonly getSentMatches = createFetcher<User[]>(
    RESTServerRoute.REST_MATCHES_SENT,
    "GET",
  );

  // Get detailed information about a specific match
  public static readonly getMatchDetails = createFetcher<User[]>(
    RESTServerRoute.REST_MATCHES_DETAILS,
    "GET",
  );

  // Like a match
  public static readonly likeMatch = createFetcher<MatchActionResponse>(
    RESTServerRoute.REST_MATCHES_LIKE,
    "POST",
  );

  // Pass on a match
  public static readonly passMatch = createFetcher(
    RESTServerRoute.REST_MATCHES_PASS,
    "POST",
  );
}
