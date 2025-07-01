"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import {
  useProfileQuery,
  useUpdatePartialProfileMutation,
} from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";

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

  useEffect(() => {
    if (profile && user) {
      setFormData(extractFormDataFromProfile(profile, user));
    }
  }, [profile, user, extractFormDataFromProfile]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;
    const payload = buildUpdatePayload(formData);

    updateProfile.mutate(payload);
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
