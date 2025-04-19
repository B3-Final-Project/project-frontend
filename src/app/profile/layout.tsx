import { ProfileCreationProvider } from "@/providers/ProfileCreationProvider";
import { ReactNode } from "react";

export default function ProfileCreateLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileCreationProvider>
      {children}
    </ProfileCreationProvider>
  );
}
