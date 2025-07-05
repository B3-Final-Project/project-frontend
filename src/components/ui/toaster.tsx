"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, onClick, ...props }) {
        const handleClick = (event: React.MouseEvent) => {
          // Empêcher la propagation pour éviter les conflits avec le bouton de fermeture
          event.stopPropagation();
          
          // Exécuter la fonction onClick si elle existe
          if (onClick) {
            onClick();
            // Ne pas fermer automatiquement les toasts avec onClick (ils se ferment après l'action)
          } else {
            // Si pas d'onClick, fermer automatiquement le toast
            dismiss(id);
          }
        };

        return (
          <Toast 
            key={id} 
            {...props}
            onClick={handleClick}
            className="cursor-pointer"
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
