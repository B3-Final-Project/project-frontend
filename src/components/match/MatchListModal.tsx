'use client';

import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import ProfileGrid from './ProfileGrid';
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";

type MatchListModalProps = {
  showMatchList: boolean;
  setShowMatchList: (show: boolean) => void;
  matches: ProfileCardType[];
  openModal: (profile: ProfileCardType) => void;
};

export default function MatchListModal({ showMatchList, setShowMatchList, matches, openModal }: MatchListModalProps) {
  if (!showMatchList) return <></>;

  return (
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
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" fill="#ec4899" />
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
              <p className="text-gray-400 mb-2">Vous n&#39;avez pas encore de matches</p>
              <p className="text-gray-500 text-sm">Continuez à swiper pour trouver des matches!</p>
            </div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2">
              <ProfileGrid profiles={matches} openModal={openModal} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
