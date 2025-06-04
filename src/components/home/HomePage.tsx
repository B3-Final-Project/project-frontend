'use client'
import { useAuth } from "react-oidc-context";
import Image from "next/image";
import { Quantico } from "next/font/google";
import { clsx } from "clsx";
import { SignInButton } from "@/components/auth/SignInButton";

const quantico = Quantico({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function HomePage() {
  const auth = useAuth()

  if (auth.isLoading || !auth.user) {
    return (
      <main className={'flex flex-col items-center justify-center gap-10 h-screen'}>
        <Image src={"/logo.png"} alt={"holomatch logo"} width={557} height={448}/>
        <h1 className={clsx(quantico.className, 'text-4xl text-center')}>HOLOMATCH</h1>
        <p>Ouvre ton pack, découvre des profils
          et trouve ton match</p>
        <SignInButton/>
      </main>
  );
  } else {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <Image src={"/logo.png"} alt={"holomatch logo"} width={278} height={224}/>
        <h1 className={clsx(quantico.className, 'text-4xl text-center mt-10')}>Welcome, {auth.user.profile.email}!</h1>
        <p className="text-lg mt-4">You are logged in.</p>
      </main>
    );
  }
}
