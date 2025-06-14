"use client";

import MatchPage from '@/components/match/MatchPage';
import { recordPackOpening } from '@/utils/packManager';
import { useEffect, useRef } from 'react';
import '../../../styles/pokemon-pack-opener.css';
import '../../../styles/zip-animation.css';

const BoosterOuverturePage = () => {
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === false) {
            recordPackOpening();
            console.log('Pack opening recorded.');
            effectRan.current = true;
        }
    }, []);

    return <MatchPage />;

};

export default BoosterOuverturePage;
