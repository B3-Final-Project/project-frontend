"use client";

import { DialogContentSelector } from "@/components/profile/DialogContentSelector";
import { ProfileOptions } from "@/components/profile/ProfileOptions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

export function ProfileDialogContent() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <Dialog>
      <ProfileOptions setSelectedOption={setSelectedOption} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogContentSelector selectedOption={selectedOption} />
      </DialogContent>
    </Dialog>
  );
}
