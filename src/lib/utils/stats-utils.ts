export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
