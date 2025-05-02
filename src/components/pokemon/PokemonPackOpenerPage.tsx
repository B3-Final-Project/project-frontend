'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PokemonCard from './PokemonCard';
import { useState } from 'react';

// Liste de Pokémon
const POKEMON = [
  {
    name: 'Pikachu',
    image: '/img.png',
    age: 5,
    location: 'Kanto',
    description: 'An Electric-type Pokémon known for its cute appearance and powerful electric attacks.',
  },
  {
    name: 'Charizard',
    image: '/img.png',
    age: 10,
    location: 'Kanto',
    description: 'A Fire/Flying-type Pokémon known for its fierce nature and powerful fire attacks.',
  },
  {
    name: 'Bulbasaur',
    image: '/img.png',
    age: 3,
    location: 'Kanto',
    description: 'A Grass/Poison-type Pokémon known for its plant-like appearance and ability to use vines.',
  },
  {
    name: 'Squirtle',
    image: '/img.png',
    age: 4,
    location: 'Kanto',
    description: 'A Water-type Pokémon known for its shell and ability to shoot water from its mouth.',
  },
  {
    name: 'Eevee',
    image: '/img.png',
    age: 2,
    location: 'Kanto',
    description: 'A Normal-type Pokémon known for its adaptability and multiple evolution forms.',
  },
  {
    name: 'Mewtwo',
    image: '/img.png',
    age: 20,
    location: 'Kanto',
    description: 'A Psychic-type Pokémon known for its incredible psychic powers and mysterious origins.',
  },
  {
    name: 'Gengar',
    image: '/img.png',
    age: 15,
    location: 'Kanto',
    description: 'A Ghost/Poison-type Pokémon known for its mischievous nature and ability to haunt others.',
  },
  {
    name: 'Lucario',
    image: '/img.png',
    age: 8,
    location: 'Sinnoh',
    description: 'A Fighting/Steel-type Pokémon known for its aura-sensing abilities and strong fighting skills.',
  },
  {
    name: 'Greninja',
    image: '/img.png',
    age: 6,
    location: 'Kalos',
    description: 'A Water/Dark-type Pokémon known for its speed and stealthy ninja-like abilities.',
  },
  {
    name: 'Gardevoir',
    image: '/img.png',
    age: 7,
    location: 'Hoenn',
    description: 'A Psychic/Fairy-type Pokémon known for its elegance and protective nature towards its trainer.',
  }
];

// Type pour une carte Pokémon
type PokemonCardType = {
  id: string;
  name: string;
  image: string;
  age?: number;
  location?: string;
  description?: string;
  isRevealed: boolean;
};

export default function PokemonPackOpenerPage() {
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  // Fonction pour générer une carte aléatoire
  const generateCard = (id: string): PokemonCardType => {
    const randomPokemon = POKEMON[Math.floor(Math.random() * POKEMON.length)];

    return {
      id,
      name: randomPokemon.name,
      image: randomPokemon.image || '/img.png',
      age: randomPokemon.age,
      location: randomPokemon.location,
      description: randomPokemon.description,
      isRevealed: false
    };
  };

  // Fonction pour ouvrir un nouveau pack de cartes
  const openPack = () => {
    if (isOpening) return;

    setIsOpening(true);
    setCards([]);

    // Générer un nouveau set de 5 cartes
    const newCards = Array.from({ length: 5 }, (_, i) =>
        generateCard(`card-${Date.now()}-${i}`)
    );

    // Afficher les cartes
    setCards(newCards.map(card => ({ ...card, isRevealed: false })));

    // Révéler les cartes une par une avec un délai
    newCards.forEach((card, index) => {
      setTimeout(() => {
        setCards(currentCards =>
            currentCards.map((c, i) =>
                i === index ? { ...c, isRevealed: true } : c
            )
        );

        // Vérifier si on a révélé la dernière carte
        if (index === newCards.length - 1) {
          setIsOpening(false);
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

        {cards.length > 0 ? (
            <PokemonCard card={cards} delay={0} />
        ) : (
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-6 text-center bg-gray-50">
                <p className="text-muted-foreground">No cards yet. Open a pack to reveal your Pokémon cards!</p>
              </Card>
            </div>
        )}
      </div>
  );
}