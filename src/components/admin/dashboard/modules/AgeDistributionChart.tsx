"use client";

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { useUserDemographicsQuery } from "@/hooks/react-query/stats";
import { transformObjectToChartData } from "@/lib/utils/stats-utils";
import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";

export function AgeDistributionChart() {
  const { data: demographicsStats } = useUserDemographicsQuery();

  if (!demographicsStats?.ageDistribution) return null;

  const ageDistributionData = transformObjectToChartData(demographicsStats.ageDistribution, 'age', 'count');

  if (ageDistributionData.length === 0) return null;

  return (
    <ChartCard
      title="Age Distribution"
      description="User age demographics"
    >
      <AreaChart data={ageDistributionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </AreaChart>
    </ChartCard>
  );
}
