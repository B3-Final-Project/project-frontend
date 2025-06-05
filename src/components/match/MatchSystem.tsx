'use client';

import { AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { UserCardModal } from '../profile/UserCardModal';
import ControlButtons from './ControlButtons';
import EmptyCardState from './EmptyCardState';
import MatchAnimation from './MatchAnimation';
import MatchCounters from './MatchCounters';
import MatchListModal from './MatchListModal';
import NonMatchListModal from './NonMatchListModal';
import ProfileCard from './ProfileCard';
import RejectAnimation from './RejectAnimation';

export type ProfileCardType = {
  id: string;
  name: string;
  image: string;
  age?: number;
  location?: string;
  description?: string;
  isRevealed?: boolean;
};

type MatchSystemProps = {
  profiles: ProfileCardType[];
  onMatch?: (profile: ProfileCardType) => void;
  onReject?: (profile: ProfileCardType) => void;
};

export default function MatchSystem({ profiles, onMatch, onReject }: MatchSystemProps) {
  const [currentProfiles, setCurrentProfiles] = useState<ProfileCardType[]>(profiles);
  const [matches, setMatches] = useState<ProfileCardType[]>(() => {
    if (typeof window !== 'undefined') {
    }
    return [];
  });

  const [nonMatches, setNonMatches] = useState<ProfileCardType[]>(() => {
    if (typeof window !== 'undefined') {
    }
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardSize, setCardSize] = useState(getCardSize());
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showRejectAnimation, setShowRejectAnimation] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<ProfileCardType | null>(null);
  const [showMatchList, setShowMatchList] = useState(false);
  const [showNonMatchList, setShowNonMatchList] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ProfileCardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const matchOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const rejectOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const constraintsRef = useRef(null);

  useEffect(() => {
    const matchIds = matches.map(match => match.id);
    const nonMatchIds = nonMatches.map(nonMatch => nonMatch.id);
    const filteredProfiles = profiles.filter(
      profile => !matchIds.includes(profile.id) && !nonMatchIds.includes(profile.id)
    );
    setCurrentProfiles(filteredProfiles);
  }, [profiles, matches, nonMatches]);

  const currentProfile = currentProfiles[currentIndex];

  // Handle card size based on device
  // Because Tailwind doesn't support dynamic values
  function getCardSize() {
    if (typeof window !== 'undefined') {
      // Mobile first approach - start with mobile size as default
      let size = {
        height: 'min(420px, 70vh)',
        width: 'min(280px, 85vw)'
      };

      // Then scale up for larger screens
      if (window.innerWidth >= 768) {
        size = {
          height: 'min(480px, 75vh)',
          width: 'min(320px, 90vw)'
        };
      }

      if (window.innerWidth >= 1024) {
        size = {
          height: 'min(520px, 80vh)',
          width: 'min(350px, 95vw)'
        };
      }

      return size;
    }

    // Default fallback for SSR
    return {
      height: 'min(420px, 70vh)',
      width: 'min(280px, 85vw)'
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setCardSize(getCardSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle card match
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
    setCurrentIndex((prevIndex) => prevIndex + 1);
    x.set(0); // Reset card position
  };

  const resetMatches = () => {
    setMatches([]);
    setNonMatches([]);
    setCurrentIndex(0);
  };

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;

    if (offset > 100 && currentProfile) {
      handleMatch(currentProfile);
    } else if (offset < -100 && currentProfile) {
      handleReject(currentProfile);
    }
  };

  const openModal = (profile: ProfileCardType) => {
    setSelectedCard(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto px-4 py-6 sm:py-10 relative z-10 flex flex-col items-center w-full h-screen">
        {/* Match Counters */}
        <MatchCounters 
          matchesCount={matches.length}
          nonMatchesCount={nonMatches.length}
          setShowMatchList={setShowMatchList}
          setShowNonMatchList={setShowNonMatchList}
        />
        
        {/* Reject Animation - Positioned between counters and card */}
        <div className="h-12 sm:h-16 relative w-full">
          <AnimatePresence>
            {showRejectAnimation && (
              <div className="absolute top-1/2 left-0 right-0 flex justify-center z-50 -translate-y-1/2">
                <RejectAnimation
                  key="reject-animation"
                  showRejectAnimation={showRejectAnimation}
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Stack */}
        <div
          ref={constraintsRef}
          className="relative flex items-center justify-center"
          style={{
            height: cardSize.height,
            width: cardSize.width,
          }}
        >
          {currentIndex < currentProfiles.length ? (
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
            <EmptyCardState resetMatches={resetMatches} />
          )}
        </div>

        {/* Control Buttons */}
        {currentIndex < currentProfiles.length && (
          <ControlButtons
            currentProfile={currentProfile}
            handleMatch={handleMatch}
            handleReject={handleReject}
          />
        )}

        {/* Match Animation */}
        <AnimatePresence>
          {showMatchAnimation && (
            <MatchAnimation
              key="match-animation"
              showMatchAnimation={showMatchAnimation}
              matchedProfile={matchedProfile}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
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
