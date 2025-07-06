'use client';

import { ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
import { GiWaterDrop, GiGrass, GiRock, GiMetalBar, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

export default function BoosterRedirect() {
    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <Link
                href="/boosters"
                className="group bg-gradient-to-br from-secondary to-primary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex items-center justify-between p-6"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full">
                        <Gift size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white text-xl font-bold">Discover Boosters</h2>
                        <p className="text-white/80 max-w-md">
                            Open boosters to discover new matches and expand your connections
                        </p>
                    </div>
                </div>
                <div className="bg-white/20 p-3 rounded-full transform transition-transform group-hover:translate-x-1">
                    <ArrowRight size={20} className="text-white" />
                </div>
            </Link>

            {/* Explication du fonctionnement des boosters */}
            <div className="mt-6 bg-card rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-medium mb-2">How Boosters Work</h3>
                <p className="text-muted-foreground mb-3">
                    Boosters are special packs that help you discover unique matches based on different algorithms and preferences. Each type offers a unique matching experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Les trois types de boosters les plus populaires */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-full mb-3">
                            <GiWaterDrop className="text-4xl text-blue-500" />
                        </div>
                        <h3 className="font-medium mb-1">Water Booster</h3>
                        <p className="text-xs text-muted-foreground">
                            Discover fluid connections with high compatibility and shared values.
                        </p>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="bg-emerald-100 dark:bg-emerald-800/30 p-3 rounded-full mb-3">
                            <GiGrass className="text-4xl text-emerald-600" />
                        </div>
                        <h3 className="font-medium mb-1">Nature Booster</h3>
                        <p className="text-xs text-muted-foreground">
                            Find natural matches based on common interests and activities.
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-full mb-3">
                            <GiPerspectiveDiceSixFacesRandom className="text-4xl text-purple-500" />
                        </div>
                        <h3 className="font-medium mb-1">Mystery Booster</h3>
                        <p className="text-xs text-muted-foreground">
                            Surprise matches with unexpected compatibility and unique personalities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


