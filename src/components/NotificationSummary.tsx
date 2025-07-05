'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationStatus, getStatusConfig, getStatusText } from '../lib/utils/notification-status';

interface NotificationSummaryProps {
  readonly className?: string;
}

const IMPROVEMENTS = [
  {
    title: 'Notifications natives du navigateur',
    description: 'Support complet des notifications push natives avec gestion des permissions',
    status: NotificationStatus.COMPLETED,
    icon: Bell
  },
  {
    title: 'Gestion d&apos;état robuste',
    description: 'Persistance des paramètres et gestion des états de permission',
    status: NotificationStatus.COMPLETED,
    icon: CheckCircle
  },
  {
    title: 'Paramètres personnalisables',
    description: 'Son, vibration, aperçu des messages et autres options',
    status: NotificationStatus.COMPLETED,
    icon: CheckCircle
  },
  {
    title: 'Interface utilisateur intuitive',
    description: 'Interface dédiée pour la gestion des notifications',
    status: NotificationStatus.COMPLETED,
    icon: CheckCircle
  },
  {
    title: 'Gestion des erreurs',
    description: 'Fallbacks et messages d&apos;erreur informatifs',
    status: NotificationStatus.COMPLETED,
    icon: AlertCircle
  },
  {
    title: 'Intégration WebSocket',
    description: 'Notifications en temps réel pour messages et matches',
    status: NotificationStatus.COMPLETED,
    icon: CheckCircle
  }
] as const;

export function NotificationSummary({ className }: NotificationSummaryProps) {



  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Améliorations du système de notifications
        </CardTitle>
        <CardDescription>
          Résumé des fonctionnalités ajoutées pour améliorer l&apos;expérience utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {IMPROVEMENTS.map((improvement) => {
            const statusConfig = getStatusConfig(improvement.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={improvement.title} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <StatusIcon className={`w-5 h-5 ${statusConfig.color.split(' ')[1]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{improvement.title}</h4>
                    <Badge className={statusConfig.color} variant="secondary">
                      {getStatusText(improvement.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{improvement.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Comment tester :</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Allez dans Messages → Cliquez sur l&apos;icône de notification</li>
            <li>• Activez les notifications dans votre navigateur</li>
            <li>• Testez les notifications avec le bouton &quot;Tester&quot;</li>
            <li>• Personnalisez les paramètres (son, vibration, aperçu)</li>
            <li>• Envoyez un message depuis un autre onglet/navigateur</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 