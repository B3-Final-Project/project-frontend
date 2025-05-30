import { ProfileCardType } from './MatchSystem';

// Données de profils d'exemple
const SAMPLE_PROFILES: ProfileCardType[] = [
  {
    id: '1',
    name: 'Pikachu',
    image: '/img.png',
    age: 5,
    location: 'Kanto',
    description: 'Un Pokémon de type Électrique connu pour son apparence mignonne et ses puissantes attaques électriques.',
  },
  {
    id: '2',
    name: 'Charizard',
    image: '/img.png',
    age: 10,
    location: 'Kanto',
    description: 'Un Pokémon de type Feu/Vol connu pour sa nature féroce et ses puissantes attaques de feu.',
  },
  {
    id: '3',
    name: 'Bulbasaur',
    image: '/img.png',
    age: 3,
    location: 'Kanto',
    description: 'Un Pokémon de type Plante/Poison connu pour son apparence de plante et sa capacité à utiliser des lianes.',
  },
  {
    id: '4',
    name: 'Squirtle',
    image: '/img.png',
    age: 4,
    location: 'Kanto',
    description: 'Un Pokémon de type Eau connu pour sa carapace et sa capacité à projeter de l\'eau depuis sa bouche.',
  },
  {
    id: '5',
    name: 'Eevee',
    image: '/img.png',
    age: 2,
    location: 'Kanto',
    description: 'Un Pokémon de type Normal connu pour son adaptabilité et ses multiples formes d\'évolution.',
  },
  {
    id: '6',
    name: 'Mewtwo',
    image: '/img.png',
    age: 20,
    location: 'Kanto',
    description: 'Un Pokémon de type Psy connu pour ses incroyables pouvoirs psychiques et ses origines mystérieuses.',
  },
  {
    id: '7',
    name: 'Gengar',
    image: '/img.png',
    age: 15,
    location: 'Kanto',
    description: 'Un Pokémon de type Spectre/Poison connu pour sa nature espiègle et sa capacité à hanter les autres.',
  },
  {
    id: '8',
    name: 'Lucario',
    image: '/img.png',
    age: 8,
    location: 'Sinnoh',
    description: 'Un Pokémon de type Combat/Acier connu pour sa capacité à détecter les auras et ses puissantes compétences de combat.',
  },
  {
    id: '9',
    name: 'Greninja',
    image: '/img.png',
    age: 6,
    location: 'Kalos',
    description: 'Un Pokémon de type Eau/Ténèbres connu pour sa vitesse et ses capacités furtives de ninja.',
  },
  {
    id: '10',
    name: 'Gardevoir',
    image: '/img.png',
    age: 7,
    location: 'Hoenn',
    description: 'Un Pokémon de type Psy/Fée connu pour son élégance et sa nature protectrice envers son dresseur.',
  },
];

/**
 * Génère un profil aléatoire avec un ID unique
 */
export const generateProfile = (id: string): ProfileCardType => {
  const randomProfile = SAMPLE_PROFILES[Math.floor(Math.random() * SAMPLE_PROFILES.length)];
  
  return {
    id,
    name: randomProfile.name,
    image: randomProfile.image,
    age: randomProfile.age,
    location: randomProfile.location,
    description: randomProfile.description,
  };
};

/**
 * Génère un ensemble de profils aléatoires
 */
export const generateProfiles = (count: number): ProfileCardType[] => {
  return Array.from({ length: count }, (_, i) => 
    generateProfile(`profile-${Date.now()}-${i}`)
  );
};

export default {
  generateProfile,
  generateProfiles
};
