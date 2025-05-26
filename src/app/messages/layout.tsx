'use client';

import { ReactNode, useState, useEffect } from "react";
import { use } from 'react';
import { usePathname } from "next/navigation";
import ConversationsList from "./_components/ConversationsList";
import { IoChevronForward, IoClose } from 'react-icons/io5';

interface MessagesLayoutProps {
  children: ReactNode;
  params?: Promise<{ id?: string }>;
}

// Constantes pour les classes CSS communes
const COMMON_TRANSITION = 'transition-all duration-300 ease-in-out';
const COMMON_BUTTON_CLASSES = 'flex items-center justify-center rounded-full transition-colors';
const COMMON_ICON_CLASSES = 'w-5 h-5 text-gray-600';

export default function MessagesLayout({ children, params }: MessagesLayoutProps) {
  const pathname = usePathname();
  const resolvedParams = params ? use(params) : {};
  const isMessagesRoot = pathname === '/messages';
  const conversationId = !isMessagesRoot ? Number(resolvedParams.id || pathname.split('/').pop()) : null;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListVisible, setIsListVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    if (!isMobileView) {
      setIsListVisible(true);
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMessagesRoot) {
      setIsListVisible(true);
      setIsExpanded(true);
    } else if (isMobile) {
      setIsListVisible(false);
    }
  }, [isMessagesRoot, isMobile]);

  const toggleList = () => {
    if (isMobile) {
      setIsListVisible(!isListVisible);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const getConversationWidth = () => {
    if (isMessagesRoot) return 'w-full';
    if (!isListVisible) return 'w-0';
    if (!isExpanded) return 'w-[60px]';
    return 'w-full md:w-[35%] lg:w-[30%] 2xl:w-[25%] max-w-[450px] min-w-[300px]';
  };

  const getConversationPosition = () => {
    return isMobile && isListVisible
      ? 'fixed inset-0 z-40 bg-white'
      : 'relative border-r border-gray-200 bg-white';
  };

  const ToggleButton = () => (
    <button
      onClick={toggleList}
      className={`
        fixed z-50 ${COMMON_TRANSITION}
        ${isMobile
          ? 'top-4 left-4 p-2.5 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white'
          : 'top-1/2 -translate-y-1/2 left-0 rounded-r-xl p-2 bg-white shadow-md hover:bg-gray-50'
        }
        ${COMMON_BUTTON_CLASSES}
      `}
      aria-label={isListVisible ? "Masquer la liste" : "Afficher la liste"}
    >
      <IoChevronForward 
        className={`
          ${COMMON_ICON_CLASSES}
          ${isListVisible ? 'rotate-180' : ''}
          ${isMobile ? '' : 'mx-auto'}
          transition-transform
        `}
      />
    </button>
  );

  const ConversationsPanel = () => (
    <aside 
      className={`
        ${getConversationWidth()}
        ${getConversationPosition()}
        ${COMMON_TRANSITION}
        h-full flex-shrink-0 overflow-hidden
      `}
    >
      <div className="h-full relative flex flex-col">
        {(isListVisible || !isMobile) && (
          <>
            {isMobile && !isMessagesRoot && (
              <div className="sticky top-0 z-10 px-4 py-2 bg-white border-b border-gray-100">
                <button
                  onClick={() => setIsListVisible(false)}
                  className={`${COMMON_BUTTON_CLASSES} ml-auto w-8 h-8 bg-gray-100 hover:bg-gray-200`}
                  aria-label="Fermer la liste"
                >
                  <IoClose className={COMMON_ICON_CLASSES} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <ConversationsList
                isExpanded={isMessagesRoot || isExpanded}
                selectedId={conversationId}
                onToggle={toggleList}
                isMobile={isMobile}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );

  const MessagesPanel = () => (
    !isMessagesRoot && (
      <div 
        className={`
          flex-1 h-full min-w-0 bg-gray-50 relative
          ${isMobile && isListVisible ? 'hidden' : 'flex flex-col'}
          ${!isExpanded && !isMobile ? 'ml-[60px]' : ''}
          ${COMMON_TRANSITION}
        `}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    )
  );

  return (
    <main className="flex h-screen overflow-hidden bg-gray-50">
      {!isMessagesRoot && (!isListVisible || !isExpanded) && (
        <div className="relative z-50">
          <ToggleButton />
        </div>
      )}
      <div className="flex flex-1 h-full overflow-hidden">
        <ConversationsPanel />
        <MessagesPanel />
      </div>
    </main>
  );
}
