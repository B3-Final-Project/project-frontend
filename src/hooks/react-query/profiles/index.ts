import { removeImage, sendImage } from "@/lib/utils";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { GetProfileResponse } from "@/lib/routes/profiles/response/get-profile.response";
import { ProfileRouter } from "@/lib/routes/profiles";
import { UpdateProfileDto } from "@/lib/routes/profiles/dto/update-profile.dto";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/lib/routes/profiles/interfaces/profile.interface";

// Fetch a single profile
export function useProfileQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileRouter.getProfile(),
    retry: false,
    enabled,
  });
}

// Fetch a profile by ID
export function useProfileByIdMutation(id: string) {
  return useMutation({
    mutationKey: ["profile", id],
    mutationFn: async () => ProfileRouter.getProfileById(undefined, { id }),
    onSuccess: (data: GetProfileResponse) => {
      return data;
    },
    onError: (error: unknown) => {
      console.error("Failed to fetch profile by ID", error);
      toast({
        title: "Profile not found",
        description: "The requested profile could not be found.",
        variant: "destructive",
      });
    },
  });
}

// Fetch all profiles with infinite scrolling
export function useAllProfilesQuery(
  sortBy?: "reportCount" | "createdAt",
  sortOrder?: "ASC" | "DESC",
  searchTerm?: string,
) {
  return useInfiniteQuery({
    queryKey: ["profiles", sortBy, sortOrder, searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const params: Record<string, string | number> = {
        offset: pageParam,
        limit: 10,
      };

      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (sortOrder) {
        params.sortOrder = sortOrder;
      }
      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim();
      }

      try {
        return await ProfileRouter.getAllProfiles(params);
      } catch (error) {
        // If sorting fails, try again without sorting parameters
        if (sortBy || sortOrder) {
          console.warn(
            "Sorting failed, retrying without sort parameters:",
            error,
          );
          const fallbackParams: Record<string, string | number> = {
            offset: pageParam,
            limit: 10,
          };
          if (searchTerm && searchTerm.trim() !== "") {
            fallbackParams.search = searchTerm.trim();
          }
          return await ProfileRouter.getAllProfiles(fallbackParams);
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, we've reached the end
      if (lastPage.profiles.length < 10) {
        return undefined;
      }
      // Return the next offset
      return allPages.length * 10;
    },
    initialPageParam: 0,
  });
}

interface Options {
  onFormReset: (updated: Profile) => void;
  onError?: (error: unknown) => void;
}

export function useUpdatePartialProfileMutation<
  T extends Partial<UpdateProfileDto>
>(opts: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: T) => ProfileRouter.updatePartialProfile(data),
    onSuccess: (updated) => {
      // First, blow away the old cache
      queryClient.invalidateQueries({queryKey: ['profile']});

      // Then let component handle its own state
      opts.onFormReset(updated);
    },
    onError: opts.onError,
  });
}

export function useCreateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return ProfileRouter.createProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Failed to update profile", error);
      toast({
        title: "Couldn't save your profil",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    },
  });
}

interface UploadImageParams {
  profileId: number;
  file: File;
  index?: number;
}

interface RemoveImageParams {
  profileId: number;
  index: number;
}

export function useImageMutations() {
  const queryClient = useQueryClient();

  const uploadImageMutation = useMutation({
    mutationFn: async ({ profileId, file, index }: UploadImageParams) => {
      const formData = new FormData();
      formData.append("image", file);

      return await sendImage(profileId, formData, index);
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
    mutationFn: async ({ profileId, index }: RemoveImageParams) => {
      // Call your API to remove the image
      const response = await removeImage({ profileId, index });
      return { ...response, profileId, index };
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
