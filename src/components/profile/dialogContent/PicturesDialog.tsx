"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";

export function PicturesDialog() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Photos</DialogTitle>
        <DialogDescription>
          Ajoutez jusqu&apos;à 6 photos à votre profil
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-3 gap-4 py-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer"
          >
            <Camera className="text-gray-400" />
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </>
  );
}
