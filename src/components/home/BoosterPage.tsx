"use client";

import { useRef, useState } from "react";

export function BoosterPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
    setIsOpen(true);
  };

  console.log("is flipped", isFlipped);

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <div ref={modalRef} id="1">
        <button
          className="w-[150px] h-[220px] md:w-[175px] md:h-[245px] lg:w-[200px] lg:h-[270px] perspective-1000 relative cursor-pointer"
          onClick={handleCardFlip}
        >
          <div
            className={`w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "choice-booster" : ""}`}
          >
            {/* Front side of the card */}
            <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#ED2272] to-[#00AEEF] absolute backface-hidden">
              <div
                className="w-full h-full rounded-lg flex items-center justify-center"
                style={{
                  backgroundImage: "url('/vintage.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center text-background p-4 font-semibold">
                    <p>Location</p>
                    <p>Type</p>
                  </div>

                  <div className="text-background p-4 font-semibold">
                    <p>Name</p>
                    <p>Age</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back side of the card */}
            <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#00AEEF] to-[#ED2272] absolute backface-hidden rotate-y-180">
              <div className="w-full h-full rounded-lg bg-black/80 flex flex-col justify-center p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="mb-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita at vero voluptatem, eum voluptate quia corrupti
                  doloremque voluptatum quos obcaecati dicta eos distinctio ea
                  earum eligendi odit reprehenderit! Iste, vitae!
                </p>
                <div className="mt-4 border-t border-white/30 pt-4 w-full">
                  <p className="text-sm text-center">Cliquer pour revenir</p>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
