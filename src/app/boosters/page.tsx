"use client";

// ***********************************************************
// Est-ce que je dois vraiment faire un component ??
// ***********************************************************

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { checkPackAvailability, clearPackOpenTimestamps } from '../../utils/packManager';

const BoosterVerificationPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable' | 'redirecting'>('checking');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const { canOpen, timeUntilNextOpenMs } = checkPackAvailability();
    if (canOpen) {
      setStatus('available');
    } else {
      setCountdown(timeUntilNextOpenMs || 0);
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    if (status === 'unavailable' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (status === 'unavailable' && countdown <= 0) {
      clearPackOpenTimestamps();
      setStatus('redirecting');
    }
  }, [status, countdown]);

  useEffect(() => {
    if (status === 'available' || status === 'redirecting') {
      router.push('/boosters/ouverture');
    }
  }, [status, router]);

  if (status === 'checking' || status === 'redirecting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <FullScreenLoading />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 sm:p-10 text-center my-5 mx-auto max-w-[600px] w-full">
        <h1 className="text-2xl sm:text-3xl text-slate-800 mb-5 sm:mb-6 font-semibold">Prochain booster disponible</h1>
        <p className="text-6xl sm:text-8xl font-bold text-indigo-600 my-5 sm:my-6 mb-8 sm:mb-10 tracking-wider">{new Date(countdown).toISOString().substring(11, 19)}</p>
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
