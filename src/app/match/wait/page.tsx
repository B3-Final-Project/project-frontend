'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getMsUntilTomorrow } from '../../../utils/dateUtils';
import { canOpenNewPack, getTimeUntilNextPackAvailability } from '../../../utils/packManager';

const formatTime = (ms: number): string => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function MatchWaitPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const checkPackAvailabilityAndRedirect = useCallback(() => {
        if (canOpenNewPack()) {
            router.replace('/match');
            return true;
        }
        return false;
    }, [router]);

    useEffect(() => {
        if (checkPackAvailabilityAndRedirect()) {
            return;
        }
        setCountdown(getTimeUntilNextPackAvailability());
        setIsLoading(false);
    }, [checkPackAvailabilityAndRedirect]);

    useEffect(() => {
        if (isLoading || countdown <= 0) {
            if (!isLoading && countdown <= 0) checkPackAvailabilityAndRedirect();
            return;
        }

        const timerId = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1000) {
                    clearInterval(timerId);
                    checkPackAvailabilityAndRedirect();
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [countdown, isLoading, checkPackAvailabilityAndRedirect]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4">
                <p className="text-lg">Chargement de la page d'attente...</p>
            </div>
        );
    }

    const displayCountdown = !canOpenNewPack() && countdown <= 0
        ? getTimeUntilNextPackAvailability() || getMsUntilTomorrow()
        : countdown;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white p-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">Prochain pack disponible bientôt !</h3>
            <p className="text-muted-foreground mb-8 text-center">Vous avez utilisé tous vos packs pour aujourd'hui.</p>
            {displayCountdown > 0 ? (
                <div className="text-4xl sm:text-6xl font-mono bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg">
                    {formatTime(displayCountdown)}
                </div>
            ) : (
                <p className="text-lg">Vérification de la disponibilité des packs...</p>
            )}
            <button
                onClick={() => router.push('/')}
                className="mt-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
                Retour à l'accueil
            </button>
        </div>
    );
}
