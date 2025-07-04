import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReportResponseDto } from "@/lib/routes/admin/dto/reports.dto";
import { ReportsColumns } from "./columns";
import { useReportsQuery } from "@/hooks/react-query/admin";
import { DataTable } from "@/components/admin/users/data-table";
import TopOffenders from "@/components/admin/reports/TopOffenders";

function ReportsManagement() {
  const [status, setStatus] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");
  const [reporterId, setReporterId] = useState<string>("");

  const query = useReportsQuery(
    status || undefined,
    profileId ? parseInt(profileId) : undefined,
    reporterId || undefined
  );

  // Flatten all pages data
  const allReports = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.reduce((acc: ReportResponseDto[], page) => {
      return [...acc, ...page.reports];
    }, []);
  }, [query.data?.pages]);

  // Get total count from the first page
  const totalCount = query.data?.pages?.[0]?.total ?? 0;

  const handleClearFilters = () => {
    setStatus("");
    setProfileId("");
    setReporterId("");
  };

  if (query.isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Reports
          </h2>
          <p className="text-gray-600">
            {query.error?.message ?? "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
        <p className="text-gray-600">
          Manage user reports and take appropriate actions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profileId">Reported User ID</Label>
            <Input
              id="profileId"
              type="number"
              placeholder="Enter user ID"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporterId">Reporter ID</Label>
            <Input
              id="reporterId"
              placeholder="Enter reporter ID"
              value={reporterId}
              onChange={(e) => setReporterId(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={!status && !profileId && !reporterId}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      {!query.isLoading && (
        <div className="space-y-4">
          <DataTable columns={ReportsColumns} data={allReports} />

          {/* Load More Button */}
          {query.hasNextPage && (
            <div className="flex justify-center">
              <Button
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                variant="outline"
                className="min-w-[120px]"
              >
                {query.isFetchingNextPage ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : (
                  `Load More (${allReports.length}/${totalCount})`
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      <TopOffenders/>
    </div>
  );
}

export default ReportsManagement;
