"use client";

import { Cell, Pie, PieChart } from "recharts";

import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";
import {
  createColoredData,
  formatPercentageLabel,
  transformObjectToChartData,
} from "@/lib/utils/stats-utils";
import { ChartCard } from "@/components/admin/dashboard/shared/ChartCard";
import { formatRelationshipTypeEnum } from "@/lib/utils/enum-utils";
import { toNumber } from "es-toolkit/compat";

export function RelationshipGoalsChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.relationshipGoals?.relationshipGoalsDistribution)
    return null;

  const relationshipGoalsData = createColoredData(
    transformObjectToChartData(
      comprehensiveStats.relationshipGoals.relationshipGoalsDistribution,
      "goal",
      "count",
    ),
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
          label={(entry)=>formatPercentageLabel({name: formatRelationshipTypeEnum(toNumber(entry.name)), percent: entry.percent})}
        >
          {relationshipGoalsData.map((entry) => (
            <Cell key={`goal-${entry.goal}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartCard>
  );
}
