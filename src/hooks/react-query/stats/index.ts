import { StatsRouter } from "@/lib/routes/stats";
import { useQuery } from "@tanstack/react-query";

// Comprehensive statistics (all stats combined) - main hook for dashboard
export function useComprehensiveStatsQuery() {
  return useQuery({
    queryKey: ["stats", "comprehensive"],
    queryFn: () => StatsRouter.getComprehensiveStats(),
  });
}

// Individual statistics hooks (kept for potential future use or specific components)
export function useAppStatsQuery() {
  return useQuery({
    queryKey: ["stats", "app"],
    queryFn: () => StatsRouter.getAppStats(),
  });
}

export function useBoosterStatsQuery() {
  return useQuery({
    queryKey: ["stats", "boosters"],
    queryFn: () => StatsRouter.getBoosterStats(),
  });
}

export function useDetailedStatsQuery() {
  return useQuery({
    queryKey: ["stats", "detailed"],
    queryFn: () => StatsRouter.getDetailedStats(),
  });
}

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

export function useActivityStatsQuery() {
  return useQuery({
    queryKey: ["stats", "activity"],
    queryFn: () => StatsRouter.getActivityStats(),
  });
}

// Count queries (kept for specific use cases)
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
