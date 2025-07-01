"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '../shared/ChartCard';
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function ActiveUsersChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.engagement) return null;

  const engagementData = [
    { name: 'Daily Active', value: comprehensiveStats.engagement.dailyActiveUsers },
    { name: 'Weekly Active', value: comprehensiveStats.engagement.weeklyActiveUsers },
    { name: 'Monthly Active', value: comprehensiveStats.engagement.monthlyActiveUsers },
  ];

  if (engagementData.length === 0) return null;

  return (
    <ChartCard
      title="Active Users"
      description="Daily, weekly, and monthly active users"
    >
      <BarChart data={engagementData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#00C49F" />
      </BarChart>
    </ChartCard>
  );
}
