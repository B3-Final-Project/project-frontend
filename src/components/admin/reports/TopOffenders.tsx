"use client";

import { AlertTriangle, TrendingDown, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ReportResponseDto } from "@/lib/routes/admin/dto/reports.dto";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportsQuery } from "@/hooks/react-query/admin";
import { formatReportEnum } from "@/lib/utils/enum-utils";
import { ReportReason } from "@/lib/routes/admin/dto/report.dto";

interface TopOffender {
  profileId: number;
  reportCount: number;
  latestReportDate: Date;
  reasons: ReportReason[];
}

function TopOffenders() {
  const { data: reportsData, isLoading, error } = useReportsQuery(
    undefined, // status
    undefined, // profileId
    undefined, // reporterId
    100        // limit - Get more data to analyze top offenders
  );

  // Process reports to find top offenders
  const getTopOffenders = (reports: ReportResponseDto[]): TopOffender[] => {
    const offenderMap = new Map<number, TopOffender>();

    reports.forEach(report => {
      const existing = offenderMap.get(report.reported_profile_id);

      if (existing) {
        existing.reportCount++;
        existing.reasons.push(report.reason);
        if (new Date(report.created_at) > existing.latestReportDate) {
          existing.latestReportDate = new Date(report.created_at);
        }
      } else {
        offenderMap.set(report.reported_profile_id, {
          profileId: report.reported_profile_id,
          reportCount: 1,
          latestReportDate: new Date(report.created_at),
          reasons: [report.reason]
        });
      }
    });

    // Convert to array and sort by report count (descending)
    return Array.from(offenderMap.values())
      .sort((a, b) => b.reportCount - a.reportCount)
      .slice(0, 5); // Top 5 offenders
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueReasons = (reasons: ReportReason[]): ReportReason[] => {
    return [...new Set(reasons)];
  };

  const getSeverityBadge = (reportCount: number) => {
    if (reportCount >= 5) {
      return <Badge variant="destructive">High Risk</Badge>;
    }
    if (reportCount >= 3) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium Risk</Badge>;
    }
    return <Badge variant="outline">Low Risk</Badge>;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Error Loading Top Offenders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Failed to load top offenders data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const topOffenders = reportsData ? getTopOffenders(
    reportsData.pages.flatMap(page => page.reports)
  ) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          Top Offenders
        </CardTitle>
        <CardDescription>
          Users with the most reports in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={`offender-skeleton-${i}`} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {topOffenders.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No offenders found</h3>
                <p className="text-muted-foreground">
                  No users have multiple reports at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topOffenders.map((offender, index) => (
                  <div
                    key={offender.profileId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="font-semibold">
                            Profile {offender.profileId}
                          </span>
                          {getSeverityBadge(offender.reportCount)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {offender.reportCount} report{offender.reportCount !== 1 ? 's' : ''}
                          </span>
                          <span>
                            Latest: {formatDate(offender.latestReportDate)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground mb-1">Common reasons:</div>
                          <div className="flex flex-wrap gap-1">
                            {getUniqueReasons(offender.reasons).slice(0, 3).map((reason, i) => (
                              <Badge key={`reason-${offender.profileId}-${i}`} variant="outline" className="text-xs">
                                {formatReportEnum(reason)}
                              </Badge>
                            ))}
                            {getUniqueReasons(offender.reasons).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{getUniqueReasons(offender.reasons).length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {offender.reportCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        reports
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TopOffenders;
