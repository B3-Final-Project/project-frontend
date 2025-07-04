import React from 'react';

interface DateSeparatorProps {
    date: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-500">
                    {date}
                </span>
            </div>
        </div>
    );
}; 