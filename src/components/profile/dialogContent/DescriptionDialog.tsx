"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionDialog() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Description</DialogTitle>
        <DialogDescription>Parlez un peu de vous</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Textarea
          placeholder="Écrivez votre description ici..."
          className="min-h-[150px]"
        />
      </div>
      <DialogFooter>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </>
  );
}
