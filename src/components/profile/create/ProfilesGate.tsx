"use client";

import { ReactNode } from "react";

export function ProfilesGate({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
