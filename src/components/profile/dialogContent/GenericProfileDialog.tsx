"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode, useEffect, useState, useRef } from "react";
import {
  useProfileQuery,
  useUpdatePartialProfileMutation,
} from "@/hooks/react-query/profiles";

import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";
import { User } from "@/lib/routes/profiles/interfaces/user.interface";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { toast } from "@/hooks/use-toast";

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
  const updateProfile = useUpdatePartialProfileMutation<Partial<UpdateProfileDto>>({
    onFormReset: (updated) => {
      setFormData(extractFormDataFromProfile(updated, user!));
      toast({ title: 'Saved', description: 'Profile updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Update failed.' });
    },
  });
  const profile = data?.profile;
  const user = data?.user;

  const [formData, setFormData] = useState<T>(initialFormData);
  const [hasUserModifications, setHasUserModifications] = useState(false);
  const initialProfileData = useRef<T | null>(null);

  useEffect(() => {
    if (profile && user) {
      const extractedData = extractFormDataFromProfile(profile, user);
      
      // Only update formData if user hasn't made modifications
      if (!hasUserModifications) {
        setFormData(extractedData);
        initialProfileData.current = extractedData;
      }
    }
  }, [profile, user, extractFormDataFromProfile, hasUserModifications]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setHasUserModifications(true);
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(buildUpdatePayload(formData));
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
