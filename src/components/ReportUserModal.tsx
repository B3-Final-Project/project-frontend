import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileCardType } from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { ReportReason } from "@/lib/routes/admin/dto/report.dto";
import { Textarea } from "@/components/ui/textarea";
import { formatReportEnum } from "@/lib/utils/enum-utils";
import { useReportUserMutation } from "@/hooks/react-query/admin";
import { useState } from "react";

interface ReportUserModalProps {
  readonly open: boolean;
  setIsOpen(open: boolean): void;
  readonly user: ProfileCardType;
}

export function ReportUserModal({
  open,
  setIsOpen,
  user,
}: Readonly<ReportUserModalProps>) {
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState<ReportReason>(
    ReportReason.OTHER,
  );
  const reportMutation = useReportUserMutation();

  const handleReportSubmit = () => {
    if (!user.id) return;
    if (reportCategory) {
      reportMutation.mutate({
        reportedProfileId: parseInt(user.id),
        reason: reportCategory,
        details: reportReason,
      });
      setReportReason("");
      setReportCategory(ReportReason.OTHER);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setReportReason("");
    setReportCategory(ReportReason.OTHER);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report User: {user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div>
            <Label htmlFor="report-category">Report Category</Label>
            <Select
              value={reportCategory.toString()}
              onValueChange={(value) => {
                setReportCategory(Number(value) as ReportReason);
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReportReason)
                  .filter((v) => typeof v === "number")
                  .map((v) => (
                    <SelectItem key={v} value={v.toString()}>
                      {formatReportEnum(v as ReportReason)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="report-reason">Additional Details</Label>
            <Textarea
              id="report-reason"
              placeholder="Please provide additional details about the report..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleReportSubmit}
              disabled={!reportCategory || reportMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {reportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
