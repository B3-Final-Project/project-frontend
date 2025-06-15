'use client';

import { ProfileCreationApi, useProfileCreation as useHookProfileCreation } from '@/hooks/useProfileCreation';
import React, { ReactNode, createContext, useContext } from 'react';

const ProfileCreationContext = createContext<ProfileCreationApi | null>(null);

export function ProfileCreationProvider({ children, basePath = "/profile" }: Readonly<{ children: ReactNode; basePath?: string }>) {
  const api = useHookProfileCreation(basePath);
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
