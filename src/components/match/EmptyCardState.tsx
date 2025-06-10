'use client';

type EmptyCardStateProps = {
  onStartNewSession: () => void;
  remainingPacks: number;
};

export default function EmptyCardState({ onStartNewSession, remainingPacks }: EmptyCardStateProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
      <h3 className="text-xl font-bold mb-2">Plus de profils disponibles</h3>
      <p className="text-muted-foreground mb-4">
        Vous avez vu tous les profils de ce pack.
      </p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={onStartNewSession}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-medium"
        >
          {`Ouvrir un nouveau pack (${remainingPacks} restant(s))`}
        </button>
      </div>
    </div>
  );
}