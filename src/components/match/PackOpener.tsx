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


  const circleRef = useRef<HTMLDivElement>(null);
  const isHoldingRef = useRef(false);

  const animationFrameRef = useRef<number | null>(null);

  const startHoldAnimation = () => {
    let startTime = Date.now();
    const duration = 1500;

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


  return (
    <div className="flex flex-col items-center justify-center w-full relative">

      <div
        ref={circleRef}
        className="w-[200px] h-[200px] rounded-full bg-primary/20 flex items-center justify-center cursor-pointer shadow-lg select-none fixed mb-[75px]"
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
    </div>
  );
};

export default PackOpener;
