"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OthersDialog() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Autres informations</DialogTitle>
        <DialogDescription>Complétez votre profil</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nom
          </Label>
          <Input id="name" placeholder="Votre nom" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="age" className="text-right">
            Âge
          </Label>
          <Input
            id="age"
            type="number"
            min="18"
            placeholder="25"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Ville
          </Label>
          <Input id="location" placeholder="Paris" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </>
  );
}
