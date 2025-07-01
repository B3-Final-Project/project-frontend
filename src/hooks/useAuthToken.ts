"use client";

import { useState, useEffect } from 'react';
import { User } from 'oidc-client-ts';

// Fonction pour décoder le token JWT et extraire l'ID utilisateur
const decodeJwtToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
};

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getTokenFromSession = (): string | null => {
      if (typeof window === 'undefined') return null;

      try {
        // Scanner toutes les clés sessionStorage pour trouver l'entrée oidc.user
        const keys = Object.keys(sessionStorage);
        for (const key of keys) {
          if (key.startsWith('oidc.user:')) {
            const userJson = sessionStorage.getItem(key);
            if (userJson) {
              const user: User = JSON.parse(userJson);
              if (user?.access_token) {
                return user?.access_token;
              }
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse OIDC user data:', error);
      }

      return null;
    };

    // Récupérer le token initial
    const initialToken = getTokenFromSession();
    setToken(initialToken);

    // Écouter les changements dans sessionStorage
    const handleStorageChange = () => {
      const newToken = getTokenFromSession();
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les changements dans sessionStorage (pour le même onglet)
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key?.startsWith('oidc.user:')) {
        handleStorageChange();
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  return token;
};

// Hook pour récupérer l'ID de l'utilisateur connecté
export const useCurrentUserId = () => {
  const token = useAuthToken();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const decoded = decodeJwtToken(token);
      if (decoded?.sub) {
        setUserId(decoded.sub);
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  return userId;
}; 