'use client';

import { Card } from "@/components/ui/card";
import PokemonCard from './PokemonCard';
import { useEffect, useRef, useState, useCallback } from 'react';

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
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);

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

    newCards.forEach((card, index) => {
      setTimeout(() => {
        setCards(currentCards =>
          currentCards.map((c, i) =>
            i === index ? { ...c, isRevealed: true } : c
          )
        );

        if (index === newCards.length - 1) {
          setIsOpening(false);
          setDragProgress(0);
        }
      }, 1000 * (index + 1));
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpening) return;

    // Capturer le pointeur
    e.currentTarget.setPointerCapture(e.pointerId);

    isDraggingRef.current = true;
    setIsDragging(true);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      dragStartXRef.current = e.clientX - rect.left;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const distance = currentX - dragStartXRef.current;

    // Calculer la progression (50% de la largeur du bouton suffit pour compléter)
    const progress = Math.max(0, Math.min(100, (distance / (rect.width * 0.5)) * 100));

    setDragProgress(progress);
    console.log("Dragging progress:", progress, "Distance:", distance);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // Libérer le pointeur
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragProgress > 80) {
      openPack();
    } else {
      setDragProgress(0);
    }
  };

  // Annuler le glissement si le pointeur sort
  const handlePointerCancel = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragProgress(0);
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pokémon Card Pack Opener</h1>
        <p className="text-muted-foreground">Maintenez et glissez pour ouvrir un pack de cartes Pokémon!</p>
      </header>

      <div className="flex justify-center mb-8">
        <button
          ref={buttonRef}
          className="text-3xl text-gray-400 w-96 h-20 rounded-full border-4 border-dashed focus:outline-none relative font-semibold cursor-grab touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          disabled={isOpening}
          type="button"
        >
          {/* Flèche indicative */}
          <span className={`bg-lime-400 rounded-full w-12 h-12 text-white absolute top-3 left-4 text-4xl z-20 flex items-center justify-center ${isDragging ? 'translate-x-2' : ''}`}>
            →
          </span>

          {/* Texte */}
          <span className="z-10 relative">Tear open</span>

          {/* Partie grise qui se révèle */}
          <span
            className="absolute top-0 left-0 h-full w-full bg-gray-200 rounded-l-full transition-all duration-100"
            style={{ maxWidth: `${dragProgress}%` }}
          />

          {/* Animation du papier rouge */}
          <span
            className="absolute top-0 left-0 h-full w-full bg-red-500 rounded-r-xxl rounded-l-sm transition-all duration-100 shadow-lg"
            style={{
              maxWidth: `${dragProgress}%`,
              transform: `translateX(${dragProgress * 0.8}%) scaleY(${1 + dragProgress * 0.001}) scaleX(${0.6 + dragProgress * 0.004})`
            }}
          />
        </button>
      </div>

      <div className="mb-4 text-center text-lg font-semibold">
        {isDragging && (
          <div className="text-blue-500">
            {dragProgress > 70
              ? "Presque là! Continuez..."
              : dragProgress > 40
                ? "Continuez à tirer..."
                : "Tirez vers la droite pour ouvrir!"}
          </div>
        )}
        <div className="text-gray-500 mt-2">
          Progression: {Math.round(dragProgress)}%
        </div>
      </div>

      {cards.length > 0 ? (
        <PokemonCard card={cards} delay={0} />
      ) : (
        <div className="flex justify-center">
          <Card className="w-full max-w-md p-6 text-center bg-gray-50">
            <p className="text-muted-foreground">
              {!isDragging && "Maintenez et glissez pour ouvrir le paquet!"}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}