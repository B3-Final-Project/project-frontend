'use client';

import { AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  canOpenNewPack,
  getRemainingPacksToday,
  getTimeUntilNextPackAvailability,
  recordPackOpened
} from '../../utils/packManager';
import { UserCardModal } from '../profile/UserCardModal';
import ControlButtons from './ControlButtons';
import EmptyCardState from './EmptyCardState';
import MatchAnimation from './MatchAnimation';
import MatchCounters from './MatchCounters';
import MatchListModal from './MatchListModal';
import NonMatchListModal from './NonMatchListModal';
import ProfileCard from './ProfileCard';
import RejectAnimation from './RejectAnimation';
import { ProfileCardType } from "@/components/match/ProfileGenerator";

type MatchSystemProps = {
  profiles: ProfileCardType[];
  onMatch?: (profile: ProfileCardType) => void;
  onReject?: (profile: ProfileCardType) => void;
};

const SESSION_STORAGE_PACK_PAID_KEY = 'holomatch_current_pack_paid_for_session';

export default function MatchSystem({ profiles, onMatch, onReject }: MatchSystemProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<ProfileCardType[]>([]);
  const [nonMatches, setNonMatches] = useState<ProfileCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardSize, setCardSize] = useState(getCardSize());
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showRejectAnimation, setShowRejectAnimation] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<ProfileCardType | null>(null);
  const [showMatchList, setShowMatchList] = useState(false);
  const [showNonMatchList, setShowNonMatchList] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ProfileCardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [packStatus, setPackStatus] = useState({
    canOpen: true,
    remainingToday: 0,
  });
  const [countdown, setCountdown] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const matchOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const rejectOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const constraintsRef = useRef<HTMLDivElement>(null);

  const refreshPackStatusAndCountdown = useCallback(() => {
    const canUserOpen = canOpenNewPack();
    const remaining = getRemainingPacksToday();
    const timeToNext = getTimeUntilNextPackAvailability();

    setPackStatus({ canOpen: canUserOpen, remainingToday: remaining });

    if (!canUserOpen && timeToNext > 0) {
      setCountdown(timeToNext);
    } else {
      setCountdown(0);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const isPackPaidForSession = sessionStorage.getItem(SESSION_STORAGE_PACK_PAID_KEY) === 'true';

    if (!isPackPaidForSession) {
      if (canOpenNewPack()) {
        recordPackOpened();
        sessionStorage.setItem(SESSION_STORAGE_PACK_PAID_KEY, 'true');
      }
    }
    refreshPackStatusAndCountdown();
    setIsLoading(false);
  }, [profiles, refreshPackStatusAndCountdown]);

  // Effect for Countdown Timer
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
      refreshPackStatusAndCountdown();
    }
  }, [currentIndex, profiles.length, isLoading, refreshPackStatusAndCountdown]);

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
    setMatchedProfile(profile);
    setShowMatchAnimation(true);
    const updatedMatches = [...matches, profile];
    setMatches(updatedMatches);
    if (onMatch) onMatch(profile);
    setTimeout(() => {
      setShowMatchAnimation(false);
      setMatchedProfile(null);
      moveToNextCard();
    }, 1500);
  };

  const handleReject = (profile: ProfileCardType) => {
    setShowRejectAnimation(true);
    const updatedNonMatches = [...nonMatches, profile];
    setNonMatches(updatedNonMatches);
    if (onReject) onReject(profile);
    setTimeout(() => {
      setShowRejectAnimation(false);
      moveToNextCard();
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

  const handleStartNewSession = () => {
    if (canOpenNewPack()) {
      recordPackOpened();
      sessionStorage.setItem(SESSION_STORAGE_PACK_PAID_KEY, 'true');

      setMatches([]);
      setNonMatches([]);
      setCurrentIndex(0);

      refreshPackStatusAndCountdown();
      refreshPackStatusAndCountdown();
    } else {
      console.warn("handleStartNewSession: Tentative d'ouverture de pack, mais aucun disponible. Rafraîchissement du statut.");
      refreshPackStatusAndCountdown();
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
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
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white">
        Chargement...
      </div>
    );
  }

  if (!packStatus.canOpen && countdown > 0) {
    router.replace('/match/wait');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4">
        <p className="text-lg">Redirection vers la page d&#39;attente...</p>
      </div>
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
        <div className="h-12 sm:h-16 relative w-full">
          <AnimatePresence>
            {showRejectAnimation && (
              <div className="absolute top-1/2 left-0 right-0 flex justify-center z-50 -translate-y-1/2">
                <RejectAnimation key="reject-animation" showRejectAnimation={showRejectAnimation} />
              </div>
            )}
          </AnimatePresence>
        </div>
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
            <EmptyCardState
              onStartNewSession={handleStartNewSession}
              remainingPacks={packStatus.remainingToday}
            />
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
          {showMatchAnimation && (
            <MatchAnimation
              key="match-animation"
              showMatchAnimation={showMatchAnimation}
              matchedProfile={matchedProfile}
            />
          )}
        </AnimatePresence>
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
          description={selectedCard.description}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
