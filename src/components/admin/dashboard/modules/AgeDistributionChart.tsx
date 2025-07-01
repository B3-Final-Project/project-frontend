"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";
import { transformObjectToChartData } from "@/lib/utils/stats-utils";
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function AgeDistributionChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.demographics?.ageDistribution) return null;

  const ageDistributionData = transformObjectToChartData(
    comprehensiveStats.demographics.ageDistribution,
    "age",
    "count",
  );

  if (ageDistributionData.length === 0) return null;

  return (
    <ChartCard title="Age Distribution" description="User age demographics">
      <AreaChart data={ageDistributionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartCard>
  );
}
