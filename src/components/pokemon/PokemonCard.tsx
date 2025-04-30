'use client';

import { motion } from 'framer-motion';
import Image from "next/image";
import { UserCardModal } from "@/components/profile/UserCardModal";
import { useState } from "react";

type PokemonCardProps = {
  card: {
    id: string;
    name: string;
    image: string;
    isRevealed: boolean;
    age?: number;
    location?: string;
    description?: string;
  };
  delay: number;
};

export default function PokemonCard({ card, delay }: PokemonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation variants for the card reveal
  const variants = {
    hidden: {
      rotateY: 180,
      scale: 0.8,
      opacity: 0.8,
    },
    visible: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay * 0.2,
      },
    },
  };

  return (
      <>
      <motion.div
          className="w-[300px] h-[440px] perspective-1000 relative"
          initial="hidden"
          animate={card.isRevealed ? "visible" : "hidden"}
          variants={variants}
          style={{ transformStyle: "preserve-3d" }}
      >
        <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#ED2272] to-[#00AEEF] absolute backface-hidden" onClick={openModal}>
          {card.isRevealed ? (
              <div
                  className="w-full h-full rounded-lg flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
              >
                <div className="w-full h-full flex flex-col justify-between">
                  <>
                    <div className="flex justify-between items-center text-background p-4 font-semibold">
                      <p>{card.location || "Inconnu"}</p>
                      <p>{card.age || "?"} ans</p>
                    </div>

                    <div className="text-background p-4 font-semibold">
                      <p className="text-xl">{card.name}</p>
                      <p className="text-sm truncate">{card.description || "Pas de description"}</p>
                    </div>
                  </>
                </div>
              </div>
          ) : (
              <div className="flex items-center justify-center h-full">
                <Image src={"logo.svg"} alt="Pokémon Logo" width={100} height={100} className="w-1/2 h-1/2" />
              </div>
          )}
        </div>


      </motion.div>
  <UserCardModal
      name={card.name}
      age={card.age}
      location={card.location}
      description={card.description}
      isOpen={isModalOpen}
      onClose={closeModal}
  />
      </>
  );
}