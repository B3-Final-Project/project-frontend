"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import ProfileGrid from "./ProfileGrid";
import { ProfileCardType } from "@/lib/routes/profiles/dto/profile-card-type.dto";

type NonMatchListModalProps = {
  showNonMatchList: boolean;
  nonMatches: ProfileCardType[];
  setShowNonMatchList(show: boolean): void;
  openModal(profile: ProfileCardType): void;
};

export default function NonMatchListModal({
  showNonMatchList,
  setShowNonMatchList,
  nonMatches,
  openModal,
}: NonMatchListModalProps) {
  if (!showNonMatchList) return null;

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
            <h2 className="text-lg sm:text-xl  text-primary-foreground flex items-center gap-1.5 sm:gap-2">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              Skipped profiles ({nonMatches.length})
            </h2>
            <button
              onClick={() => setShowNonMatchList(false)}
              className="text-gray-400 hover:text-primary-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {nonMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-400 mb-2">
                You haven't skipped any profiles yet
              </p>
              <p className="text-gray-500 text-sm">
                Swipe left to skip a profile
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2">
              <ProfileGrid
                profiles={nonMatches}
                openModal={openModal}
                isGrayscale={true}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
