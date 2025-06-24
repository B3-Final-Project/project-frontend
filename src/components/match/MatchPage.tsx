'use client';

import { Background } from '@/components/Background';
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
      setShowMatchSystem(true);
      setShowCardAnimation(false);
    }, 3000);
  };

  const handleProfileLoadingError = () => {
    setPackProfiles([]);
    setShowCardAnimation(false);
    setShowMatchSystem(false);
    setShouldFetchBoosters(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center">

          <div className="w-full max-w-4xl h-[60vh] flex items-center justify-center">
            {showMatchSystem ? (
              <div className="w-full h-full">
                <MatchSystem
                  profiles={packProfiles}
                  onMatch={() => {
                    // console.log('Match avec:', profile.name);
                  }}
                  onReject={() => {
                    // console.log('Profil rejeté:', profile.name);
                  }}
                />
              </div>
            ) : showCardAnimation ? (
              <div className="card-reveal-container relative w-full h-full flex items-center justify-center">
                {packProfiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    className="absolute w-[280px] sm:w-[320px] md:w-[350px]"
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      top: isMobile ? "80%" : "65%",
                      y: "-50%",
                      rotateY: 180,
                      x: 0,
                      zIndex: packProfiles.length - index
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      top: isMobile ? "80%" : "65%",
                      y: "-50%",
                      rotateY: 0,
                      x: isMobile ? `${(index - 2) * 15}px` : `${(index - 2) * 40}px`,
                      transition: {
                        delay: index * 0.2 + 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                    style={{ zIndex: packProfiles.length - index }}
                  >
                    <div
                      className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-xl p-[10px] shadow-2xl overflow-hidden"
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
                              <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                                <User size={16} className="text-blue-300" />
                                {profile.age} ans
                              </div>
                            )}
                            {profile.location && (
                              <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                                <MapPin size={16} className="text-red-400" />
                                {profile.location}
                              </div>
                            )}
                          </div>
                          <div className="text-white">
                            <h2 className="text-xl font-bold drop-shadow-md mb-1">{profile.name}</h2>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {profile.languages && profile.languages.length > 0 && (
                                <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                                  <Languages size={16} className="text-yellow-300" />
                                  {profile.languages.slice(0, 2).join(', ')}
                                </div>
                              )}
                              {profile.zodiac && (
                                <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                                  <Moon size={16} className="text-cyan-300" />
                                  {profile.zodiac}
                                </div>
                              )}
                              {profile.smoking && (
                                <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                                  <Cigarette size={16} className="text-red-300" />
                                  {profile.smoking}
                                </div>
                              )}
                              {profile.drinking && (
                                <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
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
              <div className="flex items-center justify-center h-full">
                {shouldFetchBoosters ? (
                  <>
                    <div className="text-white mb-4">Chargement des profils...</div>
                    <ProfileGenerator
                      count={5}
                      onProfilesLoaded={handleProfilesLoadedFromGenerator}
                      onError={handleProfileLoadingError}
                    />
                  </>
                ) : isVerified ? (
                  <div className="flex flex-col items-center justify-center w-full">
                    <h2 className="text-2xl font-bold mb-8 text-white text-center">Ouvrir un pack</h2>
                    <PackOpener onPackOpened={() => {
                      recordPackOpening();
                      setShouldFetchBoosters(true);
                    }} />
                  </div>
                ) : (
                  <div className="text-white mb-4">Chargement...</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
