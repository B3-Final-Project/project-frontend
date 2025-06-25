"use client";

import { Heart, TrendingUp, Users, Zap } from 'lucide-react';
import {
  useActivityStatsQuery,
  useComprehensiveStatsQuery,
  useEngagementStatsQuery
} from "@/hooks/react-query/stats";

import { MetricCard } from './shared/MetricCard';
import { formatPercentage } from "@/lib/utils/stats-utils";

export function MetricCards() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();
  const { data: engagementStats } = useEngagementStatsQuery();
  const { data: activityStats } = useActivityStatsQuery();

  if (!comprehensiveStats) return null;

  const boosterData = comprehensiveStats.boosterStats.map(booster => ({
    name: booster.boosterName,
    opened: booster.timesOpened,
    type: booster.boosterType
  }));

  const metricCards = [
    {
      title: "Total Users",
      value: comprehensiveStats.appStats.totalUsers,
      subtitle: activityStats ? `+${activityStats.newUsersToday} today` : undefined,
      icon: Users
    },
    {
      title: "Total Matches",
      value: comprehensiveStats.appStats.totalMatches,
      subtitle: engagementStats ? `${formatPercentage(engagementStats.matchRate)} match rate` : undefined,
      icon: Heart
    },
    {
      title: "Engagement",
      value: engagementStats?.averageLikesPerUser ? engagementStats.averageLikesPerUser.toFixed(1) : '0',
      subtitle: "avg likes per user",
      icon: TrendingUp
    },
    {
      title: "Booster Usage",
      value: boosterData.reduce((sum, booster) => sum + booster.opened, 0),
      subtitle: "total packs opened",
      icon: Zap
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => (
        <MetricCard
          key={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
        />
      ))}
    </div>
  );
}
