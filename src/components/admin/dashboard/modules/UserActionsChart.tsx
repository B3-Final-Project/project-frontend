"use client";

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";
import { formatPercentageLabel } from "@/lib/utils/stats-utils";
import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";

export function UserActionsChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats) return null;

  const matchData = [
    { name: 'Likes', value: comprehensiveStats.appStats.totalLikes, color: '#00C49F' },
    { name: 'Passes', value: comprehensiveStats.appStats.totalPasses, color: '#FF8042' },
    { name: 'Matches', value: comprehensiveStats.appStats.totalMatches, color: '#0088FE' },
  ];

  return (
    <ChartCard
      title="User Actions Distribution"
      description="Breakdown of likes, passes, and matches"
    >
      <PieChart>
        <Pie
          data={matchData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={formatPercentageLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {matchData.map((entry) => (
            <Cell key={`match-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
      </PieChart>
    </ChartCard>
  );
}
