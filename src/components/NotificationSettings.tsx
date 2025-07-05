'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Bell, BellOff, Settings, TestTube, Volume2, VolumeX, Smartphone, Eye, EyeOff } from 'lucide-react';
import { useMessageNotifications } from '../hooks/useMessageNotifications';
import { NotificationPermission } from '../lib/utils/notification-utils';

interface NotificationSettingsProps {
  className?: string;
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
      // Si la permission est refusée, proposer d'ouvrir les paramètres
      setTimeout(() => {
        if (confirm('Voulez-vous ouvrir les paramètres de notification du navigateur ?')) {
          openNotificationSettings();
        }
      }, 1000);
    }
  };

  const getPermissionStatus = () => {
    switch (notificationState.permission) {
      case NotificationPermission.GRANTED:
        return { text: 'Autorisées', color: 'bg-green-100 text-green-700', icon: Bell };
      case NotificationPermission.DENIED:
        return { text: 'Refusées', color: 'bg-red-100 text-red-700', icon: BellOff };
      case NotificationPermission.DEFAULT:
        return { text: 'Non demandées', color: 'bg-yellow-100 text-yellow-700', icon: Bell };
      default:
        return { text: 'Inconnu', color: 'bg-gray-100 text-gray-700', icon: BellOff };
    }
  };

  const permissionStatus = getPermissionStatus();
  const StatusIcon = permissionStatus.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
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
              ⚠️ Les notifications ne sont pas supportées par votre navigateur.
            </p>
          </div>
        )}

        {/* Demande de permission */}
        {notificationState.permission === NotificationPermission.DEFAULT && notificationState.isSupported && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Activer les notifications</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Recevez des notifications pour les nouveaux messages et matches
                </p>
              </div>
              <Button onClick={handlePermissionRequest} size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Activer
              </Button>
            </div>
          </div>
        )}

        {/* Permission refusée */}
        {notificationState.permission === NotificationPermission.DENIED && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Notifications désactivées</h4>
                <p className="text-sm text-red-700 mt-1">
                  Vous devez autoriser les notifications dans les paramètres de votre navigateur
                </p>
              </div>
              <Button onClick={openNotificationSettings} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        )}

        {/* Paramètres avancés */}
        {notificationState.permission === NotificationPermission.GRANTED && (
          <>
            {/* Bouton pour développer/réduire */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between"
            >
              <span>Paramètres avancés</span>
              <Settings className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>

            {isExpanded && (
              <div className="space-y-4 pt-2 border-t">
                {/* Test de notification */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TestTube className="w-4 h-4 text-gray-500" />
                    <Label htmlFor="test-notification" className="text-sm">
                      Tester les notifications
                    </Label>
                  </div>
                  <Button onClick={testNotification} variant="outline" size="sm">
                    Tester
                  </Button>
                </div>

                {/* Paramètres de son */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notificationState.settings?.sound ? (
                      <Volume2 className="w-4 h-4 text-gray-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-500" />
                    )}
                    <Label htmlFor="sound-toggle" className="text-sm">
                      Son
                    </Label>
                  </div>
                  <Switch
                    id="sound-toggle"
                    checked={notificationState.settings?.sound}
                    onCheckedChange={(checked: boolean) => saveNotificationSettings({ sound: checked })}
                  />
                </div>

                {/* Paramètres de vibration */}
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

                {/* Paramètres d'aperçu */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notificationState.settings?.showPreview ? (
                      <Eye className="w-4 h-4 text-gray-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                    <Label htmlFor="preview-toggle" className="text-sm">
                      Aperçu du message
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
                    Dernière demande : {notificationState.lastRequested.toLocaleDateString('fr-FR')}
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