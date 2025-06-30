"use client";

import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";
import {
  transformObjectToChartData,
  createColoredData, formatPercentageLabel
} from "@/lib/utils/stats-utils";
import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";


export function RelationshipGoalsChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.relationshipGoals?.relationshipGoalsDistribution) return null;

  const relationshipGoalsData = createColoredData(
    transformObjectToChartData(comprehensiveStats.relationshipGoals.relationshipGoalsDistribution, 'goal', 'count')
  );

  if (relationshipGoalsData.length === 0) return null;

  return (
    <ChartCard
      title="Relationship Goals"
      description="What users are looking for"
    >
      <PieChart>
        <Pie
          data={relationshipGoalsData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          label={formatPercentageLabel}
        >
          {relationshipGoalsData.map((entry) => (
            <Cell key={`goal-${entry.goal}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ChartCard>
  );
}
