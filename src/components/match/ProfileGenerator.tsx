import { BoosterRouter } from '@/lib/routes/booster';
import { Booster } from '@/lib/routes/booster/interfaces/booster.interface';
import { useQuery } from '@tanstack/react-query'; // Ou 'react-query' si tu utilises une version plus ancienne
import React from 'react';
import MatchSystem, { ProfileCardType } from './MatchSystem';
import { FullScreenLoading } from '../ui/FullScreenLoading';



const BOOSTER_COUNT = 5;

// Fonction pour récupérer les boosters depuis le backend
export const fetchBoosters = (count: number): Promise<Booster[]> => {
  // BoosterRouter.getBooster est une fonction qui attend (body, params)
  // Pour une requête GET sans body, on passe undefined pour le body.
  // Le 'count' est passé dans l'objet params pour remplacer :count dans le chemin de l'URL.
  return BoosterRouter.getBooster(undefined, { count: count.toString() });
};

// Fonction pour mapper les données Booster vers ProfileCardType
export const mapBoosterToProfileCardType = (booster: Booster): ProfileCardType => {
  let mainImage = '/default-avatar.png'; // Image par défaut, assure-toi qu'elle existe dans /public
  if (booster.avatarUrl) {
    mainImage = booster.avatarUrl;
  } else if (booster.images && booster.images.length > 0 && booster.images[0]) {
    mainImage = booster.images[0]; // Prend la première image de la liste
  }

  return {
    id: booster.id.toString(), // L'ID du profil (Profile.id)
    name: booster.userProfile?.name || 'Utilisateur Holomatch', // Nom de l'utilisateur (accès sécurisé)
    image: mainImage,
    age: booster.userProfile?.age, // Âge de l'utilisateur (accès sécurisé)
    location: booster.city, // Ville du profil
    description: booster.work || `Découvre ${booster.userProfile?.name || 'cette personne'} !`,
    isRevealed: true, // Par défaut, ou selon ta logique
  };
};

const ProfileGenerator: React.FC = () => {
  const {
    data: boosterData,
    isLoading,
    isError,
    error,
  } = useQuery<Booster[], Error>({
    queryKey: ['boosters', BOOSTER_COUNT],
    queryFn: () => fetchBoosters(BOOSTER_COUNT),
    // enabled: !!getAuthToken(), // Optionnel: n'exécute la requête que si un token est disponible.
    // Assure-toi que getAuthToken() est synchrone si tu l'utilises.
  });

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4 text-center">
        <p className="font-bold text-lg mb-2">Erreur lors du chargement des profils</p>
        {/* Affiche le message d'erreur. L'erreur est déjà un objet Error grâce au typage de useQuery. */}
        <p className="text-sm">{error?.message || 'Une erreur inconnue est survenue.'}</p>
        <p className="text-xs mt-2">Vérifiez votre connexion internet, la configuration de l'API, et que vous êtes bien authentifié (token JWT valide).</p>
      </div>
    );
  }

  const profilesToDisplay: ProfileCardType[] = React.useMemo(() => {
    return boosterData ? boosterData.map(mapBoosterToProfileCardType) : [];
  }, [boosterData]);

  if (profilesToDisplay.length === 0 && !isLoading) { // Vérifie aussi !isLoading pour éviter un flash de ce message
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Aucun profil à afficher pour le moment.
      </div>
    );
  }

  return <MatchSystem profiles={profilesToDisplay} />;
};

export default ProfileGenerator;