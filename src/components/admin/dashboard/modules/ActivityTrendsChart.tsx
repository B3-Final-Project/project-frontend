"use client";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '../shared/ChartCard';
import { useActivityStatsQuery } from "@/hooks/react-query/stats";

export function ActivityTrendsChart() {
  const { data: activityStats } = useActivityStatsQuery();

  if (!activityStats) return null;

  const activityData = [
    { period: 'Today', newUsers: activityStats.newUsersToday, views: activityStats.profileViewsToday },
    { period: 'This Week', newUsers: activityStats.newUsersThisWeek, views: activityStats.profileViewsThisWeek },
    { period: 'This Month', newUsers: activityStats.newUsersThisMonth, views: activityStats.profileViewsThisMonth },
  ];

  if (activityData.length === 0) return null;

  return (
    <ChartCard
      title="Activity Trends"
      description="New users and profile views over time"
    >
      <LineChart data={activityData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="New Users" />
        <Line type="monotone" dataKey="views" stroke="#82ca9d" name="Profile Views" />
      </LineChart>
    </ChartCard>
  );
}
