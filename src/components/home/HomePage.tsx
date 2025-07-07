"use client";
import { SignInButton } from "@/components/auth/SignInButton";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import UserDashboard from "./UserDashboard";


export default function HomePage() {
  const auth = useAuth();

  if (auth.isLoading || !auth.user) {
    return (
      <main className="flex flex-col items-center justify-center p-4 min-h-screen pb-[120px]">
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
          <div className="relative w-full aspect-square max-w-[250px] sm:max-w-[300px] md:max-w-[350px] transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="Holomatch logo"
              width={557}
              height={448}
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl text-center font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}>
            HOLOMATCH
          </h1>

          <p className="text-center text-lg md:text-xl opacity-80 max-w-xs md:max-w-sm">
            Open your pack, discover profiles and find your match
          </p>

          <SignInButton />
        </div>
      </main>
    );
  }

  return <UserDashboard />;
}
