'use client';

import { UserCardModal } from "@/components/profile/UserCardModal";
import { motion } from 'framer-motion';
import { Info, MapPin, User } from 'lucide-react';
import { useEffect, useState } from "react";
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import '../../styles/pokemon-pack-appear.css';
import '../../styles/swiper.css';

import { EffectCards } from 'swiper/modules';

type PokemonCardData = {
  id: string;
  name: string;
  image: string;
  isRevealed: boolean;
  age?: number;
  location?: string;
  description?: string;
};

type PokemonCardProps = {
  card: PokemonCardData[];
};

export default function PokemonCard({ card: cards }: PokemonCardProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PokemonCardData | null>(null);

  const openModal = (card: PokemonCardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    console.log("Cards revealed:", cards);
  }, [cards]);

  const getCardSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        return {
          height: '520px',
          width: '350px'
        };
      } else if (window.innerWidth >= 768) {
        return {
          height: '480px',
          width: '320px'
        };
      }
    }
    return {
      height: 'min(420px, 70vh)',
      width: 'min(280px, 85vw)'
    };
  };

  const [cardSize, setCardSize] = useState(getCardSize());

  useEffect(() => {
    const handleResize = () => {
      setCardSize(getCardSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        style={{
          height: cardSize.height,
          width: cardSize.width,
          margin: '0 auto'
        }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <motion.div
              className={`w-full h-full rounded-xl p-[10px] bg-gradient-to-br from-[#FF6B6B] via-[#ED2272] to-[#6A5ACD] absolute backface-hidden cursor-pointer shadow-2xl${showAnimation ? ' pokemon-pack-appear' : ''}`}
              onClick={() => openModal(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent">
                  {card.isRevealed && (
                    <>
                      <div className="flex justify-between items-center p-3 sm:p-5 font-medium flex-wrap gap-2">
                        <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                          <MapPin className="text-red-400 w-4 h-4 sm:w-5 sm:h-5" />
                          <p>{card.location || "Inconnu"}</p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-white shadow-lg text-xs sm:text-sm">
                          <User className="text-blue-300 w-4 h-4 sm:w-5 sm:h-5" />
                          <p>{card.age || "?"} ans</p>
                        </div>
                      </div>

                      <div className="p-3 sm:p-5 font-bold flex flex-col items-start bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                        <h2 className="text-lg sm:text-xl md:text-2xl mb-1 drop-shadow-md">{card.name}</h2>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Info className="text-purple-300 w-4 h-4 sm:w-5 sm:h-5" />
                          <p className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-[250px]">{card.description || "Pas de description"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedCard && (
        <UserCardModal
          name={selectedCard.name}
          age={selectedCard.age}
          location={selectedCard.location}
          description={selectedCard.description}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}