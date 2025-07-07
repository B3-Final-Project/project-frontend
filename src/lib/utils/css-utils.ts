/**
 * Utilitaires pour les classes CSS communes
 */

// Classes de flexbox communes
export const FLEX_CLASSES = {
  // Flex avec items centrés et gap
  CENTER_GAP_1: 'flex items-center gap-1',
  CENTER_GAP_2: 'flex items-center gap-2',
  CENTER_GAP_3: 'flex items-center gap-3',
  CENTER_GAP_4: 'flex items-center gap-4',
  
  // Flex avec justify-between
  BETWEEN_GAP_2: 'flex items-center justify-between gap-2',
  BETWEEN_GAP_3: 'flex items-center justify-between gap-3',
  
  // Flex column centré
  COLUMN_CENTER_GAP_8: 'flex flex-col items-center justify-center gap-8',
  COLUMN_CENTER_GAP_10: 'flex flex-col items-center justify-center gap-10',
  
  // Flex avec wrap
  WRAP_GAP_2: 'flex items-center gap-2 flex-wrap',
  
  // Responsive flex
  RESPONSIVE_CENTER: 'flex items-center gap-2 sm:gap-3',
  RESPONSIVE_BETWEEN: 'flex items-center justify-between gap-2 sm:gap-3 p-2',
  RESPONSIVE_COLUMN: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
} as const;

// Classes pour les badges/étiquettes
export const BADGE_CLASSES = {
  // Badge blanc semi-transparent
  WHITE_SEMI: 'text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full',
  WHITE_SEMI_LARGE: 'text-sm bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-primary-foreground shadow-lg text-xs sm:text-sm',
  
  // Badge avec pointeur
  CLICKABLE: 'text-sm bg-white/10 text-primary-foreground px-2 py-1 rounded-full pointer-events-auto cursor-pointer',
  
  // Badge rouge
  RED: 'text-sm bg-red-500/80 hover:bg-red-600/90 text-white px-2 py-1 rounded-full transition-all duration-200 ease-in-out cursor-pointer pointer-events-auto shadow-lg z-50',
} as const;

// Classes pour les conteneurs
export const CONTAINER_CLASSES = {
  // Conteneur avec backdrop blur
  BACKDROP: 'bg-white/10 backdrop-blur-md p-2 rounded-full',
  
  // Conteneur de chargement
  LOADING: 'flex flex-col items-center justify-center gap-8',
} as const;

// Classes pour les boutons
export const BUTTON_CLASSES = {
  // Bouton rouge avec flex
  RED_FLEX: 'flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
} as const;

/**
 * Combine plusieurs classes CSS avec gestion des espaces
 */
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Crée une classe responsive avec des variantes mobile et desktop
 */
export function responsiveClass(mobile: string, desktop: string): string {
  return `${mobile} sm:${desktop}`;
} 