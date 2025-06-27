'use client';

import { Loader } from "@/components/Loader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Booster } from "@/lib/routes/booster/interfaces/booster.interface";
import { checkPackAvailability, recordPackOpening } from '@/utils/packManager';
import { getRarityGradient } from '@/utils/rarityHelper';
import { motion } from 'framer-motion';
import { Cigarette, Languages, MapPin, Moon, User, Wine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MatchSystem from './MatchSystem';
import PackOpener from './PackOpener';
import ProfileGenerator, {
  mapBoosterToProfileCardType,
  ProfileCardType
} from "./ProfileGenerator";


const MatchPage = () => {
  const router = useRouter();
  const [packProfiles, setPackProfiles] = useState<ProfileCardType[]>([]);
  const [showMatchSystem, setShowMatchSystem] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  const [cardsExitAnimation, setCardsExitAnimation] = useState(false);
  const [matchSystemEntrance, setMatchSystemEntrance] = useState(false);
  const isMobile = useIsMobile();
  const [shouldFetchBoosters, setShouldFetchBoosters] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const { canOpen } = checkPackAvailability();
    if (!canOpen) {
      router.push('/boosters');
    } else {
      setIsVerified(true);
    }
  }, [router]);

  const handleProfilesLoadedFromGenerator = (boosters: Booster[]) => {
    const newProfiles = boosters.map(mapBoosterToProfileCardType);
    setPackProfiles(newProfiles);
    setShowCardAnimation(true);
    setShouldFetchBoosters(false);

    setTimeout(() => {
      setCardsExitAnimation(true);

      setTimeout(() => {
        setMatchSystemEntrance(true);
        setShowMatchSystem(true);

        setTimeout(() => {
          setShowCardAnimation(false);
        }, 300);
      }, 250);
    }, 3000);
  };

  const handleProfileLoadingError = () => {
    setPackProfiles([]);
    setShowCardAnimation(false);
    setShowMatchSystem(false);
    setShouldFetchBoosters(false);
  };

  return (

    <div className="w-full h-full flex items-center justify-center">
      {showMatchSystem ? (
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: matchSystemEntrance ? 1 : 0,
            scale: matchSystemEntrance ? 1 : 0.9,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <MatchSystem
            profiles={packProfiles}
          />
        </motion.div>
      ) : showCardAnimation ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {packProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="absolute w-[280px] sm:w-[320px] md:w-[350px]"
              initial={{
                opacity: 0,
                scale: 0.5,
                top: "50%",
                y: "-50%",
                rotateY: 180,
                x: 0,
                zIndex: packProfiles.length - index
              }}
              animate={{
                opacity: cardsExitAnimation ? 0 : 1,
                scale: cardsExitAnimation ? 0.9 : 1,
                top: "50%",
                y: "-50%",
                rotateY: cardsExitAnimation ? 10 : 0,
                x: isMobile ? `${(index - 2) * 15}px` : `${(index - 2) * 40}px`,
                transition: cardsExitAnimation
                  ? {
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.05 * (packProfiles.length - index - 1)
                  }
                  : {
                    delay: index * 0.2 + 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
              }}
              style={{ zIndex: packProfiles.length - index }}
            >
              <div
                className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-xl p-[10px] shadow-xl overflow-hidden"
                style={{ background: getRarityGradient(profile.rarity) }}
              >
                <div
                  className="w-full h-full rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${profile.image_url || '/vintage.png'})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                    <div className="flex justify-between items-start">
                      {profile.age && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                          <User size={16} className="text-blue-300" />
                          {profile.age} ans
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                          <MapPin size={16} className="text-red-400" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                    <div className="text-background">
                      <h2 className="text-background drop-shadow-md mb-1">{profile.name}</h2>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {profile.languages && profile.languages.length > 0 && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                            <Languages size={16} className="text-yellow-300" />
                            {profile.languages.slice(0, 2).join(', ')}
                          </div>
                        )}
                        {profile.zodiac && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                            <Moon size={16} className="text-cyan-300" />
                            {profile.zodiac}
                          </div>
                        )}
                        {profile.smoking && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                            <Cigarette size={16} className="text-red-300" />
                            {profile.smoking}
                          </div>
                        )}
                        {profile.drinking && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full">
                            <Wine size={16} className="text-purple-300" />
                            {profile.drinking}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {shouldFetchBoosters ? (
            <>
              <Loader />
              <ProfileGenerator
                count={5}
                onProfilesLoaded={handleProfilesLoadedFromGenerator}
                onError={handleProfileLoadingError}
              />
            </>
          ) : isVerified ? (
            <div className="flex flex-col items-center justify-center w-full">
              <PackOpener onPackOpened={() => {
                recordPackOpening();
                setShouldFetchBoosters(true);
              }} />
            </div>
          ) : (
            <Loader />
          )}
        </>
      )}
    </div>

  );
};

export default MatchPage;
