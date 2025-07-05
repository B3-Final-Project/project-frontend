/**
 * Composants réutilisables pour les états de l'interface
 */

import { LoadingState } from '../messages/LoadingState';
import { EmptyState } from '../messages/EmptyState';

interface StatusStatesProps {
  readonly isLoading?: boolean;
  readonly isEmpty?: boolean;
  readonly loadingMessage?: string;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly children?: React.ReactNode;
}

/**
 * Composant qui gère automatiquement les états de chargement et d'absence de données
 */
export function StatusStates({ 
  isLoading = false, 
  isEmpty = false, 
  loadingMessage = "Chargement...", 
  emptyTitle = "Aucune donnée", 
  emptyDescription = "Aucune donnée disponible pour le moment.", 
  children 
}: StatusStatesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingState message={loadingMessage} size="lg" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Composant pour les états de chargement simples
 */
export function LoadingWrapper({ 
  isLoading, 
  message = "Chargement...", 
  size = "sm" as const,
  children 
}: { 
  readonly isLoading: boolean; 
  readonly message?: string; 
  readonly size?: "sm" | "lg";
  readonly children?: React.ReactNode;
}) {
  if (isLoading) {
    return <LoadingState message={message} size={size} />;
  }

  return <>{children}</>;
}

/**
 * Composant pour les états d'absence de données
 */
export function EmptyWrapper({ 
  isEmpty, 
  title = "Aucune donnée", 
  description = "Aucune donnée disponible pour le moment.",
  children 
}: { 
  readonly isEmpty: boolean; 
  readonly title?: string; 
  readonly description?: string;
  readonly children?: React.ReactNode;
}) {
  if (isEmpty) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState title={title} description={description} />
      </div>
    );
  }

  return <>{children}</>;
} 