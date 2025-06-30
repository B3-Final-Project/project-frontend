import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '../../../lib/routes/matches';

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getMatches,
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};

export const useRecentMatches = () => {
  return useQuery({
    queryKey: ['matches', 'recent'],
    queryFn: matchesApi.getRecentMatches,
    staleTime: 30000, // 30 secondes
  });
};

// Hook de fallback qui utilise tous les utilisateurs si l'API matches n'existe pas
export const useAllUsersAsMatches = () => {
  return useQuery({
    queryKey: ['matches', 'fallback'],
    queryFn: matchesApi.getAllUsers,
    staleTime: 30000, // 30 secondes
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};
