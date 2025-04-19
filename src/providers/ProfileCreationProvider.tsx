'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useProfileCreation as useHookProfileCreation, ProfileCreationApi } from '@/hooks/useProfileCreation';

const ProfileCreationContext = createContext<ProfileCreationApi | null>(null);

export function ProfileCreationProvider({ children }: { children: ReactNode }) {
  const api = useHookProfileCreation();
  return (
    <ProfileCreationContext.Provider value={api}>
      {children}
    </ProfileCreationContext.Provider>
  );
}

export function useProfileCreation(): ProfileCreationApi {
  const context = useContext(ProfileCreationContext);
  if (!context) {
    throw new Error('useProfileCreation must be used within ProfileCreationProvider');
  }
  return context;
}
