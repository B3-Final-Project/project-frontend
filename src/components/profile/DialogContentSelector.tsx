"use client";

import { DescriptionDialog } from "./dialogContent/DescriptionDialog";
import { GenreDialog } from "./dialogContent/GenreDialog";
import { OthersDialog } from "./dialogContent/OthersDialog";
import { PicturesDialog } from "./dialogContent/PicturesDialog";
import { PreferencesDialog } from "./dialogContent/PreferencesDialog";

interface DialogContentSelectorProps {
  selectedOption: string;
}

export function DialogContentSelector({
  selectedOption,
}: DialogContentSelectorProps) {
  switch (selectedOption) {
    case "pictures":
      return <PicturesDialog />;
    case "description":
      return <DescriptionDialog />;
    case "genre":
      return <GenreDialog />;
    case "preferences":
      return <PreferencesDialog />;
    case "others":
      return <OthersDialog />;
    default:
      return null;
  }
}
