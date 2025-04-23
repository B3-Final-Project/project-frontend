"use client";

import { useEffect, useState } from "react";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export function ProfileContainer({ children }: ProfileContainerProps) {
  const [sizeScreen, setSizeScreen] = useState(0);

  useEffect(() => {
    setSizeScreen(window.innerWidth);

    const handleResize = () => {
      setSizeScreen(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-[200%] h-full min-h-screen bg-background rounded-t-[400px] rounded-b-none shadow-lg -ml-[50%] flex justify-center">
      <div
        className="flex flex-col items-center"
        style={{ width: `${sizeScreen}px` }}
      >
        {children}
      </div>
    </div>
  );
}
