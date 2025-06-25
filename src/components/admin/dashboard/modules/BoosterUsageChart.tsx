"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '../shared/ChartCard';
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function BoosterUsageChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats) return null;

  const boosterData = comprehensiveStats.boosterStats.map(booster => ({
    name: booster.boosterName,
    opened: booster.timesOpened,
    type: booster.boosterType
  }));

  return (
    <ChartCard
      title="Booster Pack Usage"
      description="Number of times each pack type was opened"
    >
      <BarChart data={boosterData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="opened" fill="#0088FE" />
      </BarChart>
    </ChartCard>
  );
}
