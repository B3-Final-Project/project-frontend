import { ProfileCreationProvider } from "@/providers/ProfileCreationProvider";
import { ReactNode } from "react";

export default function ProfilesCreateLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ProfileCreationProvider basePath="/profiles">
      {children}
    </ProfileCreationProvider>
  );
}
