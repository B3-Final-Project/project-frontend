import React from 'react';
import { IoChevronForward } from 'react-icons/io5';

interface ConversationHeaderProps {
    title: string;
    isSidebarExpanded: boolean;
    onToggleSidebar: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
    title,
    isSidebarExpanded,
    onToggleSidebar
}) => {
    return (
        <div className="flex items-center p-4 border-b border-gray-200 bg-white h-[50px] z-10">
            <button
                onClick={onToggleSidebar}
                className="flex items-center justify-center rounded-full transition-colors p-2 hover:bg-gray-100 mr-2"
                aria-label={isSidebarExpanded ? "Réduire" : "Agrandir"}
            >
                <IoChevronForward 
                    className={`w-5 h-5 text-gray-600 transition-all duration-300 ease-in-out ${
                        isSidebarExpanded ? "" : "rotate-180"
                    }`} 
                />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
                {title}
            </h1>
        </div>
    );
}; 