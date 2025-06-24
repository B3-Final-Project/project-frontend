import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import Image from "next/image";
import { useRef, useState } from 'react';

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
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpening) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragStartXRef.current = e.clientX - rect.left;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const dragDistance = currentX - dragStartXRef.current;
    const maxDistance = rect.width * 0.8;
    const progress = Math.min(100, Math.max(0, (dragDistance / maxDistance) * 100));

    setDragProgress(progress);

    if (progress >= 100) {
      openPack();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragProgress < 100) {
      setDragProgress(0);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragProgress(0);
  };

  const openPack = () => {
    if (isOpening) return;
    setIsOpening(true);

    const availableProfiles = profiles.length > 0 ? profiles : [];

    const randomIndex = Math.floor(Math.random() * availableProfiles.length);
    const selectedProfile = availableProfiles[randomIndex];

    setTimeout(() => {
      setIsOpening(false);
      setDragProgress(0);

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
    <div className="pack-button-container">
      <div className="flex justify-center mb-8">
        <div className="pack-button-container">
          <div className={clsx('pokemon-pack-3d', isDragging ?? 'dragging', isOpening ?? 'opening')}>
            <div className="pack-front">
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
                          <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground px-3 py-1 text-xs font-bold shadow-md flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {profile.age} ans
                          </div>
                          <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground px-3 py-1 text-xs font-bold shadow-md flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{profile.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{profile.description}</p>
                        <motion.button
                          className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-primary-foreground text-sm font-bold"
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
              <Image fill={true} src="/logo.svg" alt="Pokemon Pack" className="pack-image" />
              <div className="pack-shine"></div>
            </div>
          </div>

          <Button
            ref={buttonRef}
            className="open-pack-button"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            disabled={isOpening}
            type="button"
          >
            <div className="button-inner">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${dragProgress}%` }}
                ></div>
              </div>

              <span className="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="button-text">Ouvrir le Pack</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="mb-4 text-center text-lg font-semibold">
        {isDragging && (
          <div className="text-blue-500">
            {dragProgress > 70
              ? "Presque là! Continuez..."
              : dragProgress > 40
                ? "Continuez à tirer..."
                : "Tirez vers la droite pour ouvrir!"}
          </div>
        )}
        <div className="text-gray-500 mt-2">
          Progression: {Math.round(dragProgress)}%
        </div>
      </div>
    </div>
  );
};

export default PackOpener;
