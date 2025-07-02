import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminRouter } from "@/lib/routes/admin";
import { ReportDto } from "@/lib/routes/admin/dto/report.dto";
import { toast } from "@/hooks/use-toast";

// Hook to get all reports with infinite scroll pagination and filtering
export function useReportsQuery(
  status?: string,
  profileId?: number,
  reporterId?: string,
  limit: number = 10
) {
  return useInfiniteQuery({
    queryKey: ["reports", status, profileId, reporterId, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const params: Record<string, string | number> = {
        page: Math.floor(pageParam / limit) + 1,
        limit: limit,
      };

      if (status && status !== "all") {
        params.status = status;
      }
      if (profileId) {
        params.profileId = profileId;
      }
      if (reporterId && reporterId.trim() !== "") {
        params.reporterId = reporterId.trim();
      }

      try {
        return await AdminRouter.getReports(params);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, we've reached the end
      if (lastPage.reports.length < limit) {
        return undefined;
      }
      // Return the next offset
      return allPages.length * limit;
    },
    initialPageParam: 0,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

// Hook to get a specific report by ID
export function useReportQuery(reportId: number) {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => AdminRouter.getReport(undefined, { reportId: reportId.toString() }),
    enabled: !!reportId,
    staleTime: 60000, // 1 minute
  });
}

// Hook to ban a user
export function useBanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return AdminRouter.banUser(undefined, { userId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "User banned",
        description: data.message ?? "User has been banned successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to ban user", error);
      toast({
        title: "Failed to ban user",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

// Hook to unban a user
export function useUnbanUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return AdminRouter.unbanUser(undefined, { userId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "User unbanned",
        description: data.message ?? "User has been unbanned successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to unban user", error);
      toast({
        title: "Failed to unban user",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

// Hook to report a user (placeholder for future API implementation)
export function useReportUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReportDto) => AdminRouter.reportUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Report submitted",
        description: `Report for user has been submitted successfully. Reason: ${data.message}`,
      });
    },
    onError: (error) => {
      console.error("Failed to report user", error);
      toast({
        title: "Failed to submit report",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

// Hook to delete a report
export function useDeleteReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: number) => {
      return AdminRouter.deleteReport(undefined, { reportId: reportId.toString() });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Report deleted",
        description: data.message ?? "Report has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete report", error);
      toast({
        title: "Failed to delete report",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}
