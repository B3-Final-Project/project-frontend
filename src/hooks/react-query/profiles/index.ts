import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileRouter } from "@/lib/routes/profiles";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { toast } from "@/hooks/use-toast";
import {
  LifestyleInfo,
  LocationWorkInfo, PersonalInfo,
  PreferenceInfo
} from "@/hooks/useProfileCreation";

// Fetch a single profile
export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileRouter.getProfile(),
  });
}

// Fetch all profiles
export function useAllProfilesQuery() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => ProfileRouter.getAllProfiles(),
  });
}

// Update a profile
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return ProfileRouter.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Profile saved",
        description: "Your profile profiles have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update profile", error);
      toast({
        title: "Couldn't save your profil",
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    },
  });
}

export function useUpdatePartialProfileMutation<T extends PreferenceInfo | LifestyleInfo | LocationWorkInfo | PersonalInfo>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T) => {
      return ProfileRouter.updatePartialProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Profile saved",
        description: "Your profile profiles have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update profile", error);
      toast({
        title: "Couldn't save your profil",
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    },
  });
}

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return ProfileRouter.createProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast({
        title: "Profile saved",
        description: "Your profile profiles have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update profile", error);
      toast({
        title: "Couldn't save your profil",
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    },
  });
}
