import { Background } from '@/components/Background';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MatchSystem, { ProfileCardType } from './MatchSystem';
import PackOpener from './PackOpener';
import { generateProfiles } from './ProfileGenerator';

const MatchPage = () => {
  const [packProfiles, setPackProfiles] = useState<ProfileCardType[]>([]);
  const [isPackOpened, setIsPackOpened] = useState(false);
  const [showMatchSystem, setShowMatchSystem] = useState(false);
  const [showCardAnimation, setShowCardAnimation] = useState(false);

  const handlePackOpened = () => {
    const newProfiles = generateProfiles(5);
    setPackProfiles(newProfiles);
    setIsPackOpened(true);
    setShowCardAnimation(true);

    setTimeout(() => {
      setShowMatchSystem(true);
      setShowCardAnimation(false);
    }, 3000);
  };

  const handleReturnToPackOpening = () => {
    setPackProfiles([]);
    setIsPackOpened(false);
    setShowMatchSystem(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />

      <div className="container mx-auto py-10 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-8">Trouvez votre match</h1>

          <div className="w-full max-w-4xl h-[60vh] flex items-center justify-center">
            {showMatchSystem ? (
              <div className="w-full h-full">
                <MatchSystem
                  profiles={packProfiles}
                  onMatch={(profile) => console.log('Match avec:', profile.name)}
                  onReject={(profile) => console.log('Profil rejeté:', profile.name)}
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
                      top: "40%",
                      y: "-50%",
                      rotateY: 180,
                      x: 0,
                      zIndex: packProfiles.length - index
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      top: "40%",
                      y: "-50%",
                      rotateY: 0,
                      x: `${(index - 2) * 40}px`,
                      transition: {
                        delay: index * 0.2 + 0.5,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }
                    }}
                    style={{ zIndex: packProfiles.length - index }}
                  >
                    <div className="w-full h-[420px] sm:h-[480px] md:h-[520px] rounded-xl p-[10px] bg-gradient-to-br from-[#FF6B6B] via-[#ED2272] to-[#6A5ACD] shadow-2xl">
                      <div
                        className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundImage: `url(${profile.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent">
                          <div className="flex justify-between items-center p-3 sm:p-5 font-medium flex-wrap gap-2">
                            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 w-4 h-4 sm:w-5 sm:h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              <p>{profile.location || "Inconnu"}</p>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300 w-4 h-4 sm:w-5 sm:h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              <p>{profile.age || "?"} ans</p>
                            </div>
                          </div>
                          <div className="p-3 sm:p-5">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{profile.name}</h3>
                            <p className="text-sm text-gray-200 line-clamp-3">{profile.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <PackOpener onPackOpened={handlePackOpened} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
