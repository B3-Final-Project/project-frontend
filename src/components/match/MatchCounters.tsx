'use client';

import { motion } from 'framer-motion';
import { UserCheck, UserX } from 'lucide-react';

type MatchCountersProps = {
  matchesCount: number;
  nonMatchesCount: number;
  setShowMatchList: (show: boolean) => void;
  setShowNonMatchList: (show: boolean) => void;
};

export default function MatchCounters({
  matchesCount,
  nonMatchesCount,
  setShowMatchList,
  setShowNonMatchList
}: MatchCountersProps) {
  return (
    <div className="flex justify-between w-full max-w-xs sm:max-w-sm md:max-w-md ">
      <motion.div
        className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNonMatchList(true)}
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-1.5 sm:p-2 rounded-full">
          <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <span className="text-black text-sm sm:text-base font-medium">{nonMatchesCount}</span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-full cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMatchList(true)}
      >
        <span className="text-black text-sm sm:text-base font-medium">{matchesCount}</span>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1.5 sm:p-2 rounded-full">
          <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
      </motion.div>
    </div>
  );
}
