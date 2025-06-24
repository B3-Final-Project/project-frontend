'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { ProfileCardType } from './MatchSystem';

type MatchAnimationProps = {
  readonly showMatchAnimation: boolean; // Added readonly
  readonly matchedProfile: ProfileCardType | null; // Added readonly
};

export default function MatchAnimation({ showMatchAnimation, matchedProfile }: MatchAnimationProps) {
  if (!showMatchAnimation || !matchedProfile) return null;

  return (
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
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
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
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500" fill="#ec4899" />
            </motion.div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-2">C'est un match!</h2>
          <p className="text-gray-300 text-center mb-4">
            Vous avez matché avec <span className="font-semibold text-blue-300">{matchedProfile.name}</span>
          </p>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 sm:border-4 border-blue-500 mb-2">
            <Image
              src={matchedProfile.image}
              alt={matchedProfile.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
