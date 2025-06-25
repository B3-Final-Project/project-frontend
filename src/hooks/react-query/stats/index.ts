import { StatsRouter } from "@/lib/routes/stats";
import { useQuery } from "@tanstack/react-query";

// App statistics
export function useAppStatsQuery() {
  return useQuery({
    queryKey: ["stats", "app"],
    queryFn: () => StatsRouter.getAppStats(),
  });
}

// Booster statistics
export function useBoosterStatsQuery() {
  return useQuery({
    queryKey: ["stats", "boosters"],
    queryFn: () => StatsRouter.getBoosterStats(),
  });
}

// Detailed statistics (app + boosters combined)
export function useDetailedStatsQuery() {
  return useQuery({
    queryKey: ["stats", "detailed"],
    queryFn: () => StatsRouter.getDetailedStats(),
  });
}

// Count queries
export function useUsersCountQuery() {
  return useQuery({
    queryKey: ["stats", "users", "count"],
    queryFn: () => StatsRouter.getUsersCount(),
  });
}

export function useMatchesCountQuery() {
  return useQuery({
    queryKey: ["stats", "matches", "count"],
    queryFn: () => StatsRouter.getMatchesCount(),
  });
}

export function usePassesCountQuery() {
  return useQuery({
    queryKey: ["stats", "passes", "count"],
    queryFn: () => StatsRouter.getPassesCount(),
  });
}

export function useLikesCountQuery() {
  return useQuery({
    queryKey: ["stats", "likes", "count"],
    queryFn: () => StatsRouter.getLikesCount(),
  });
}

export function useTotalBoosterUsageQuery() {
  return useQuery({
    queryKey: ["stats", "boosters", "usage", "total"],
    queryFn: () => StatsRouter.getTotalBoosterUsage(),
  });
}

// Demographics and engagement
export function useUserDemographicsQuery() {
  return useQuery({
    queryKey: ["stats", "demographics"],
    queryFn: () => StatsRouter.getUserDemographics(),
  });
}

export function useEngagementStatsQuery() {
  return useQuery({
    queryKey: ["stats", "engagement"],
    queryFn: () => StatsRouter.getEngagementStats(),
  });
}

// Activity statistics
export function useActivityStatsQuery() {
  return useQuery({
    queryKey: ["stats", "activity"],
    queryFn: () => StatsRouter.getActivityStats(),
  });
}

// Comprehensive statistics (all stats combined)
export function useComprehensiveStatsQuery() {
  return useQuery({
    queryKey: ["stats", "comprehensive"],
    queryFn: () => StatsRouter.getComprehensiveStats(),
  });
}

// Utility hooks for commonly used combinations
export function useBasicStatsQuery() {
  const appStats = useAppStatsQuery();
  const boosterStats = useBoosterStatsQuery();
  
  return {
    appStats,
    boosterStats,
    isLoading: appStats.isLoading || boosterStats.isLoading,
    isError: appStats.isError || boosterStats.isError,
    error: appStats.error || boosterStats.error,
  };
}

export function useAllCountsQuery() {
  const usersCount = useUsersCountQuery();
  const matchesCount = useMatchesCountQuery();
  const passesCount = usePassesCountQuery();
  const likesCount = useLikesCountQuery();
  const boosterUsage = useTotalBoosterUsageQuery();
  
  return {
    usersCount,
    matchesCount,
    passesCount,
    likesCount,
    boosterUsage,
    isLoading: usersCount.isLoading || matchesCount.isLoading || passesCount.isLoading || likesCount.isLoading || boosterUsage.isLoading,
    isError: usersCount.isError || matchesCount.isError || passesCount.isError || likesCount.isError || boosterUsage.isError,
    error: usersCount.error || matchesCount.error || passesCount.error || likesCount.error || boosterUsage.error,
  };
}
