"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import { ProfileCardType } from "./ProfileGenerator";

type ProfileGridProps = {
  profiles: ProfileCardType[];
  openModal: (profile: ProfileCardType) => void;
  isGrayscale?: boolean;
};

export default function ProfileGrid({
  profiles,
  openModal,
  isGrayscale = false,
}: ProfileGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {profiles.map((profile) => (
        <motion.div
          key={profile.id}
          whileHover={{ scale: 1.03 }}
          className={`bg-gradient-to-br from-[#6A5ACD] ${isGrayscale ? "to-[#ED2272]" : "via-[#ED2272] to-[#FF6B6B]"} p-[1px] rounded-lg overflow-hidden ${isGrayscale ? "opacity-80" : ""}`}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
            <div
              className={`aspect-square overflow-hidden relative ${isGrayscale ? "grayscale" : ""}`}
            >
              <Image
                src={profile.image_url}
                fill={true}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2">
                <h3 className="text-primary-foreground  text-sm">
                  {profile.name}
                </h3>
                <div className="flex items-center gap-1">
                  <User
                    className={`${isGrayscale ? "text-gray-300" : "text-blue-300"} w-3 h-3`}
                  />
                  <p className="text-primary-foreground text-xs">
                    {profile.age || "?"} ans
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(profile);
                  }}
                  className="mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-primary-foreground text-xs hover:bg-white/30 transition-colors"
                >
                  Détails
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
