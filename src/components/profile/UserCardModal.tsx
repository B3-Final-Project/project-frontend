"use client";

import { motion } from 'framer-motion';
import { Info, MapPin, User } from 'lucide-react';
import { useEffect, useState, useRef } from "react";

interface UserCardModalProps {
  readonly name?: string;
  readonly age?: number;
  readonly location?: string;
  readonly description?: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function UserCardModal({ name, age, location, description, isOpen, onClose }: UserCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
      setIsFlipped(false)
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const cardVariants = {
    hidden: { scale: 0, opacity: 0, rotateY: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30,
        duration: 0.6,
        delay: 0.1
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center mt-0"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <motion.div
        ref={modalRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        className="relative"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-[80vw] max-w-[400px] aspect-[7/10] perspective-1000 relative cursor-pointer"
          onClick={handleCardFlip}
          aria-label="Flip user card"
        >
          <motion.div
            className="w-full h-full transform-style-3d relative"
            animate={isFlipped ? 'back' : 'front'}
            variants={flipVariants}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Front side of the card */}
            <div className="w-full h-full rounded-xl p-[10px] bg-gradient-to-br from-[#FF6B6B] via-[#ED2272] to-[#6A5ACD] absolute backface-hidden shadow-2xl">
              <div
                className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: "url('/vintage.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent">
                  <div className="flex justify-between items-center p-3 sm:p-5 font-medium flex-wrap gap-2">
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                      <MapPin className="text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <p>{location ?? "Location"}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                      <User className="text-blue-300 w-4 h-4 sm:w-5 sm:h-5" />
                      <p>{age ?? 99} ans</p>
                    </div>
                  </div>

                  <div className="p-3 sm:p-5 font-bold flex flex-col items-start bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                    <h2 className="text-lg sm:text-xl md:text-2xl mb-1 drop-shadow-md">{name}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Back side of the card */}
            <div className="w-full h-full rounded-xl p-[10px] bg-gradient-to-br from-[#6A5ACD] via-[#00AEEF] to-[#4A90E2] absolute backface-hidden rotate-y-180 shadow-2xl">
              <div className="w-full h-full rounded-lg bg-gradient-to-b from-black/90 to-black/70 flex flex-col justify-center p-7 text-white">
                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <Info className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Description</h3>
                </div>
                <div className="mb-3 text-gray-200 leading-relaxed overflow-auto max-h-[300px] custom-scrollbar">
                  <p>
                    {description ??
                      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita at vero voluptatem, eum voluptate quia corrupti doloremque voluptatum quos obcaecati dicta eos distinctio ea earum eligendi odit reprehenderit! Iste, vitae!"}
                  </p>
                </div>
                <div className="mt-4 border-t border-white/20 pt-4 w-full">
                  <motion.p
                    className="text-sm text-center text-blue-200"

                  >
                    Cliquer pour revenir
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}