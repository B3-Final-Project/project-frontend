"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { checkPackAvailability, clearPackOpenTimestamps } from '../../utils/packManager';

const BoosterVerificationPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'waiting' | 'redirecting'>('loading');
  const [timeUntilNextOpenMs, setTimeUntilNextOpenMs] = useState<number>(0);

  useEffect(() => {
    const checkAvailability = () => {
      const { canOpen, timeUntilNextOpenMs: nextOpenMs } = checkPackAvailability();

      if (canOpen) {
        setStatus('redirecting');
        router.push('/boosters/ouverture');
      } else {
        setTimeUntilNextOpenMs(nextOpenMs || 0);
        setStatus('waiting');
      }
    };

    checkAvailability();
  }, [router]);

  useEffect(() => {
    if (status === 'waiting' && timeUntilNextOpenMs > 0) {
      const interval = setInterval(() => {
        setTimeUntilNextOpenMs(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(interval);
            clearPackOpenTimestamps();
            setStatus('redirecting');
            router.push('/boosters/ouverture');
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, timeUntilNextOpenMs, router]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <FullScreenLoading />
      </div>
    );
  }

  if (status === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <h1 className="text-2xl sm:text-3xl text-slate-800 mb-5 sm:mb-6 font-semibold">Prochain booster disponible</h1>
        <p className="text-6xl sm:text-8xl font-bold text-indigo-600 my-5 sm:my-6 mb-8 sm:mb-10 tracking-wider">{formatTime(timeUntilNextOpenMs)}</p>
        <p className="text-base sm:text-lg text-slate-500">Vous serez redirigé automatiquement.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
      <FullScreenLoading />
    </div>
  );
};

export default BoosterVerificationPage;
