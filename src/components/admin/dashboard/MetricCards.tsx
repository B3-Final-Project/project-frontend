"use client";

import { Heart, TrendingUp, Users, Zap } from 'lucide-react';

import { MetricCard } from './shared/MetricCard';
import { formatPercentage } from "@/lib/utils/stats-utils";
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function MetricCards() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

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
      subtitle: comprehensiveStats.activity ? `+${comprehensiveStats.activity.newUsersToday} today` : undefined,
      icon: Users
    },
    {
      title: "Total Matches",
      value: comprehensiveStats.appStats.totalMatches,
      subtitle: comprehensiveStats.engagement ? `${formatPercentage(comprehensiveStats.engagement.matchRate)} match rate` : undefined,
      icon: Heart
    },
    {
      title: "Engagement",
      value: comprehensiveStats.engagement?.averageLikesPerUser ? comprehensiveStats.engagement.averageLikesPerUser.toFixed(1) : '0',
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
