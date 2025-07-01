"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeyRound, Loader2, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authenticatedAxios } from "@/lib/auth-axios";
import { useAuth } from "react-oidc-context";
import { useAuthConfigReady } from "@/hooks/useAuthConfigReady";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  readonly isOpen: boolean;
  onClose(): void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { config } = useAuthConfigReady();
  const { toast } = useToast();

  const handleChangePassword = () => {
    if (!config) {
      toast({
        title: "Erreur",
        description: "Configuration d'authentification non disponible",
        variant: "destructive",
      });
      return;
    }

    // Redirect to Cognito's hosted UI for password change
    const clientId = config.userPoolClient;
    const cognitoDomain = config.hostedDomain;
    const redirectUri = config.callbackUrl;

    if (!clientId || !cognitoDomain || !redirectUri) {
      toast({
        title: "Erreur",
        description: "Configuration manquante pour le changement de mot de passe",
        variant: "destructive",
      });
      return;
    }

    // Build the URL for password change
    const changePasswordUrl = `${cognitoDomain}/forgotPassword?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.open(changePasswordUrl, '_blank');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );

    if (!confirmDelete) return;

    const doubleConfirm = window.confirm(
      "ATTENTION : Vous êtes sur le point de supprimer définitivement votre compte. Tapez 'SUPPRIMER' pour confirmer."
    );

    if (!doubleConfirm) return;

    setIsDeleting(true);

    try {
      // Call the API to delete the user account
      await authenticatedAxios.delete('/users/me');

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });

      // Sign out the user
      await auth.removeUser();

      // Redirect to home page
      router.push('/');
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Paramètres du compte</span>
          </DialogTitle>
          <DialogDescription>
            Gérez votre mot de passe et vos paramètres de compte.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <KeyRound className="h-4 w-4" />
            Changer le mot de passe
          </Button>

          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            className="w-full justify-start gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserX className="h-4 w-4" />
            )}
            {isDeleting ? "Suppression..." : "Supprimer le compte"}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
