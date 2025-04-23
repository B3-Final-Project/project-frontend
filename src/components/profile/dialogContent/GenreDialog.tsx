"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function GenreDialog() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Genre</DialogTitle>
        <DialogDescription>Définissez votre genre</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Genre</Label>
          <select id="gender" className="p-2 border rounded-md">
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="non-binaire">Non-binaire</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </>
  );
}
