"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useActivityStatsQuery,
  useAllCountsQuery,
  useBasicStatsQuery,
  useComprehensiveStatsQuery,
  useEngagementStatsQuery,
  useUserDemographicsQuery
} from "@/hooks/react-query/stats";

import { Skeleton } from "@/components/ui/skeleton";

export function useAdminStatsLoading() {
  const { isLoading: comprehensiveLoading } = useComprehensiveStatsQuery();
  const { isLoading: countsLoading } = useAllCountsQuery();
  const { isLoading: basicLoading } = useBasicStatsQuery();
  const { isLoading: engagementLoading } = useEngagementStatsQuery();
  const { isLoading: activityLoading } = useActivityStatsQuery();
  const { isLoading: demographicsLoading } = useUserDemographicsQuery();

  return comprehensiveLoading || countsLoading || basicLoading || engagementLoading || activityLoading || demographicsLoading;
}

export function AdminStatsLoadingFallback() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['users', 'matches', 'engagement', 'boosters'].map((type) => (
          <Card key={`skeleton-card-${type}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['chart1', 'chart2', 'chart3', 'chart4'].map((type) => (
          <Card key={`skeleton-chart-${type}`}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
