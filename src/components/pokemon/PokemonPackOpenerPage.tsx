'use client';

import { useRef, useState } from 'react';
import { Background } from '../Background';
import PokemonCard from './PokemonCard';

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

  const openPack = () => {
    if (isOpening) return;

    setIsOpening(true);
    setCards([]);

    const newCards = Array.from({ length: 5 }, (_, i) =>
      generateCard(`card-${Date.now()}-${i}`)
    );

    setTimeout(() => {
      setCards(newCards.map(card => ({ ...card, isRevealed: true })));

      setTimeout(() => {
        setIsOpening(false);
        setDragProgress(0);
      }, 500);
    }, 600);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpening) return;

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

    const progress = Math.max(0, Math.min(100, (distance / (rect.width * 0.5)) * 100));

    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
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

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragProgress(0);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Background />
      <div className="container mx-auto py-10 space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Pokémon Card Pack Opener</h1>
          <p className="text-muted-foreground">Maintenez et glissez pour ouvrir un pack de cartes Pokémon!</p>
        </header>

        {cards.length === 0 && (
          <>
            <div className="flex justify-center mb-8">
              <div className="pack-button-container">
                <div className={`pokemon-pack-3d ${isDragging ? 'dragging' : ''} ${isOpening ? 'opening' : ''}`}>
                  <div className="pack-front">
                    <img src="/logo.svg" alt="Pokemon Pack" className="pack-image" />
                    <div className="pack-shine"></div>
                  </div>
                </div>

                <button
                  ref={buttonRef}
                  className="open-pack-button"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  disabled={isOpening}
                  type="button"
                >
                  <div className="button-inner">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${dragProgress}%` }}
                      ></div>
                    </div>

                    <span className="button-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="button-text">Ouvrir le Pack</span>

                    {/* Effet de particules */}
                    <div className="particles-container">
                      {dragProgress > 30 && Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="particle"
                          style={{
                            '--delay': `${i * 0.1}s`,
                            '--size': `${Math.random() * 5 + 3}px`,
                            '--x': `${Math.random() * 100}%`,
                            '--duration': `${Math.random() * 0.5 + 0.5}s`
                          } as React.CSSProperties}
                        ></span>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
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
          </>
        )}

        {cards.length > 0 ? (
          <div className="card-reveal-container">
            <PokemonCard card={cards} />
          </div>
        ) : null}
      </div>
    </div>
  );
}