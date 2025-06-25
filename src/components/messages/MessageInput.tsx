'use client';

import { IoSend, IoImage } from 'react-icons/io5';

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function MessageInput({ value, onChange, onSend, onKeyPress }: MessageInputProps) {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="px-2 py-2 md:px-4 md:py-3">
                <div className="flex items-end gap-2 bg-gray-50 rounded-xl p-2">
                    <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <IoImage className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyPress={onKeyPress}
                        placeholder="Écrivez votre message..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-700 placeholder-gray-400 py-1 md:py-2 px-2 text-sm md:text-base min-h-[36px] md:min-h-[42px]"
                    />
                    <button 
                        onClick={onSend}
                        className={`
                            p-1.5 md:p-2 rounded-xl min-w-[32px] md:min-w-[40px]
                            ${value.trim() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                            transition-colors
                        `}
                        disabled={!value.trim()}
                    >
                        <IoSend className="w-4 h-4 md:w-5 md:h-5 mx-auto" />
                    </button>
                </div>
            </div>
        </footer>
    );
} 