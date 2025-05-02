'use client';

import { UserCardModal } from "@/components/profile/UserCardModal";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import '../../styles/swiper.css';

// import required modules
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
  delay: number;
};

export default function PokemonCard({ card: cards }: PokemonCardProps) {
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

  return (
      <>
        <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
        >
          {cards.map((card) => (
              <SwiperSlide key={card.id}>
                <div
                    className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#ED2272] to-[#00AEEF] absolute backface-hidden cursor-pointer"
                    onClick={() => openModal(card)}
                >
                  <div
                      className="w-full h-full rounded-lg flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${card.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                  >
                    <div className="w-full h-full flex flex-col justify-between">
                      {card.isRevealed && (
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
                      )}
                    </div>
                  </div>
                </div>
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
      </>
  );
}