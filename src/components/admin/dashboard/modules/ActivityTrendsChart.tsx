"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "../shared/ChartCard";
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function ActivityTrendsChart() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.activity) return null;

  const activityData = [
    {
      period: "Today",
      newUsers: comprehensiveStats.activity.newUsersToday,
      views: comprehensiveStats.activity.profileViewsToday,
    },
    {
      period: "This Week",
      newUsers: comprehensiveStats.activity.newUsersThisWeek,
      views: comprehensiveStats.activity.profileViewsThisWeek,
    },
    {
      period: "This Month",
      newUsers: comprehensiveStats.activity.newUsersThisMonth,
      views: comprehensiveStats.activity.profileViewsThisMonth,
    },
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
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="#8884d8"
          name="New Users"
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#82ca9d"
          name="Profile Views"
        />
      </LineChart>
    </ChartCard>
  );
}
