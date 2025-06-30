"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { MessageNotification } from './MessageNotification';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';

export const NotificationsContainer: React.FC = () => {
  const router = useRouter();
  const { notifications, removeNotification } = useMessageNotifications();

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <MessageNotification
          key={notification.id}
          message={notification}
          onClose={() => removeNotification(notification.id)}
          onOpenConversation={handleOpenConversation}
        />
      ))}
    </div>
  );
}; 