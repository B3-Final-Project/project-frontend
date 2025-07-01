'use client';

import { AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  checkPackAvailability
} from '../../utils/packManager';
import { UserCardModal } from '../UserCardModal';
import ControlButtons from './ControlButtons';

import { ProfileCardType } from "@/components/match/ProfileGenerator";
import { useMatchActions } from '@/hooks/react-query/matches';
import { Loader } from 'lucide-react';
import MatchCounters from './MatchCounters';
import MatchListModal from './MatchListModal';
import NonMatchListModal from './NonMatchListModal';
import ProfileCard from './ProfileCard';

type MatchSystemProps = {
  profiles: ProfileCardType[];
  onMatch?: (profile: ProfileCardType) => void;
  onReject?: (profile: ProfileCardType) => void;
};

const SESSION_STORAGE_PACK_PAID_KEY = 'holomatch_current_pack_paid_for_session';
const MAX_PACKS_PER_WINDOW = 2;

export default function MatchSystem({ profiles }: MatchSystemProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<ProfileCardType[]>([]);
  const [nonMatches, setNonMatches] = useState<ProfileCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardSize, setCardSize] = useState(getCardSize());
  const [showMatchList, setShowMatchList] = useState(false);
  const [showNonMatchList, setShowNonMatchList] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ProfileCardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [packStatus, setPackStatus] = useState({
    canOpen: true,
    remainingPacks: MAX_PACKS_PER_WINDOW,
  });
  const [countdown, setCountdown] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const matchOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const rejectOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const { likeMatch, passMatch } = useMatchActions();

  const refreshPackStatusAndCountdown = useCallback(() => {
    const { canOpen, timeUntilNextOpenMs, packsOpenedInWindow } = checkPackAvailability();
    const remainingInWindow = MAX_PACKS_PER_WINDOW - (packsOpenedInWindow || 0);

    setPackStatus({ canOpen: canOpen, remainingPacks: remainingInWindow });

    if (!canOpen && timeUntilNextOpenMs && timeUntilNextOpenMs > 0) {
      setCountdown(timeUntilNextOpenMs);
    } else {
      setCountdown(0);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const isPackPaidForSession = sessionStorage.getItem(SESSION_STORAGE_PACK_PAID_KEY) === 'true';

    if (!isPackPaidForSession) {
      const { canOpen: canCurrentlyOpen } = checkPackAvailability();
      if (canCurrentlyOpen) {
        sessionStorage.setItem(SESSION_STORAGE_PACK_PAID_KEY, 'true');
      }
    }
    refreshPackStatusAndCountdown();
    setIsLoading(false);
  }, [profiles, refreshPackStatusAndCountdown]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (!packStatus.canOpen && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1000) {
            clearInterval(timerId);
            refreshPackStatusAndCountdown();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [packStatus.canOpen, countdown, refreshPackStatusAndCountdown]);

  useEffect(() => {
    if (!isLoading && currentIndex >= profiles.length && profiles.length > 0) {
      sessionStorage.removeItem(SESSION_STORAGE_PACK_PAID_KEY);
      router.push('/boosters');
    }
  }, [profiles, currentIndex, isLoading, router]);

  useEffect(() => {
    setMatches([]);
    setNonMatches([]);
    setCurrentIndex(0);
    x.set(0);
  }, [profiles, x]);

  function getCardSize() {
    if (typeof window !== 'undefined') {
      let size = { height: 'min(420px, 70vh)', width: 'min(280px, 85vw)' };
      if (window.innerWidth >= 768) size = { height: 'min(480px, 75vh)', width: 'min(320px, 90vw)' };
      if (window.innerWidth >= 1024) size = { height: 'min(520px, 80vh)', width: 'min(350px, 95vw)' };
      return size;
    }
    return { height: 'min(420px, 70vh)', width: 'min(280px, 85vw)' };
  }

  useEffect(() => {
    const handleResize = () => setCardSize(getCardSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMatch = (profile: ProfileCardType) => {
    if (isProcessing) return; // Evite les clics multiples
    setIsProcessing(true);

    likeMatch(profile.id);

    // Mise à jour de matchedProfile supprimée
    const updatedMatches = [...matches, profile];
    setMatches(updatedMatches);

    setTimeout(() => {
      // Réinitialisation de matchedProfile supprimée
      moveToNextCard();
      setIsProcessing(false);
    }, 1500);
  };

  const handleReject = (profile: ProfileCardType) => {
    if (isProcessing) return;
    setIsProcessing(true);

    passMatch(profile.id);

    const updatedNonMatches = [...nonMatches, profile];
    setNonMatches(updatedNonMatches);

    setTimeout(() => {
      moveToNextCard();
      setIsProcessing(false);
    }, 1000);
  };

  const moveToNextCard = () => {
    setCurrentIndex(current => {
      let nextIdx = current + 1;
      while (nextIdx < profiles.length) {
        const profileToCheck = profiles[nextIdx];
        const isInMatches = matches.some(m => m.id === profileToCheck.id);
        const isInNonMatches = nonMatches.some(nm => nm.id === profileToCheck.id);
        if (!isInMatches && !isInNonMatches) break;
        nextIdx++;
      }
      x.set(0);
      return nextIdx;
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x; // PanInfo contient offset.x
    if (offset > 100 && currentProfile) handleMatch(currentProfile);
    else if (offset < -100 && currentProfile) handleReject(currentProfile);
  };

  const openModal = (profile: ProfileCardType) => {
    setSelectedCard(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto px-4 py-6 sm:py-10 relative z-10 flex flex-col items-center w-full h-screen">
        <MatchCounters
          matchesCount={matches.length}
          nonMatchesCount={nonMatches.length}
          setShowMatchList={setShowMatchList}
          setShowNonMatchList={setShowNonMatchList}
        />

        <div
          ref={constraintsRef}
          className="relative flex items-center justify-center"
          style={{ height: cardSize.height, width: cardSize.width }}
        >
          {currentProfile ? (
            <ProfileCard
              profile={currentProfile}
              cardSize={cardSize}
              x={x}
              rotate={rotate}
              matchOpacity={matchOpacity}
              rejectOpacity={rejectOpacity}
              constraintsRef={constraintsRef}
              handleDragEnd={handleDragEnd}
              openModal={openModal}
            />
          ) : (
            <Loader />
          )}
        </div>
        {currentProfile && (
          <ControlButtons
            currentProfile={currentProfile}
            handleMatch={handleMatch}
            handleReject={handleReject}
          />
        )}
        <AnimatePresence>
          {showMatchList && (
            <MatchListModal
              key="match-list-modal"
              showMatchList={showMatchList}
              setShowMatchList={setShowMatchList}
              matches={matches}
              openModal={openModal}
            />
          )}
          {showNonMatchList && (
            <NonMatchListModal
              key="non-match-list-modal"
              showNonMatchList={showNonMatchList}
              setShowNonMatchList={setShowNonMatchList}
              nonMatches={nonMatches}
              openModal={openModal}
            />
          )}
        </AnimatePresence>
      </div>
      {selectedCard && (
        <UserCardModal
          name={selectedCard.name}
          age={selectedCard.age}
          location={selectedCard.location}
          isOpen={isModalOpen}
          onClose={closeModal}
          images={selectedCard.images || ['/vintage.png', '/vintage.png', '/vintage.png']}
          image_url={selectedCard.image_url}
          rarity={selectedCard.rarity}
          interests={selectedCard.interests?.map(interest => interest.name)}
          languages={selectedCard.languages}
          zodiac={selectedCard.zodiac}
          smoking={selectedCard.smoking}
          drinking={selectedCard.drinking}
        />
      )}
    </div>
  );
}
