'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from 'next/image';

import { motion } from 'framer-motion';

type PokemonCardProps = {
  card: {
    id: string;
    name: string;
    rarity: string;
    image: string;
    color: string;
    isRevealed: boolean;
  };
  delay: number;
};

export default function PokemonCard({ card, delay }: PokemonCardProps) {
  // Animation variants for the card reveal
  const variants = {
    hidden: {
      rotateY: 180,
      scale: 0.8,
      opacity: 0.8
    },
    visible: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay * 0.2
      }
    }
  };

  return (
    <motion.div
      className="perspective-1000 relative"
      initial="hidden"
      animate={card.isRevealed ? "visible" : "hidden"}
      variants={variants}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className={`w-64 h-88 ${card.isRevealed ? card.color : 'bg-gray-700'} shadow-lg`}>
        <CardContent className="p-4 flex flex-col items-center justify-center">
          {card.isRevealed ? (
            <>
              <div className="h-48 w-full bg-white rounded-md flex items-center justify-center mb-4">
                {/* We'd use actual images here, this is a placeholder */}
                <Image width={150} height={100} src={"/img.png"} alt={card.image}/>
              </div>
              <h3 className="font-bold text-lg mb-1">{card.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {card.rarity}
              </span>
            </>
          ) : (
            <div className="h-48 w-full bg-blue-800 rounded-md flex items-center justify-center mb-4">
              <div className="text-white font-bold text-2xl">?</div>
            </div>
          )}
        </CardContent>
        <CardFooter className={`p-2 text-center ${card.isRevealed ? '' : 'bg-blue-900 text-white'}`}>
          {card.isRevealed ? (
            <p className="w-full text-xs">
              Card #{card.id.split('-')[2]}
            </p>
          ) : (
            <p className="w-full text-xs">
              Pokémon Card
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
