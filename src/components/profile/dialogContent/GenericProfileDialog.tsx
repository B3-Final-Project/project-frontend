"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import {
  useProfileQuery,
  useUpdatePartialProfileMutation,
} from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";

interface GenericProfileDialogProps<T> {
  readonly title: string;
  readonly initialFormData: T;
  extractFormDataFromProfile(profile: Profile, user: User): T;
  buildUpdatePayload(formData: T): Partial<UpdateProfileDto>;
  renderFormContent(
    formData: T,
    handleInputChange: (fieldName: string, value: string | number) => void,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
  ): ReactNode;
}

export function GenericProfileDialog<T>({
  title,
  initialFormData,
  extractFormDataFromProfile,
  buildUpdatePayload,
  renderFormContent,
}: GenericProfileDialogProps<T>) {
  const { data, isLoading } = useProfileQuery();
  const updateProfile =
    useUpdatePartialProfileMutation<Partial<UpdateProfileDto>>();
  const profile = data?.profile;
  const user = data?.user;

  const [formData, setFormData] = useState<T>(initialFormData);
  const [initialized, setInitialized] = useState(false);
  const [lastProfileId, setLastProfileId] = useState<string | null>(null);

  // Reset initialization when profile ID changes (dialog reopened for different profile)
  useEffect(() => {
    const currentProfileId = profile?.id?.toString();
    if (currentProfileId && currentProfileId !== lastProfileId) {
      setInitialized(false);
      setLastProfileId(currentProfileId);
    }
  }, [profile?.id, lastProfileId]);

  useEffect(() => {
    if (profile && user && !initialized) {
      setFormData(extractFormDataFromProfile(profile, user));
      setInitialized(true);
    }
  }, [profile, user, extractFormDataFromProfile, initialized]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    console.log("GenericProfileDialog handleInputChange called with:", fieldName, value);
    console.log("Current formData before change:", formData);
    setFormData((prevData) => {
      const newData = { ...prevData, [fieldName]: value };
      console.log("New formData:", newData);
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    const payload = buildUpdatePayload(formData);

    updateProfile.mutate(payload, {
      onSuccess: () => {
        // Reset initialization flag after successful update to allow fresh data on next open
        setInitialized(false);
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <DialogContent>
      <DialogTitle className="text-lg font-semibold mb-4">{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {renderFormContent(formData, handleInputChange, setFormData)}

          <Button
            type="submit"
            className="w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
