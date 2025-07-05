'use client';

import { Loader } from "@/components/Loader";
import MatchPage from "@/components/match/MatchPage";
import { checkPackAvailability } from "@/utils/packManager";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import "../../../styles/pack-animations.css";

const BoosterOuverturePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boosterType = searchParams.get('type');
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const { canOpen } = checkPackAvailability();

    if (!boosterType || !canOpen) {
      if (!boosterType) {
        router.push('/boosters/list');
      } else if (!canOpen) {
        router.push('/boosters');
      }
    } else {
      setIsVerified(true);
    }

    setIsChecking(false);
  }, [boosterType, router]);

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return isVerified ? <MatchPage boosterType={boosterType} /> : null;
};

export default BoosterOuverturePage;
