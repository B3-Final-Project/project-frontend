'use client';

import { motion } from 'framer-motion';

type RejectAnimationProps = {
  showRejectAnimation: boolean;
};

export default function RejectAnimation({ showRejectAnimation }: RejectAnimationProps) {
  if (!showRejectAnimation) return null;

  return (
    <motion.div 
      className="bg-gradient-to-r from-red-500 to-pink-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg whitespace-nowrap z-50 pointer-events-none"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <span className="text-white text-sm sm:text-base font-medium">Profil passé</span>
    </motion.div>
  );
}
