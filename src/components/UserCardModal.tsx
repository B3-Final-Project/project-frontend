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
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { ReportUserModal } from "@/components/ReportUserModal";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";
import { getRarityGradient } from "@/utils/rarityHelper";
import { motion } from "framer-motion";
import { Pagination } from "swiper/modules";

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
  const [interestIndex, setInterestIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Constante pour les images par défaut
  const DEFAULT_IMAGES = ['/vintage.png'];

  // Détermination des images à utiliser avec une approche plus propre
  const imageList: string[] = Array.isArray(user.images) && user.images.length > 0
    ? user.images
    : user.image_url
      ? [user.image_url]
      : DEFAULT_IMAGES;

  // Réinitialiser l'index des intérêts quand l'utilisateur change
  useEffect(() => {
    if (isOpen) {
      setInterestIndex(0);
    }
  }, [isOpen, user.id]);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const flipToFront = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReportModalOpen) return;
    setIsFlipped(false);
  };

  // Fonctions de navigation entre les intérêts
  const goToPreviousInterest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (Array.isArray(user?.interests) && user.interests.length > 1) {
      setInterestIndex((prev: number) => {
        const interestsLength = user.interests?.length || 1;
        const newIndex = prev > 0 ? prev - 1 : interestsLength - 1;
        return newIndex;
      });
    }
  };

  const goToNextInterest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (Array.isArray(user?.interests) && user.interests.length > 1) {
      setInterestIndex((prev: number) => {
        const interestsLength = user.interests?.length || 1;
        const newIndex = prev < interestsLength - 1 ? prev + 1 : 0;
        return newIndex;
      });
    }
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
    >
      <div className="flex flex-col-reverse gap-2" ref={modalRef}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          className="relative"
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] md:w-[380px] md:h-[550px] perspective-1000 relative"
          >
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
              {/* FRONT SIDE */}
              <div
                className="w-full h-full rounded-xl p-[10px] absolute shadow-2xl overflow-hidden pointer-events-auto z-20"
                style={{
                  backfaceVisibility: "hidden",
                  background: getRarityGradient(user.rarity),
                }}
                onClick={handleCardFlip}
              >
                <div className="w-full h-full rounded-lg overflow-hidden relative">
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
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute bottom-4 w-full flex justify-center z-20 swiper-pagination" />
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
                    </div>

                    <div className="text-primary-foreground pointer-events-auto mt-auto mb-5">
                      <h2 className="text-xl drop-shadow-md mb-1 text-background">
                        {user.name}
                      </h2>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Array.isArray(user?.languages) && user.languages.length > 0 && (
                          <div className="flex items-center gap-1 text-sm bg-black/50 px-2 py-1 rounded-full">
                            <Languages size={16} className="text-yellow-300" />
                            {Array.isArray(user?.languages) ? user.languages.slice(0, 2).join(", ") : ""}
                          </div>
                        )}
                        {user.zodiac && (
                          <div className="flex items-center gap-1 text-sm bg-black/50 px-2 py-1 rounded-full">
                            <Moon size={16} className="text-cyan-300" />
                            {user.zodiac}
                          </div>
                        )}
                        {user.smoking && (
                          <div className="flex items-center gap-1 text-sm bg-black/50 px-2 py-1 rounded-full">
                            <Cigarette size={16} className="text-red-300" />
                            {user.smoking}
                          </div>
                        )}
                        {user.drinking && (
                          <div className="flex items-center gap-1 text-sm bg-black/50 px-2 py-1 rounded-full">
                            <Wine size={16} className="text-purple-300" />
                            {user.drinking}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK SIDE */}
              <div
                className="w-full h-full rounded-xl p-[10px] absolute shadow-2xl overflow-hidden pointer-events-auto z-30"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: getRarityGradient(user.rarity),
                }}
                onClick={flipToFront}
              >
                <div className="w-full h-full rounded-lg bg-gradient-to-b from-black/90 to-black/70 flex flex-col justify-start p-5 text-primary-foreground relative overflow-hidden">

                  <div className="mt-2 mb-6 text-center pt-3">
                    <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-2">
                      Interests
                    </h3>
                  </div>

                  {Array.isArray(user?.interests) && user.interests.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-lg min-h-[160px]">
                        <p className="font-bold text-white/90 mb-2 text-sm">
                          {user.interests[interestIndex]?.prompt}
                        </p>
                        <p className="text-white/80 text-sm">
                          {user.interests[interestIndex]?.answer}
                        </p>
                      </div>

                      <div
                        className="flex justify-between items-center mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          {interestIndex + 1} / {Array.isArray(user?.interests) ? user.interests.length : 0}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 flex items-center justify-center shadow-md transition-all duration-200"
                            onClick={goToPreviousInterest}
                          >
                            <ArrowLeft size={15} className="text-white/90" />
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 flex items-center justify-center shadow-md transition-all duration-200"
                            onClick={goToNextInterest}
                          >
                            <ArrowLeft size={15} className="text-white/90 transform rotate-180" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[150px] text-gray-400 bg-black/30 rounded-xl p-5 mt-2 border border-white/5">
                      <Info className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-center text-sm">No interests available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Report modal */}
        <ReportUserModal
          open={isReportModalOpen}
          setIsOpen={setIsReportModalOpen}
          user={user}
        />

        {!isConnectedUser && (
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="ml-auto flex items-center gap-1 text-sm bg-red-500/80 hover:bg-red-600/90 text-white px-2 py-1 rounded-full shadow-lg hover:scale-110 active:scale-95"
            aria-label="Report user"
            type="button"
          >
            <Flag size={14} />
            <span>Report Problem</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
