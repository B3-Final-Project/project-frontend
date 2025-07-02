"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';

export const NotificationsContainer: React.FC = () => {
  const router = useRouter();
  const { notifications } = useMessageNotifications();

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenConversation(notification.conversationId)}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
            <p className="text-xs text-gray-500 truncate">{notification.body}</p>
            <p className="text-xs text-gray-400">{notification.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 