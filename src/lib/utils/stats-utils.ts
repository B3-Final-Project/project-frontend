import { formatRelationshipTypeEnum } from "@/lib/utils/enum-utils";
import { toNumber } from "es-toolkit/compat";

export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// DTO Interfaces matching backend structure
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

/**
 * Formats a number as a percentage string with one decimal place
 */
export const formatPercentage = (value: number): string => `${value.toFixed(1)}%`;

/**
 * Formats pie chart labels to show name and percentage
 */
export const formatPercentageLabel = (entry: { name?: string; percent?: number }): string =>
  `${entry.name ?? ''} ${entry.percent ? (entry.percent * 100).toFixed(0) : 0}%`;

/**
 * Transforms an object with string keys and numeric values into chart-ready data format
 */
export const transformObjectToChartData = (
  data: Record<string, number>,
  nameKey: string = 'name',
  valueKey: string = 'value'
): Array<{ [key: string]: string | number }> =>
  Object.entries(data).map(([key, value]) => ({ [nameKey]: key, [valueKey]: value }));

/**
 * Adds color properties to chart data array using the predefined color palette
 */
export const createColoredData = <T extends Record<string, unknown>>(
  data: Array<T>,
  colorKey: string = 'color'
): Array<T & { [K in typeof colorKey]: string }> =>
  data.map((item, index) => ({
    ...item,
    [colorKey]: CHART_COLORS[index % CHART_COLORS.length]
  })) as Array<T & { [K in typeof colorKey]: string }>;

// Legacy chart data interfaces (keeping for backward compatibility)
export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartEntry {
  name?: string;
  percent?: number;
  goal?: string;
}

export interface ActivityDataItem {
  period: string;
  newUsers: number;
  views: number;
}

export interface EngagementDataItem {
  name: string;
  value: number;
}
