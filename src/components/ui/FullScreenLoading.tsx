import { Loader } from 'lucide-react';
import React from 'react';

export const FullScreenLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-pulse rounded-lg bg-card p-6 text-center shadow-xl">
        <p className="text-lg font-semibold text-foreground">Chargement en cours...</p>
        <Loader className="animate-spin" />
      </div>
    </div>
  );
};