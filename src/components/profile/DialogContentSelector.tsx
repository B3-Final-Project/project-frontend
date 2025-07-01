"use client";

import {
  DialogContentChoices
} from "@/components/profile/ProfileDialogContent";
import { LifestyleDialog } from "./dialogContent/LifestyleDialog";
import { LocationWorkDialog } from "./dialogContent/LocationWorkDialog";
import { PersonalInfoDialog } from "./dialogContent/PersonalInfoDialog";
import { PicturesDialog } from "./dialogContent/PicturesDialog";
import { PreferencesDialog } from "./dialogContent/PreferencesDialog";
import { InterestsDialog } from "./dialogContent/InterestsDialog";

interface DialogContentSelectorProps {
  readonly selectedOption: string;
}

export function DialogContentSelector({
  selectedOption,
}: DialogContentSelectorProps) {
  switch (selectedOption) {
    case DialogContentChoices.PICTURES:
      return <PicturesDialog />;
    case DialogContentChoices.PREFERENCES:
      return <PreferencesDialog />;
    case DialogContentChoices.PERSONAL_INFO:
      return <PersonalInfoDialog />;
    case DialogContentChoices.LOCATION_WORK:
      return <LocationWorkDialog />;
    case DialogContentChoices.LIFESTYLE:
      return <LifestyleDialog />;
    case DialogContentChoices.INTERESTS:
      return <InterestsDialog />;
    default:
      return null;
  }
}
