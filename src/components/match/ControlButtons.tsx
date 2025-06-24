import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { ProfileCardType } from './ProfileGenerator';

type ControlButtonsProps = {
  currentProfile: ProfileCardType | undefined;
  handleMatch: (profile: ProfileCardType) => void;
  handleReject: (profile: ProfileCardType) => void;
};

export default function ControlButtons({ currentProfile, handleMatch, handleReject }: ControlButtonsProps) {
  return (
    <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-red-500 to-pink-500 p-3 sm:p-4 rounded-full shadow-lg"
        onClick={() => currentProfile && handleReject(currentProfile)}
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-green-400 to-blue-500 p-3 sm:p-4 rounded-full shadow-lg"
        onClick={() => currentProfile && handleMatch(currentProfile)}
      >
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
      </motion.button>
    </div>
  );
}
