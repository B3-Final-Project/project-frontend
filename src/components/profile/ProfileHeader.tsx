"use client";

import { GalleryHorizontalEnd, Settings } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex justify-between items-center gap-4 p-8">
      <Settings />
      <GalleryHorizontalEnd />
    </div>
  );
}
