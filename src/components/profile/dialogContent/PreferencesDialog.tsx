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

export function PreferencesDialog() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Préférences</DialogTitle>
        <DialogDescription>Définissez vos préférences</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="looking-for">Je recherche</Label>
          <select id="looking-for" className="p-2 border rounded-md">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="tous">Tous</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Tranche d&apos;âge</Label>
          <div className="flex gap-4 items-center">
            <Input type="number" min="18" placeholder="18" className="w-20" />
            <span>à</span>
            <Input type="number" min="18" placeholder="99" className="w-20" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </>
  );
}
