import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileRouter } from "@/lib/routes/profiles";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { removeImage, sendImage } from "@/lib/utils";

// Fetch a single profile
export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileRouter.getProfile(),
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    refetchOnMount: false
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

export function useUpdatePartialProfileMutation<T extends Partial<UpdateProfileDto>>() {
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
  const router = useRouter();

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
      router.push("/profile");
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

interface UploadImageParams {
  file: File;
  index: number;
}

interface RemoveImageParams {
  index: number;
}

export function useImageMutations() {
  const queryClient = useQueryClient();

  const uploadImageMutation = useMutation({
    mutationFn: async ({ file, index }: UploadImageParams) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await sendImage({formData, index});
      return { ...response, index };
    },
    onSuccess: () => {
      toast({
        title: "Image uploaded",
        description: "Your profile image has been uploaded successfully.",
      });

      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image.",
        variant: "destructive",
      });
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: async ({ index }: RemoveImageParams) => {
      // Call your API to remove the image
      const response = await removeImage({index});
      return { ...response, index };
    },
    onSuccess: () => {
      toast({
        title: "Image removed",
        description: "Your profile image has been removed.",
      });

      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Remove failed:", error);
      toast({
        title: "Remove failed",
        description: "There was a problem removing your image.",
        variant: "destructive",
      });
    },
  });

  return {
    uploadImage: uploadImageMutation.mutate,
    removeImage: removeImageMutation.mutate,
    isUploading: uploadImageMutation.isPending,
    isRemoving: removeImageMutation.isPending,
    uploadError: uploadImageMutation.error,
    removeError: removeImageMutation.error,
  };
}
