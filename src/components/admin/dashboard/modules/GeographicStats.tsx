"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Globe } from 'lucide-react';
import { useComprehensiveStatsQuery } from "@/hooks/react-query/stats";

export function GeographicStats() {
  const { data: comprehensiveStats } = useComprehensiveStatsQuery();

  if (!comprehensiveStats?.geographic) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Top cities by user count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{comprehensiveStats.geographic.topCity}</span>
            </div>
            <span className="text-xl font-bold">{comprehensiveStats.geographic.topCityUserCount}</span>
          </div>
          {comprehensiveStats.geographic.topCities?.slice(1, 5).map((city) => (
            <div key={city.city} className="flex items-center justify-between">
              <span className="text-sm">{city.city}</span>
              <span className="font-medium">{city.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
