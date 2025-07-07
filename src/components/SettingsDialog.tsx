"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Key, LogOut, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useAuthConfigReady } from "@/hooks/useAuthConfigReady";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDeleteAccountMutation } from "@/hooks/react-query/users";
import { NotificationSettings } from './NotificationSettings';
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  readonly isOpen: boolean;
  onClose(): void;
}

enum SettingsTab {
  NOTIFICATIONS = 'notifications',
  ACCOUNT = 'account'
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>(SettingsTab.NOTIFICATIONS);
  const auth = useAuth();
  const router = useRouter();
  const { config } = useAuthConfigReady();
  const { toast } = useToast();
  const deleteMutation = useDeleteAccountMutation();

  const handleChangePassword = () => {
    if (!config) {
      toast({ title: 'Erreur', description: 'Config manquante', variant: 'destructive' });
      return;
    }

    const { hostedDomain, userPoolClient, callbackUrl } = config;
    const url =
      `${hostedDomain}/forgotPassword` +
      `?client_id=${encodeURIComponent(userPoolClient)}` +
      `&response_type=code` +
      `&scope=openid+profile+email` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}`;

    // You can use window.location.assign if you want to replace history
    window.open(url, '_blank');
  };

    const handleSignOut = async () => {
    try {
      await auth.signoutSilent()
      router.replace('/')
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter. Veuillez réessayer.",
        variant: "destructive",
      });
    }
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
      deleteMutation.mutate()
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });

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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>
            Gérez vos préférences et votre compte
          </DialogDescription>
        </DialogHeader>

        {/* Onglets */}
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab(SettingsTab.NOTIFICATIONS)}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === SettingsTab.NOTIFICATIONS
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab(SettingsTab.ACCOUNT)}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === SettingsTab.ACCOUNT
                ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Compte
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="py-4">
          {activeTab === SettingsTab.NOTIFICATIONS && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Paramètres de notification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gérez vos préférences de notification pour les messages et matches.
                </p>
              </div>
              <NotificationSettings />
            </div>
          )}

          {activeTab === SettingsTab.ACCOUNT && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Gestion du compte</h3>
                <p className="text-sm text-gray-600">
                  Gérez votre compte et vos informations personnelles.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleChangePassword}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-red-700">Zone de danger</h4>
                  <p className="text-sm text-gray-600">
                    Ces actions sont irréversibles. Soyez certain de votre choix.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    disabled={isDeleting}
                    className="w-full"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Suppression en cours...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer mon compte
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
