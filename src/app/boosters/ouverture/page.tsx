"use client";

import { FullScreenLoading } from '@/components/FullScreenLoading';
import MatchPage from '@/components/match/MatchPage';
import { checkPackAvailability, recordPackOpening } from '@/utils/packManager';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../../../styles/pokemon-pack-opener.css';
import '../../../styles/zip-animation.css';

const BoosterOuverturePage = () => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const { canOpen } = checkPackAvailability();
        if (!canOpen) {
            router.push('/boosters');
        } else {
            recordPackOpening();
            console.log('Pack opening recorded.');
            setIsVerified(true);
        }
    }, [router]);

    if (!isVerified) {
        return <FullScreenLoading />;
    }

    return <MatchPage />;
};

export default BoosterOuverturePage;
