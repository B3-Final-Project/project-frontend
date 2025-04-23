import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PreferenceRouter } from "@/lib/routes/preferences";
import { UpdatePreferenceDto } from "@/lib/routes/preferences/dto/update-preference.dto";
import { toast } from "@/hooks/use-toast";

// Fetch a single preference
export function usePreferenceQuery() {
  return useQuery({
    queryKey: ["preference"],
    queryFn: () => PreferenceRouter.getPreference(),
  });
}

// Fetch all preferences
export function useAllPreferencesQuery() {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: () => PreferenceRouter.getAllPreferences(),
  });
}

// Update a preference
export function useUpdatePreferenceMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferenceDto) => {
      return PreferenceRouter.updatePreference(data, { id: userId });
    },
    onSuccess: (updatedPreference) => {
      console.log("Preference updated", updatedPreference);
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast({
        title: "Profile saved",
        description: "Your profile preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update preference", error);
      toast({
        title: "Couldn't save your profil",
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    },
  });
}
