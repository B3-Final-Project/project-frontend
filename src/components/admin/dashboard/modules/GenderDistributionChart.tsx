"use client";

import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";
import { formatPercentage } from "@/lib/utils/stats-utils";
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function GenderDistributionChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.demographics) return null;

  const genderData = [
    { name: 'Male', value: comprehensiveStats.demographics.malePercentage, color: '#0088FE' },
    { name: 'Female', value: comprehensiveStats.demographics.femalePercentage, color: '#FF8042' },
    { name: 'Non-Binary', value: comprehensiveStats.demographics.nonBinaryPercentage, color: '#00C49F' },
    { name: 'Other', value: comprehensiveStats.demographics.otherPercentage, color: '#FFBB28' },
  ];

  if (genderData.length === 0) return null;

  return (
    <ChartCard
      title="Gender Distribution"
      description="User gender demographics"
    >
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={genderData}>
        <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
        <Legend />
        <Tooltip formatter={(value: string | number) => [`${typeof value === 'number' ? formatPercentage(value) : value}`, 'Percentage']} />
      </RadialBarChart>
    </ChartCard>
  );
}
