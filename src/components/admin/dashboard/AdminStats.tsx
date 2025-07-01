"use client";

import {
  AdminStatsLoadingFallback,
  useAdminStatsLoading,
} from "@/components/admin/dashboard/AdminStatsLoading";

import { ActiveUsersChart } from "@/components/admin/dashboard/modules/ActiveUsersChart";
import { ActivityTrendsChart } from "@/components/admin/dashboard/modules/ActivityTrendsChart";
import { AgeDistributionChart } from "@/components/admin/dashboard/modules/AgeDistributionChart";
import { BoosterUsageChart } from "@/components/admin/dashboard/modules/BoosterUsageChart";
import { GenderDistributionChart } from "@/components/admin/dashboard/modules/GenderDistributionChart";
import { GeographicStats } from "@/components/admin/dashboard/modules/GeographicStats";
import { MetricCards } from "@/components/admin/dashboard/MetricCards";
import { RelationshipGoalsChart } from "@/components/admin/dashboard/modules/RelationshipGoalsChart";
import { Separator } from "@/components/ui/separator";
import { UserActionsChart } from "@/components/admin/dashboard/modules/UserActionsChart";
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

function AdminStats() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();
  const isLoading = useAdminStatsLoading();

  if (isLoading) {
    return <AdminStatsLoadingFallback />;
  }

  if (!comprehensiveStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No stats data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your application statistics and user
          engagement
        </p>
      </div>

      <Separator />

      {/* Key Metrics Cards */}
      <MetricCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserActionsChart />
        <BoosterUsageChart />
        <AgeDistributionChart />
        <GenderDistributionChart />
        <ActivityTrendsChart />
        <ActiveUsersChart />
        <RelationshipGoalsChart />
        <GeographicStats />
      </div>
    </div>
  );
}

export default AdminStats;
