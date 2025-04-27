"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface UserCardModalProps {
  name: string;
  age?: number;
  location?: string;
  description?: string;
}

export function UserCardModal({ name, age, location, description }: UserCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCardFlip = () => setIsFlipped((prev) => !prev);

  useEffect(() => {
    if (!open) {
      setIsFlipped(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full max-w-[300px] justify-between">
          Aperçu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apperçu de votre carte</DialogTitle>
          <DialogDescription>Voilà ce que les autres verront en te trouvant !</DialogDescription>
        </DialogHeader>
        <button
          onClick={handleCardFlip}
          className="w-[80vw] max-w-[400px] aspect-[7/10] perspective-1000 relative cursor-pointer"
          aria-label="Flip user card"
        >
          <div
            className={cn(
              "w-full h-full transition-transform duration-700 ease-in-out transform-style-3d",
              { "rotate-y-180": isFlipped }
            )}
          >
            {/* Front */}
            <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#ED2272] to-[#00AEEF] absolute backface-hidden">
              <div
                className="w-full h-full rounded-lg flex flex-col justify-between"
                style={{
                  backgroundImage: "url('/vintage.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex justify-between items-center text-background p-4 font-semibold">
                  <p>{location || "Location"}</p>
                  <p>Type</p>
                </div>
                <div className="text-background p-4 font-semibold">
                  <p>{name}</p>
                  <p>{age}</p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="w-full h-full rounded-xl p-[8px] bg-gradient-to-b from-[#00AEEF] to-[#ED2272] absolute backface-hidden rotate-y-180">
              <div className="w-full h-full rounded-lg bg-black/80 flex flex-col justify-center p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="mb-3">{description || "Pas de description disponible."}</p>
                <div className="mt-4 border-t border-white/30 pt-4 w-full">
                  <p className="text-sm text-center">Cliquer pour revenir</p>
                </div>
              </div>
            </div>
          </div>
        </button>
      </DialogContent>
    </Dialog>
  );
}
