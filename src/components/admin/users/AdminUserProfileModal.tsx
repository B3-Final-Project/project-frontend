"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDrinkingEnum, formatSmokingEnum, formatZodiacEnum } from "@/lib/utils/enum-utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flag } from "lucide-react";
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useProfileByIdMutation,
} from "@/hooks/react-query/profiles";
import { useReportUserMutation } from "@/hooks/react-query/admin";

interface AdminUserProfileModalProps {
  readonly user: UserManagementDto;
  readonly isOpen: boolean;
  onClose(): void;
}

export function AdminUserProfileModal({
  user,
  isOpen,
  onClose
}: Readonly<AdminUserProfileModalProps>) {
  const { mutate, isPending, data, isError } = useProfileByIdMutation(user.userId);
  const reportMutation = useReportUserMutation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("");

  const reportCategories = [
    "Inappropriate content",
    "Fake profile", 
    "Harassment",
    "Spam",
    "Underage user",
    "Other"
  ];

  useEffect(
    () => {
      if (isOpen && user.userId) {
        // Fetch the profile data when the modal opens
        mutate();
      }
    },
    [isOpen, mutate, user.userId]
  )

  const handleReportSubmit = () => {
    const fullReason = reportCategory ? `${reportCategory}: ${reportReason.trim()}` : reportReason.trim();
    if (fullReason) {
      reportMutation.mutate({ 
        userId: user.userId, 
        reason: fullReason 
      });
      setReportReason("");
      setReportCategory("");
      setIsReportModalOpen(false);
    }
  };


  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Not Found</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p>This user doesn&#39;t have a profile yet</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isPending || !data) {
    return
  }

  const { profile, user: profileUser } = data;

  return (
    <>
      {/* Main Profile Modal with Admin Actions */}
      <Dialog open={isOpen && !isReportModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            {/* Admin Actions Header */}
            <div className="bg-red-50 border-b border-red-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-red-800">Admin View: {user.name} {user.surname}</h3>
                  <p className="text-sm text-red-600">User ID: {user.userId}</p>
                </div>
                <Button
                  onClick={() => setIsReportModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Flag className="h-4 w-4" />
                  Report User
                </Button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-md mx-auto">
                {/* Profile Card Content */}
                <div className="bg-white rounded-lg border p-6 space-y-4">
                  {profile.images?.[0] && (
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                      <img 
                        src={profile.images[0]} 
                        alt={`${user.name} ${user.surname}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user.name} {user.surname}</h2>
                    {Boolean(profileUser.age) && <p className="text-gray-600">Age: {profileUser.age}</p>}
                    {profile.city && <p className="text-gray-600">📍 {profile.city}</p>}
                  </div>

                  {/* Description */}
                  {(profile.work || profile.religion || profile.politics) && (
                    <div className="space-y-1">
                      <h3 className="font-semibold">About</h3>
                      <p className="text-gray-700">
                        {`${profile.work ?? ''} ${profile.religion ?? ''} ${profile.politics ?? ''}`.trim()}
                      </p>
                    </div>
                  )}

                  {/* Interests */}
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <span key={interest.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {interest.prompt}: {interest.answer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {profile.languages && profile.languages.length > 0 && (
                      <p><strong>Languages:</strong> {profile.languages.join(', ')}</p>
                    )}
                    {profile.zodiac && (
                      <p><strong>Zodiac:</strong> {formatZodiacEnum(profile.zodiac)}</p>
                    )}
                    {profile.smoking && (
                      <p><strong>Smoking:</strong> {formatSmokingEnum(profile.smoking)}</p>
                    )}
                    {profile.drinking && (
                      <p><strong>Drinking:</strong> {formatDrinkingEnum(profile.drinking)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report User: {user.name} {user.surname}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="report-category">Report Category</Label>
              <Select value={reportCategory} onValueChange={setReportCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {reportCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportReason("");
                  setReportCategory("");
                }}
              >
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
    </>
  );
}
