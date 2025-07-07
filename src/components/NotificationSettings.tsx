'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Bell, BellOff, Settings, TestTube, Volume2, VolumeX, Smartphone, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { useMessageNotifications } from '../hooks/useMessageNotifications';
import { NotificationPermission } from '../lib/utils/notification-utils';
import { toast } from '../hooks/use-toast';

interface NotificationSettingsProps {
  readonly className?: string;
}

export function NotificationSettings({ className }: NotificationSettingsProps) {
  const {
    notificationState,
    requestNotificationPermission,
    openNotificationSettings,
    testNotification,
    saveNotificationSettings,
  } = useMessageNotifications();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePermissionRequest = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      // If permission is denied, offer to open settings
      setTimeout(() => {
        if (confirm('Do you want to open browser notification settings?')) {
          openNotificationSettings();
        }
      }, 1000);
    }
  };



  const permissionStatus = (() => {
    switch (notificationState.permission) {
      case NotificationPermission.GRANTED:
        return { text: 'Allowed', color: 'bg-green-100 text-green-700', icon: Bell };
      case NotificationPermission.DENIED:
        return { text: 'Denied', color: 'bg-red-100 text-red-700', icon: BellOff };
      case NotificationPermission.DEFAULT:
        return { text: 'Not asked', color: 'bg-yellow-100 text-yellow-700', icon: Bell };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: BellOff };
    }
  })();
  const StatusIcon = permissionStatus.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </div>
          <Badge className={permissionStatus.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {permissionStatus.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* État du support */}
        {!notificationState.isSupported && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Notifications are not supported by your browser.
            </p>
          </div>
        )}

        {/* Demande de permission */}
        {notificationState.permission === NotificationPermission.DEFAULT && notificationState.isSupported && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Enable notifications</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Receive notifications for new messages and matches
                </p>
              </div>
              <Button onClick={handlePermissionRequest} size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Enable
              </Button>
            </div>
          </div>
        )}

        {/* Permission refusée */}
        {notificationState.permission === NotificationPermission.DENIED && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Notifications denied</h4>
                <p className="text-sm text-red-700 mt-1">
                  You must allow notifications in your browser settings
                </p>
              </div>
              <Button onClick={openNotificationSettings} size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        )}

        {/* Advanced settings */}
        {notificationState.permission === NotificationPermission.GRANTED && (
          <>
            {/* Expand/collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span>Advanced settings</span>
              <Settings className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>

            {isExpanded && (
              <div className="space-y-4 pt-2 border-t">
                {/* Notification test */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TestTube className="w-4 h-4 text-gray-500" />
                    <Label htmlFor="test-notification" className="text-sm">
                      Test notifications
                    </Label>
                  </div>
                  <Button onClick={testNotification} variant="outline" size="sm">
                    Test
                  </Button>
                </div>

                {/* Toast test */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <Label htmlFor="test-toast" className="text-sm">
                      Test toasts
                    </Label>
                  </div>
                  <Button onClick={() => toast({
                    title: "Toast test",
                    description: "This is a test to verify that toasts are working correctly.",
                    variant: "default",
                  })} variant="outline" size="sm">
                    Test
                  </Button>
                </div>

                {/* Sound settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notificationState.settings?.sound ? (
                      <Volume2 className="w-4 h-4 text-gray-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-500" />
                    )}
                    <Label htmlFor="sound-toggle" className="text-sm">
                      Sound
                    </Label>
                  </div>
                  <Switch
                    id="sound-toggle"
                    checked={notificationState.settings?.sound}
                    onCheckedChange={(checked: boolean) => saveNotificationSettings({ sound: checked })}
                  />
                </div>

                {/* Vibration settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <Label htmlFor="vibration-toggle" className="text-sm">
                      Vibration
                    </Label>
                  </div>
                  <Switch
                    id="vibration-toggle"
                    checked={notificationState.settings?.vibration}
                    onCheckedChange={(checked: boolean) => saveNotificationSettings({ vibration: checked })}
                  />
                </div>

                {/* Preview settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notificationState.settings?.showPreview ? (
                      <Eye className="w-4 h-4 text-gray-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                    <Label htmlFor="preview-toggle" className="text-sm">
                      Message preview
                    </Label>
                  </div>
                  <Switch
                    id="preview-toggle"
                    checked={notificationState.settings?.showPreview}
                    onCheckedChange={(checked: boolean) => saveNotificationSettings({ showPreview: checked })}
                  />
                </div>

                {/* Dernière demande */}
                {notificationState.lastRequested && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Last request: {notificationState.lastRequested.toLocaleDateString('en-US')}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 