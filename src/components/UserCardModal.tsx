"use client";

import "swiper/css";
import "swiper/css/pagination";
import "../styles/card-flip.css";

import {
  ArrowLeft,
  Cigarette,
  Flag,
  Info,
  Languages,
  MapPin,
  Moon,
  User,
  Wine
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Pagination } from "swiper/modules";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { ReportUserModal } from "@/components/ReportUserModal";
import { getRarityGradient } from "@/utils/rarityHelper";
import { motion } from "framer-motion";

interface UserCardModalProps {
  user: ProfileCardType
  isOpen: boolean;
  isConnectedUser?: boolean;
  onCloseAction(): void;
}

export function UserCardModal({
  user,
  isOpen,
  isConnectedUser = false,
  onCloseAction,
}: Readonly<UserCardModalProps>) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  let imageList: string[];
  if (user.images && user.images.length > 0) {
    imageList = user.images;
  } else if (user.image_url) {
    imageList = [user.image_url];
  } else {
    imageList = ['/vintage.png', '/vintage.png', '/vintage.png'];
  }

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const flipToFront = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("flipToFront appelé!", new Date().toISOString());
    setIsFlipped(false);
    if (isReportModalOpen) return;
    setIsFlipped((f) => !f);
  };

  const handleClickOutside = useCallback((e: Event) => {
    if (isReportModalOpen) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCloseAction();
      setIsFlipped(false)
    }
  }, [isReportModalOpen, onCloseAction]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [handleClickOutside, isOpen]);

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
          <motion.div className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] md:w-[380px] md:h-[550px] perspective-1000 relative">
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={isFlipped ? "back" : "front"}
              variants={flipVariants}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Front side of the card */}
              <div
                className="w-full h-full rounded-xl p-[10px] absolute shadow-2xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  background: getRarityGradient(user.rarity),
                }}
              >
                <div className="w-full h-full rounded-lg overflow-hidden relative">
                  {/* Swiper pour le slider d'images */}
                  <Swiper
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                      bulletActiveClass: "swiper-pagination-bullet-active",
                      bulletClass: "swiper-pagination-bullet",
                    }}
                    modules={[Pagination]}
                    className="w-full h-full relative z-10"
                  >
                    {imageList.map((image, index) => (
                      <SwiperSlide
                        key={`swiper-slide-${image}-${index}`}
                        className="bg-black flex items-center justify-center"
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${image || "/vintage.png"})`,
                          }}
                        ></div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div className="absolute bottom-4 w-full flex justify-center z-20 swiper-pagination"></div>

                  <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/30 p-3 absolute top-0 left-0 pointer-events-none z-10">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2 items-center pointer-events-auto">
                        {user.age && (
                          <div className="flex gap-1 items-center text-white text-sm bg-black/50 px-2 py-1 rounded-full shadow-md">
                            <User size={14} />
                            <span>{user.age} ans</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex gap-1 items-center text-white text-sm bg-black/50 px-2 py-1 rounded-full shadow-md">
                            <MapPin size={14} />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleCardFlip}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white cursor-pointer transition-all duration-200 ease-in-out z-50 shadow-md pointer-events-auto hover:bg-black/80 hover:scale-110 active:scale-95"
                        aria-label="Voir plus d'informations"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <div className="text-primary-foreground pointer-events-auto mt-auto mb-5">
                      <h2 className="text-xl drop-shadow-md mb-1 text-primary-foreground">
                        {user.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 pt-1 pointer-events-auto">
                        {user.languages && user.languages.length > 0 && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full pointer-events-auto">
                            <Languages size={16} className="text-yellow-300" />
                            {user.languages.slice(0, 2).join(", ")}
                          </div>
                        )}
                        {user.zodiac && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full pointer-events-auto">
                            <Moon size={16} className="text-cyan-300" />
                            {user.zodiac}
                          </div>
                        )}
                        {user.smoking && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full pointer-events-auto">
                            <Cigarette size={16} className="text-red-300" />
                            {user.smoking}
                          </div>
                        )}
                        {user.drinking && (
                          <div className="flex items-center gap-1 text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full pointer-events-auto">
                            <Wine size={16} className="text-purple-300" />
                            {user.drinking}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back side of the card */}
              <div
                className="w-full h-full rounded-xl p-[10px] absolute shadow-2xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: getRarityGradient(user.rarity),
                }}
              >
                <div className="w-full h-full rounded-lg bg-gradient-to-b from-black/90 to-black/70 flex flex-col justify-start p-5 text-primary-foreground relative">
                  <div className="absolute top-5 left-5 z-50 pointer-events-auto">
                    <button
                      onClick={flipToFront}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-black/60 text-white cursor-pointer transition-all duration-200 ease-in-out z-50 shadow-md hover:bg-black/80 hover:scale-110 active:scale-95"
                      aria-label="Retour aux photos"
                      type="button"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  </div>

                  {!isConnectedUser && (
                    <div className="absolute top-5 right-5 z-50 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReportModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-sm bg-red-500/80 hover:bg-red-600/90 text-white px-2 py-1 rounded-full transition-all duration-200 ease-in-out cursor-pointer pointer-events-auto shadow-lg z-50 hover:scale-110 active:scale-95"
                        aria-label="Report user"
                        type="button"
                      >
                        <Flag size={14} />
                        Report
                      </button>
                    </div>
                  )}

                  <div className="mt-2 mb-6 text-center pt-3">
                    <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-2 text-lg">
                      <Info className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                      Interests
                    </h3>
                  </div>

                  <div className="mb-3 text-gray-200 leading-relaxed overflow-auto max-h-[300px] p-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-black/20">
                    {user.interests && user.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.interests.slice(0, 3).map((interest, index) => (
                          <span
                            key={index}
                            className="bg-white/20 px-3 py-1 rounded-full text-sm"
                          >
                            {interest.prompt}
                            {interest.answer}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-white/20 pt-4 w-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Report Modal - Outside the card structure */}
        <ReportUserModal
          open={isReportModalOpen}
          setIsOpen={setIsReportModalOpen}
          user={user}
        />
      </motion.div>
  );
}
