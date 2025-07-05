import {
  ActivityStatsDto,
  AppStatsDto,
  BoosterStatsDto,
  ComprehensiveStatsDto,
  DetailedStatsDto,
  EngagementStatsDto,
  UserDemographicsDto,
} from "@/lib/routes/stats/dto/stats.dto";

import { RESTServerRoute } from "@/lib/routes/server";
import { createFetcher } from "@/lib/utils";

export class StatsRouter {
  // General application statistics
  public static readonly getAppStats = createFetcher<AppStatsDto>(
    RESTServerRoute.REST_STATS_APP,
    "GET",
  );

  // Booster statistics
  public static readonly getBoosterStats = createFetcher<BoosterStatsDto[]>(
    RESTServerRoute.REST_STATS_BOOSTERS,
    "GET",
  );

  // Detailed statistics (app + boosters)
  public static readonly getDetailedStats = createFetcher<DetailedStatsDto>(
    RESTServerRoute.REST_STATS_DETAILED,
    "GET",
  );

  // Count endpoints
  public static readonly getUsersCount = createFetcher<number>(
    RESTServerRoute.REST_STATS_USERS_COUNT,
    "GET",
  );
  public static readonly getMatchesCount = createFetcher<number>(
    RESTServerRoute.REST_STATS_MATCHES_COUNT,
    "GET",
  );
  public static readonly getPassesCount = createFetcher<number>(
    RESTServerRoute.REST_STATS_PASSES_COUNT,
    "GET",
  );
  public static readonly getLikesCount = createFetcher<number>(
    RESTServerRoute.REST_STATS_LIKES_COUNT,
    "GET",
  );
  public static readonly getTotalBoosterUsage = createFetcher<number>(
    RESTServerRoute.REST_STATS_BOOSTERS_USAGE_TOTAL,
    "GET",
  );

  // Demographics and engagement
  public static readonly getUserDemographics =
    createFetcher<UserDemographicsDto>(
      RESTServerRoute.REST_STATS_DEMOGRAPHICS,
      "GET",
    );
  public static readonly getEngagementStats = createFetcher<EngagementStatsDto>(
    RESTServerRoute.REST_STATS_ENGAGEMENT,
    "GET",
  );

  // Activity statistics
  public static readonly getActivityStats = createFetcher<ActivityStatsDto>(
    RESTServerRoute.REST_STATS_ACTIVITY,
    "GET",
  );

  // Comprehensive statistics
  public static readonly getComprehensiveStats =
    createFetcher<ComprehensiveStatsDto>(
      RESTServerRoute.REST_STATS_COMPREHENSIVE,
      "GET",
    );
}
