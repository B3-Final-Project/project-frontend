// Utilisation de number plutôt que des énumérations spécifiques car l'API les retourne comme des nombres
// Ces types sont utilisés uniquement pour le typage, ils seront de toute façon convertis en chaînes dans le mapper

import { Interest } from "@/lib/routes/profiles/interfaces/interest.interface";

export interface BoosterUserProfile {
  id: string;
  name?: string;
  surname?: string;
  age?: number;
}

export interface Booster {
  id: number;
  name?: string;
  surname?: string;
  age?: number;
  city?: string;
  work?: string;
  languages?: string[];
  min_age?: number;
  max_age?: number;
  max_distance?: number;
  orientation?: number;
  relationship_type?: number;
  smoking?: number;
  drinking?: number;
  religion?: number;
  politics?: number;
  zodiac?: number;
  images?: (string | null)[];
  avatarUrl?: string;
  interests?: Interest[];
  userProfile?: BoosterUserProfile; // Rendu optionnel car l'API peut ne pas l'inclure
  created_at?: Date; // Rendu optionnel car peut être absent
  updated_at?: Date; // Rendu optionnel car peut être absent
  rarity?: string | number; // Peut être un nombre ou une chaîne selon l'API
}

