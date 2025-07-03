'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { checkPackAvailability } from "@/utils/packManager";
import MatchPage from "@/components/match/MatchPage";
import "../../../styles/pack-animations.css";
import { Loader } from "@/components/Loader";

const BoosterOuverturePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boosterType = searchParams.get('type');
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Vérifier que l'utilisateur a un type de booster et n'a pas atteint sa limite
    const { canOpen } = checkPackAvailability();
    
    // Vérifications:
    // 1. L'utilisateur doit avoir un type de booster spécifié dans l'URL
    // 2. L'utilisateur ne doit pas avoir atteint sa limite de boosters
    if (!boosterType || !canOpen) {
      // Rediriger vers la page appropriée
      if (!boosterType) {
        // Si pas de type, rediriger vers la liste des boosters
        router.push('/boosters/list');
      } else if (!canOpen) {
        // Si limite atteinte, rediriger vers la page principale
        router.push('/boosters');
      }
    } else {
      // Tout est vérifié, l'utilisateur peut accéder à la page
      setIsVerified(true);
    }
    
    setIsChecking(false);
  }, [boosterType, router]);
  
  // Afficher un loader pendant la vérification
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }
  
  // Afficher le composant MatchPage uniquement si les vérifications sont passées
  return isVerified ? <MatchPage boosterType={boosterType} /> : null;
};

export default BoosterOuverturePage;
