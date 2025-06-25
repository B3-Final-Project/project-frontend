export interface AppStatsDto {
  totalUsers: number;
  totalMatches: number;
  totalPasses: number;
  totalLikes: number;
}

export interface BoosterStatsDto {
  boosterId: number;
  boosterName: string;
  boosterType: string;
  timesOpened: number;
}

export interface DetailedStatsDto {
  appStats: AppStatsDto;
  boosterStats: BoosterStatsDto[];
}

export interface UserDemographicsDto {
  malePercentage: number;
  femalePercentage: number;
  averageAge: number;
  ageDistribution: Record<string, number>;
}

export interface EngagementStatsDto {
  averageLikesPerUser: number;
  averageMatchesPerUser: number;
  matchRate: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

export interface GeographicStatsDto {
  topCity: string;
  topCityUserCount: number;
  topCities: Array<{ city: string; count: number }>;
}

export interface RelationshipGoalsStatsDto {
  relationshipGoalsDistribution: Record<string, number>;
}

export interface ActivityStatsDto {
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  profileViewsToday: number;
  profileViewsThisWeek: number;
  profileViewsThisMonth: number;
}

export interface SuccessMetricsDto {
  conversationsStarted: number;
  matchToConversationRate: number;
  averageTimeToFirstMatch: number;
  averageTimeToFirstLike: number;
}

export interface ComprehensiveStatsDto {
  appStats: AppStatsDto;
  boosterStats: BoosterStatsDto[];
  demographics: UserDemographicsDto;
  engagement: EngagementStatsDto;
  geographic: GeographicStatsDto;
  relationshipGoals: RelationshipGoalsStatsDto;
  activity: ActivityStatsDto;
  successMetrics: SuccessMetricsDto;
}
