"use client";

import { DescriptionDialog } from "./dialogContent/DescriptionDialog";
import { GenreDialog } from "./dialogContent/GenreDialog";
import { OthersDialog } from "./dialogContent/OthersDialog";
import { PicturesDialog } from "./dialogContent/PicturesDialog";
import { PreferencesDialog } from "./dialogContent/PreferencesDialog";
import {
  DialogContentChoices
} from "@/components/profile/ProfileDialogContent";

interface DialogContentSelectorProps {
  selectedOption: string;
}

export function DialogContentSelector({
  selectedOption,
}: DialogContentSelectorProps) {
  switch (selectedOption) {
    case DialogContentChoices.PICTURES:
      return <PicturesDialog />;
    case DialogContentChoices.DESCRIPTION:
      return <DescriptionDialog />;
    case DialogContentChoices.GENRE:
      return <GenreDialog />;
    case DialogContentChoices.PREFERENCES:
      return <PreferencesDialog />;
    case DialogContentChoices.OTHER:
      return <OthersDialog />;
    default:
      return null;
  }
}
