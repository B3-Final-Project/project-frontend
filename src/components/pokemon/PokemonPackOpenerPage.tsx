'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PokemonCard from './PokemonCard';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define card rarities and their chances
const RARITIES = {
  common: { chance: 0.7, color: 'bg-gray-200' },
  uncommon: { chance: 0.2, color: 'bg-green-200' },
  rare: { chance: 0.07, color: 'bg-blue-200' },
  ultraRare: { chance: 0.025, color: 'bg-purple-200' },
  secret: { chance: 0.005, color: 'bg-yellow-200' }
};

// Card name pools for each rarity
const POKEMON = {
  common: ['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Caterpie', 'Weedle', 'Pidgey', 'Rattata', 'Spearow', 'Ekans'],
  uncommon: ['Ivysaur', 'Charmeleon', 'Wartortle', 'Metapod', 'Kakuna', 'Pidgeotto', 'Raticate', 'Fearow', 'Arbok', 'Nidorina'],
  rare: ['Venusaur', 'Charizard', 'Blastoise', 'Butterfree', 'Beedrill', 'Pidgeot', 'Raichu', 'Nidoqueen', 'Nidoking', 'Clefable'],
  ultraRare: ['Mew', 'Mewtwo', 'Zapdos', 'Articuno', 'Moltres', 'Dragonite', 'Gyarados', 'Lapras', 'Snorlax', 'Alakazam'],
  secret: ['Shiny Charizard', 'Shiny Mewtwo', 'Gold Star Pikachu', 'Ancient Mew', 'Shiny Gyarados', 'Rainbow Rare Pikachu', 'Gold Star Umbreon', 'Crystal Lugia', 'Shiny Rayquaza', 'Gold Star Espeon']
};

// Pokemon card type with all necessary properties
type PokemonCardType = {
  id: string;
  name: string;
  rarity: string;
  image: string;
  color: string;
  isRevealed: boolean;
};

export default function PokemonPackOpenerPage() {
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const { toast } = useToast();

  // Function to determine a card's rarity based on probability
  const determineRarity = () => {
    const rand = Math.random();
    let cumulativeChance = 0;

    for (const [rarity, data] of Object.entries(RARITIES)) {
      cumulativeChance += data.chance;
      if (rand <= cumulativeChance) return rarity;
    }

    return 'common'; // Fallback in case of rounding errors
  };

  // Function to generate a random card based on rarity
  const generateCard = (id: string): PokemonCardType => {
    const rarity = determineRarity();
    const pokemonPool = POKEMON[rarity as keyof typeof POKEMON];
    const name = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];

    return {
      id,
      name,
      rarity,
      image: `/img.png`, // This would require actual Pokemon images
      color: RARITIES[rarity as keyof typeof RARITIES].color,
      isRevealed: false
    };
  };

  // Function to open a new pack of cards
  const openPack = () => {
    if (isOpening) return;

    setIsOpening(true);
    setCards([]);

    toast({
      title: "Opening pack...",
      description: "Get ready to see your cards!",
    });

    // Generate a new set of 5 cards
    const newCards = Array.from({ length: 5 }, (_, i) =>
      generateCard(`card-${Date.now()}-${i}`)
    );

    // Display the cards one by one with a delay
    setCards(newCards.map(card => ({ ...card, isRevealed: false })));

    // Reveal cards one by one with a delay
    newCards.forEach((card, index) => {
      setTimeout(() => {
        setCards(currentCards =>
          currentCards.map((c, i) =>
            i === index ? { ...c, isRevealed: true } : c
          )
        );

        // Check if we've revealed the last card
        if (index === newCards.length - 1) {
          setIsOpening(false);
          setTimeout(() => {
            const rarities = newCards.map(c => c.rarity);
            const hasRare = rarities.some(r => r === 'rare' || r === 'ultraRare' || r === 'secret');

            toast({
              title: hasRare ? "Amazing pull!" : "Pack opened!",
              description: hasRare
                ? "You got some rare cards! Congrats!"
                : "Better luck next time for rare cards!",
              variant: hasRare ? "default" : "destructive",
            });
          }, 500);
        }
      }, 1000 * (index + 1));
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pokémon Card Pack Opener</h1>
        <p className="text-muted-foreground">Click the button to open a virtual pack of Pokémon cards!</p>
      </header>

      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          onClick={openPack}
          disabled={isOpening}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isOpening ? "Opening Pack..." : "Open New Pack"}
        </Button>
      </div>

      <div className="flex justify-center flex-wrap gap-4">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <PokemonCard key={card.id} card={card} delay={index} />
          ))
        ) : (
          <Card className="w-full max-w-md p-6 text-center bg-gray-50">
            <p className="text-muted-foreground">No cards yet. Open a pack to reveal your Pokémon cards!</p>
          </Card>
        )}
      </div>

    </div>
  );
}
