import { UserRouter } from "@/lib/routes/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useAuth } from "react-oidc-context";

export function useDeleteAccountMutation() {
  const router = useRouter();
  const auth = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:() => UserRouter.deleteSelf(),
    onSuccess: () => {
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      })
      queryClient.invalidateQueries();
      auth.signoutSilent()
      router.replace('/')
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Erreur",
        description: JSON.stringify(error?.response?.data) || "Une erreur est survenue lors de la suppression du compte.",
        variant: "destructive",
      });
    },
  });
}
