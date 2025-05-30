import { MoveRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface PackOpenerProps {
  onPackOpened: () => void;
}

const PackOpener = ({ onPackOpened }: PackOpenerProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);

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
    const dragDistance = currentX - dragStartXRef.current;
    const maxDistance = rect.width * 0.8;
    const progress = Math.min(100, Math.max(0, (dragDistance / maxDistance) * 100));

    setDragProgress(progress);

    if (progress >= 100) {
      openPack();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragProgress < 100) {
      setDragProgress(0);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragProgress(0);
  };

  const openPack = () => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      setIsOpening(false);
      setDragProgress(0);
      onPackOpened();
    }, 1000);
  };

  return (
    <div className="pack-button-container">
      <div className={`pokemon-pack-3d ${isDragging ? 'dragging' : ''} ${isOpening ? 'opening' : ''}`}>
        <div className="pack-front">
          <img src="/logo.svg" alt="Profile Pack" className="pack-image" />
          <div className="pack-shine"></div>
        </div>
      </div>

      <div
        ref={buttonRef}
        className="open-pack-button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="button-inner">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${dragProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-center w-full px-4 gap-2">
            <div className="flex items-center gap-2">
              <MoveRight className="text-pink-500" />
            </div>
            <span className="button-text">Glissez pour ouvrir</span>
          </div>
        </div>
      </div>

      {/* Animation d'explosion de cartes */}
      {isOpening && (
        <div className="card-explosion">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="explosion-particle"
              style={{
                '--x': `${Math.random() * 400 - 200}px`,
                '--y': `${Math.random() * -300 - 100}px`,
                '--delay': `${Math.random() * 0.5}s`,
                '--size': `${Math.random() * 15 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 60 + 280}, 100%, 70%)`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>
      )}

      {/* Indicateur de progression */}
      <div className="progress-indicator">
        {Math.round(dragProgress)}%
      </div>

      {isDragging && (
        <div className="text-white font-bold mt-4">
          {dragProgress > 70
            ? "Presque là! Continuez..."
            : dragProgress > 40
              ? "Continuez à tirer..."
              : "Glissez vers la droite pour découvrir vos profils!"}
        </div>
      )}
    </div>
  );
};

export default PackOpener;
