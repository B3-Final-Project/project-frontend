'use client';

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Info, MapPin, User, UserCheck, UserX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      const savedMatches = localStorage.getItem('holomatch-matches');
      return savedMatches ? JSON.parse(savedMatches) : [];
    }
    return [];
  });

  const [nonMatches, setNonMatches] = useState<ProfileCardType[]>(() => {
    if (typeof window !== 'undefined') {
      const savedNonMatches = localStorage.getItem('holomatch-nonmatches');
      return savedNonMatches ? JSON.parse(savedNonMatches) : [];
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
      if (window.innerWidth >= 1024) {
        return {
          height: '520px',
          width: '350px'
        };
      } else if (window.innerWidth >= 768) {
        return {
          height: '480px',
          width: '320px'
        };
      }
    }
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

    if (typeof window !== 'undefined') {
      localStorage.setItem('holomatch-matches', JSON.stringify(updatedMatches));
    }

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

    if (typeof window !== 'undefined') {
      localStorage.setItem('holomatch-nonmatches', JSON.stringify(updatedNonMatches));
    }

    if (onReject) onReject(profile);

    setTimeout(() => {
      setShowRejectAnimation(false);
      moveToNextCard();
    }, 800);
  };

  const moveToNextCard = () => {
    if (currentIndex < currentProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetMatches = () => {
    setMatches([]);
    setNonMatches([]);
    setCurrentIndex(0);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('holomatch-matches');
      localStorage.removeItem('holomatch-nonmatches');
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;

    if (offset > 100 && currentProfile) {
      handleMatch(currentProfile);
    } else if (offset < -100 && currentProfile) {
      handleReject(currentProfile);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      <div className="container mx-auto py-10 space-y-6 relative z-10 flex flex-col items-center w-full h-screen">
        <header className="text-center mb-6">
          <p className="text-muted-foreground">Glissez à droite pour matcher, à gauche pour passer</p>
        </header>

        <div className="flex justify-between w-full max-w-md mb-4">
          <motion.div
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNonMatchList(true)}
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">{nonMatches.length}</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMatchList(true)}
          >
            <span className="text-white font-medium">{matches.length}</span>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-full">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
          </motion.div>
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
            <motion.div
              drag="x"
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              style={{
                x,
                rotate,
                height: cardSize.height,
                width: cardSize.width,
              }}
              className="absolute cursor-grab active:cursor-grabbing"
              whileTap={{ scale: 1.05 }}
            >
              <div className="w-full h-full rounded-xl p-[10px] bg-gradient-to-br from-[#FF6B6B] via-[#ED2272] to-[#6A5ACD] absolute shadow-2xl">
                <div
                  className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${currentProfile.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent">
                    <div className="flex justify-between items-center p-3 sm:p-5 font-medium flex-wrap gap-2">
                      <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                        <MapPin className="text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <p>{currentProfile.location || "Inconnu"}</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                        <User className="text-blue-300 w-4 h-4 sm:w-5 sm:h-5" />
                        <p>{currentProfile.age || "?"} ans</p>
                      </div>
                    </div>

                    <div className="p-3 sm:p-5 font-bold flex flex-col items-start bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                      <h2 className="text-lg sm:text-xl md:text-2xl mb-1 drop-shadow-md">{currentProfile.name}</h2>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Info className="text-purple-300 w-4 h-4 sm:w-5 sm:h-5" />
                        <p className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[250px]">{currentProfile.description || "Pas de description"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match indicator */}
              <motion.div
                className="absolute top-5 right-5 bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full shadow-lg"
                style={{ opacity: matchOpacity }}
              >
                <Heart className="w-8 h-8 text-white" fill="white" />
              </motion.div>

              {/* Reject indicator */}
              <motion.div
                className="absolute top-5 left-5 bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full shadow-lg"
                style={{ opacity: rejectOpacity }}
              >
                <X className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Plus de profils disponibles</h3>
              <p className="text-muted-foreground mb-4">Revenez plus tard pour découvrir de nouveaux profils</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={resetMatches}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-medium"
                >
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        {currentIndex < currentProfiles.length && (
          <div className="flex gap-6 mt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full shadow-lg"
              onClick={() => currentProfile && handleReject(currentProfile)}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full shadow-lg"
              onClick={() => currentProfile && handleMatch(currentProfile)}
            >
              <Heart className="w-6 h-6 text-white" fill="white" />
            </motion.button>
          </div>
        )}

        {/* Match Animation */}
        <AnimatePresence>
          {showMatchAnimation && matchedProfile && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-1 rounded-xl shadow-2xl max-w-sm w-full"
              >
                <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center">
                  <div className="mb-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Heart className="w-16 h-16 text-pink-500" fill="#ec4899" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">C'est un match!</h2>
                  <p className="text-gray-300 text-center mb-4">
                    Vous avez matché avec <span className="font-semibold text-blue-300">{matchedProfile.name}</span>
                  </p>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 mb-2">
                    <img
                      src={matchedProfile.image}
                      alt={matchedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reject Animation */}
        <AnimatePresence>
          {showRejectAnimation && (
            <motion.div
              className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-full shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <span className="text-white font-medium">Profil passé</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match List Modal */}
        <AnimatePresence>
          {showMatchList && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-gradient-to-br from-[#6A5ACD] via-[#ED2272] to-[#FF6B6B] p-1 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh]"
              >
                <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 h-full overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" fill="#ec4899" />
                      Vos matches ({matches.length})
                    </h2>
                    <button
                      onClick={() => setShowMatchList(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-gray-400 mb-2">Vous n'avez pas encore de matches</p>
                      <p className="text-gray-500 text-sm">Continuez à swiper pour trouver des matches!</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2">
                      <div className="grid grid-cols-2 gap-3">
                        {matches.map((profile) => (
                          <motion.div
                            key={profile.id}
                            whileHover={{ scale: 1.03 }}
                            className="bg-gradient-to-br from-[#FF6B6B] via-[#ED2272] to-[#6A5ACD] p-[1px] rounded-lg overflow-hidden"
                          >
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                              <div className="aspect-square overflow-hidden relative">
                                <img
                                  src={profile.image}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2">
                                  <h3 className="text-white font-bold text-sm">{profile.name}</h3>
                                  <div className="flex items-center gap-1">
                                    <User className="text-blue-300 w-3 h-3" />
                                    <p className="text-white text-xs">{profile.age || "?"} ans</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Non-Match List Modal */}
        <AnimatePresence>
          {showNonMatchList && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-gradient-to-br from-[#6A5ACD] via-[#ED2272] to-[#FF6B6B] p-1 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh]"
              >
                <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 h-full overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" />
                      Profils passés ({nonMatches.length})
                    </h2>
                    <button
                      onClick={() => setShowNonMatchList(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {nonMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-gray-400 mb-2">Vous n'avez pas encore passé de profils</p>
                      <p className="text-gray-500 text-sm">Swipez à gauche pour passer un profil</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2">
                      <div className="grid grid-cols-2 gap-3">
                        {nonMatches.map((profile) => (
                          <motion.div
                            key={profile.id}
                            whileHover={{ scale: 1.03 }}
                            className="bg-gradient-to-br from-[#6A5ACD] to-[#ED2272] p-[1px] rounded-lg overflow-hidden opacity-80"
                          >
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
                              <div className="aspect-square overflow-hidden relative grayscale">
                                <img
                                  src={profile.image}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2">
                                  <h3 className="text-white font-bold text-sm">{profile.name}</h3>
                                  <div className="flex items-center gap-1">
                                    <User className="text-gray-300 w-3 h-3" />
                                    <p className="text-white text-xs">{profile.age || "?"} ans</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
