'use client';

import { motion, MotionValue } from 'framer-motion';
import { Heart, Info, MapPin, User, X } from 'lucide-react';
import { ProfileCardType } from './MatchSystem';

type ProfileCardProps = {
  profile: ProfileCardType;
  cardSize: { height: string; width: string };
  x: MotionValue<number>;
  rotate: MotionValue<number>;
  matchOpacity: MotionValue<number>;
  rejectOpacity: MotionValue<number>;
  constraintsRef: React.RefObject<HTMLDivElement>;
  handleDragEnd: (event: any, info: any) => void;
  openModal: (profile: ProfileCardType) => void;
};

export default function ProfileCard({
  profile,
  cardSize,
  x,
  rotate,
  matchOpacity,
  rejectOpacity,
  constraintsRef,
  handleDragEnd,
  openModal,
}: ProfileCardProps) {
  return (
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
            backgroundImage: `url(${profile.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent">
            <div className="flex justify-between items-center p-3 sm:p-5 font-medium flex-wrap gap-2">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                <MapPin className="text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
                <p>{profile.location || "Inconnu"}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                <User className="text-blue-300 w-4 h-4 sm:w-5 sm:h-5" />
                <p>{profile.age || "?"} ans</p>
              </div>
            </div>

            <div className="p-3 sm:p-5 font-bold flex flex-col items-start bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
              <h2 className="text-lg sm:text-xl md:text-2xl mb-1 drop-shadow-md">{profile.name}</h2>
              <div className="flex items-center gap-1 sm:gap-2">
                <Info className="text-purple-300 w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[250px]">{profile.description || "Pas de description"}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(profile);
                }}
                className="mt-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs hover:bg-white/30 transition-colors"
              >
                Voir plus de détails
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match indicator */}
      <motion.div
        className="absolute top-3 sm:top-5 right-3 sm:right-5 bg-gradient-to-r from-green-400 to-blue-500 p-2 sm:p-3 rounded-full shadow-lg"
        style={{ opacity: matchOpacity }}
      >
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="white" />
      </motion.div>

      {/* Reject indicator */}
      <motion.div
        className="absolute top-3 sm:top-5 left-3 sm:left-5 bg-gradient-to-r from-red-500 to-pink-500 p-2 sm:p-3 rounded-full shadow-lg"
        style={{ opacity: rejectOpacity }}
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.div>
    </motion.div>
  );
}
