"use client";

import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

import { useUserDemographicsQuery } from "@/hooks/react-query/stats";
import { formatPercentage } from "@/lib/utils/stats-utils";
import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";

export function GenderDistributionChart() {
  const { data: demographicsStats } = useUserDemographicsQuery();

  if (!demographicsStats) return null;

  const genderData = [
    { name: 'Male', value: demographicsStats.malePercentage, color: '#0088FE' },
    { name: 'Female', value: demographicsStats.femalePercentage, color: '#FF8042' },
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
