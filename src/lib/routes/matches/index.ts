import { authenticatedAxios } from '../../auth-axios';
import { User } from '../profiles/interfaces/user.interface';

export const matchesApi = {
  // Récupérer tous les matches (utilisateurs avec qui on peut discuter)
  getMatches: async (): Promise<User[]> => {
    const response = await authenticatedAxios.get('/matches');
    return response.data;
  },

  // Récupérer les matches récents
  getRecentMatches: async (): Promise<User[]> => {
    const response = await authenticatedAxios.get('/matches/recent');
    return response.data;
  },

  // Pour l'instant, on utilise getAllProfiles comme fallback
  getAllUsers: async (): Promise<User[]> => {
    const response = await authenticatedAxios.get('/profiles/all');
    // Transformer les données du backend en format User
    const backendData = response.data;
    
    // Si c'est déjà un tableau, le retourner tel quel
    if (Array.isArray(backendData)) {
      return backendData;
    }
    
    // Si c'est un objet avec une propriété qui contient le tableau
    if (backendData && typeof backendData === 'object') {
      // Chercher une propriété qui pourrait contenir le tableau
      const possibleArrayProps = Object.values(backendData).filter(val => Array.isArray(val));
      if (possibleArrayProps.length > 0) {
        return possibleArrayProps[0];
      }
    }
    
    // Fallback: retourner un tableau vide
    console.warn('Format de données inattendu pour /profiles/all:', backendData);
    return [];
  },
}; 