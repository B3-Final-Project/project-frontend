"use client";

import { Eye, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ReportResponseDto } from "@/lib/routes/admin/dto/reports.dto";
import { formatReportEnum } from "@/lib/utils/enum-utils";
import { useDeleteReportMutation } from "@/hooks/react-query/admin";
import { useState } from "react";
import { UserCardModal } from "@/components/UserCardModal";
import { mapUserProfileToProfileCardType } from "@/lib/utils/card-utils";

export const ReportsColumns: ColumnDef<ReportResponseDto>[] = [
  {
    accessorKey: "id",
    header: "Report ID",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-medium">#{report.id}</span>
          <span className="text-xs text-gray-500">
            {new Date(report.created_at).toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "reported_profile_id",
    header: "Reported User",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="font-medium">User</span>
            <span className="text-xs text-gray-500">
              ID: {report.reported_profile_id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reporterUserId",
    header: "Reporter",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="font-medium">Reporter</span>
            <span className="text-xs text-gray-500">
              ID: {report.reporterUserId}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-xs">
          {formatReportEnum(row.original.reason)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Details",
    cell: ({ row }) => {
      const details = row.original.message;
      return (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600 truncate block">
            {details ?? "No additional details"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const report = row.original;
      return <ReportActionsCell report={report} />;
    },
  },
];

function ReportActionsCell({ report }: { readonly report: ReportResponseDto }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const deleteReportMutation = useDeleteReportMutation();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteReportMutation.mutateAsync(report.id);
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowProfileModal(true)}
        className="h-8 px-2"
      >
        <Eye className="h-3 w-3" />
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting || deleteReportMutation.isPending}
        className="h-8 px-2"
        title="Delete Report"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <UserCardModal
        user={mapUserProfileToProfileCardType({profile: report.reportedProfile, user: report.reportedProfile.userProfile})}
        isOpen={showProfileModal}
        onCloseAction={() => setShowProfileModal(false)}
      />
    </div>
  );
}
