import { clsx } from "clsx";
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';

interface UserCard {
  id: string;
  name: string;
  image?: string;
  age?: number;
  location?: string;
  description?: string;
  isRevealed?: boolean;
}

interface PackOpenerProps {
  onPackOpened: (selectedCard?: UserCard) => void;
  profiles?: UserCard[];
}

const PackOpener = ({ onPackOpened, profiles = [] }: PackOpenerProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const isHoldingRef = useRef(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startHoldAnimation = () => {
    let startTime = Date.now();
    const duration = 2000; // 2 seconds to complete

    const animate = () => {
      if (!isHoldingRef.current) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);

      setHoldProgress(progress);

      if (progress >= 100) {
        openPack();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpening) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isHoldingRef.current = true;
    setIsHolding(true);

    startHoldAnimation();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isHoldingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isHoldingRef.current = false;
    setIsHolding(false);

    if (holdProgress < 100) {
      setHoldProgress(0);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isHoldingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isHoldingRef.current = false;
    setIsHolding(false);
    setHoldProgress(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  const openPack = () => {
    if (isOpening) return;
    setIsOpening(true);

    const availableProfiles = profiles.length > 0 ? profiles : [];

    const randomIndex = Math.floor(Math.random() * availableProfiles.length);
    const selectedProfile = availableProfiles[randomIndex];

    setTimeout(() => {
      setIsOpening(false);
      setHoldProgress(0);

      if (selectedProfile) {
        onPackOpened(selectedProfile);
      } else {
        onPackOpened();
      }
    }, 1000);
  };

  const handleCardClick = (_profile: UserCard) => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={clsx(
          'pokemon-pack-3d relative mb-8 cursor-pointer select-none',
          isHolding ? 'holding' : '',
          isOpening ? 'opening' : ''
        )}
      >
        {profiles && profiles.length > 0 && (
          <div className="profiles-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {profiles.map((profile) => (
              <motion.div
                key={profile.id}
                className="profile-card cursor-pointer bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-1 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(profile)}
                style={{
                  width: 'calc(100% - 1rem)',
                  maxWidth: '350px',
                  margin: '0 auto'
                }}
              >
                <div className="card-inner bg-white rounded-lg p-4 h-full flex flex-col">
                  {profile.image && (
                    <div className="relative profile-image mb-3 rounded-lg overflow-hidden">
                      <Image fill={true} src={profile.image} alt={profile.name} className="w-full h-40 object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground px-3 py-1 text-xs  shadow-md flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {profile.age} ans
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground px-3 py-1 text-xs  shadow-md flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </div>
                  </div>
                  <h3 className="mb-2 text-background">{profile.name}</h3>
                  <motion.button
                    className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground text-sm "
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(profile);
                    }}
                  >
                    Voir le profil
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <div
        ref={circleRef}
        className="w-[200px] h-[200px] mb-[75px] rounded-full bg-primary/20 flex items-center justify-center cursor-pointer shadow-lg select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: isHolding ? `scale(${1 + (holdProgress / 100) * 1.5})` : 'scale(1)',
          transition: isHolding ? 'none' : 'transform 0.3s ease'
        }}
      >
        <div className="relative w-[110px] h-[110px] rounded-full bg-primary/80 flex items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-center text-sm w-[90%] leading-tight z-10 drop-shadow-md">
            Rester appuyé pour ouvrir
          </div>
        </div>
      </div>
    </>
  );
};

export default PackOpener;
