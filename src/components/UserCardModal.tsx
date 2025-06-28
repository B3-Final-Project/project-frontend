"use client";

import { getRarityGradient } from '@/utils/rarityHelper';
import { motion } from 'framer-motion';
import { Cigarette, Info, Languages, MapPin, Moon, User, Wine, Flag } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from "react";
import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";
import { RarityEnum } from "@/lib/routes/booster/dto/rarity.enum";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportUserMutation } from "@/hooks/react-query/admin";
import {
  ProfileCardType
} from "@/lib/routes/profiles/dto/profile-card-type.dto";

interface UserCardModalProps {
  user: ProfileCardType
  readonly isOpen: boolean;
  onCloseAction(): void;
}

export function UserCardModal({
  isOpen,
  onCloseAction,
  user
}: Readonly<UserCardModalProps>) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const reportMutation = useReportUserMutation();

  const reportCategories = [
    "Inappropriate content",
    "Fake profile",
    "Harassment",
    "Spam",
    "Underage user",
    "Other"
  ];

  const handleReportSubmit = () => {
    if (!user.id) return;

    const fullReason = reportCategory ? `${reportCategory}: ${reportReason.trim()}` : reportReason.trim();
    if (fullReason) {
      reportMutation.mutate({
        userId: user.id,
        reason: fullReason
      });
      setReportReason("");
      setReportCategory("");
      setIsReportModalOpen(false);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };


  const handleClickOutside = useCallback((e: Event)=> {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCloseAction();
      setIsFlipped(false)
    }
  }, [onCloseAction])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
        <motion.div
          className="w-[280px] h-[420px] sm:w-[320px] sm:h-[480px] md:w-[380px] md:h-[550px] perspective-1000 relative cursor-pointer"
          onClick={handleCardFlip}
        >
          <motion.div
            className="w-full h-full transform-style-3d relative"
            animate={isFlipped ? 'back' : 'front'}
            variants={flipVariants}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Front side of the card */}
            <div
              className="w-full h-full rounded-xl p-[10px] absolute backface-hidden shadow-2xl overflow-hidden"
              style={{ background: getRarityGradient(user.rarity) }}
            >
              <div
                className="w-full h-full rounded-lg overflow-hidden"            style={{
              backgroundImage: `url(${user.image_url ?? '/vintage.png'})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
              >
                <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                  <div className="flex justify-between items-start">
                    {user.age && (
                      <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                        <User size={16} className="text-blue-300" />
                        {user.age} ans
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                        <MapPin size={16} className="text-red-400" />
                        {user.location}
                      </div>
                    )}
                  </div>

                  {/* Report Button */}
                  {user.id && (
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReportModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-sm bg-red-500/80 hover:bg-red-600/90 text-white px-2 py-1 rounded-full transition-colors shadow-lg"
                      >
                        <Flag size={14} />
                        Report
                      </button>
                    </div>
                  )}

                  <div className="text-white">
                    <h2 className="text-xl font-bold drop-shadow-md mb-1">{user.name}</h2>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {user.languages && user.languages.length > 0 && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                          <Languages size={16} className="text-yellow-300" />
                          {user.languages.slice(0, 2).join(', ')}
                        </div>
                      )}
                      {user.zodiac && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                          <Moon size={16} className="text-cyan-300" />
                          {user.zodiac}
                        </div>
                      )}
                      {user.smoking && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
                          <Cigarette size={16} className="text-red-300" />
                          {user.smoking}
                        </div>
                      )}
                      {user.drinking && (
                        <div className="flex items-center gap-1 text-sm bg-white/10 text-white px-2 py-1 rounded-full">
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
              className="w-full h-full rounded-xl p-[10px] absolute backface-hidden rotate-y-180 shadow-2xl overflow-hidden"
              style={{ background: getRarityGradient(user.rarity) }}
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-b from-black/90 to-black/70 flex flex-col justify-center p-7 text-white">
                <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <Info className="text-purple-300 w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Interests</h3>
                </div>
                <div className="mb-3 text-gray-200 leading-relaxed overflow-auto max-h-[300px] custom-scrollbar">
                  {user.interests && user.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.map((interest) => (
                        <span
                          key={interest.id}
                          className="bg-white/10 text-white px-2 py-1 rounded-full text-sm"
                        >
                          {interest.prompt}:
                          <span className="font-semibold"> {interest.answer}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 border-t border-white/20 pt-4 w-full">
                  <p className="text-sm text-center text-blue-200">
                    Cliquer pour revenir
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report User: {user.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="report-category">Report Category</Label>
              <Select value={reportCategory} onValueChange={setReportCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {reportCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="report-reason">Additional Details</Label>
              <Textarea
                id="report-reason"
                placeholder="Please provide additional details about the report..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportReason("");
                  setReportCategory("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportSubmit}
                disabled={!reportCategory || reportMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {reportMutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
