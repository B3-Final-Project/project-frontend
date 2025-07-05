'use client';

import { IoChevronBack, IoMenu } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ConversationHeaderProps {
    readonly name: string;
    readonly avatar: string;
    readonly isOnline?: boolean;
    readonly onToggleList?: () => void;
    readonly showBackButton?: boolean;
}

export default function ConversationHeader({ 
    name, 
    avatar, 
    isOnline = true,
    onToggleList,
    showBackButton = true
}: ConversationHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-10  shadow-sm">
            <div className="px-3 py-2 md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
                        {showBackButton && (
                            <>
                                <button
                                    onClick={() => router.back()}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                                    aria-label="Retour"
                                >
                                    <IoChevronBack className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onToggleList}
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden md:block"
                                    aria-label="Afficher la liste des conversations"
                                >
                                    <IoMenu className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        <div className="flex-shrink-0">
                            <Image
                                src={avatar}
                                alt={name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border-2"
                            />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                                {name}
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 truncate">
                                {isOnline ? 'En ligne' : 'Hors ligne'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 
