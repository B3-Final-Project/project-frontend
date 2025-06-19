import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProfileCardType } from './ProfileGenerator';

interface ProfileDisplayProps {
  profiles: ProfileCardType[];
  onFinish: () => void;
}

const ProfileDisplay = ({ profiles, onFinish }: ProfileDisplayProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4">
        <motion.h2
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Vos profils sont prêts !
        </motion.h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 mb-3 overflow-hidden">
                  <Image
                    src={profile.image_url || '/img.png'}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                <p className="text-sm text-gray-300">{profile.age} ans • {profile.location}</p>
                <p className="mt-2 text-sm text-gray-400 text-center line-clamp-3">{profile.description}</p>
              </div>
            </motion.div>
          ))}
        </div>


        <motion.button
          className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold shadow-lg"
          onClick={onFinish}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + profiles.length * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Commencer à matcher
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
