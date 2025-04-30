"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';

interface UserCardModalProps {
  name: string;
  age?: number;
  location?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserCardModal({
                                name,
                                age,
                                location,
                                description,
                                isOpen,
                                onClose,
                              }: UserCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const cardVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5,
        delay: 0.1
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
      <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
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
        >
          <button
              className="w-[300px] h-[440px] md:w-[350px] md:h-[490px] lg:w-[400px] lg:h-[540px] perspective-1000 relative cursor-pointer"
              onClick={handleCardFlip}
          >
            <div
                className={`w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
            >
              {/* Front side of the card */}
              <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#ED2272] to-[#00AEEF] absolute backface-hidden">
                <div
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    style={{
                      backgroundImage: "url('/vintage.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                >
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center text-background p-4 font-semibold">
                      <p>{location || "Location"}</p>
                      <p>Type</p>
                    </div>

                    <div className="text-background p-4 font-semibold">
                      <p>{name}</p>
                      <p>{age}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back side of the card */}
              <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#00AEEF] to-[#ED2272] absolute backface-hidden rotate-y-180">
                <div className="w-full h-full rounded-lg bg-black/80 flex flex-col justify-center p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="mb-3">
                    {description ||
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita at vero voluptatem, eum voluptate quia corrupti doloremque voluptatum quos obcaecati dicta eos distinctio ea earum eligendi odit reprehenderit! Iste, vitae!"}
                  </p>
                  <div className="mt-4 border-t border-white/30 pt-4 w-full">
                    <p className="text-sm text-center">Cliquer pour revenir</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </motion.div>
  );
}