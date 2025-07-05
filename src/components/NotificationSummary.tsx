'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationSummaryProps {
  readonly className?: string;
}

export function NotificationSummary({ className }: NotificationSummaryProps) {
  const improvements = [
    {
      title: 'Notifications natives du navigateur',
      description: 'Support complet des notifications push natives avec gestion des permissions',
      status: 'completed',
      icon: Bell
    },
    {
      title: 'Gestion d&apos;état robuste',
      description: 'Persistance des paramètres et gestion des états de permission',
      status: 'completed',
      icon: CheckCircle
    },
    {
      title: 'Paramètres personnalisables',
      description: 'Son, vibration, aperçu des messages et autres options',
      status: 'completed',
      icon: CheckCircle
    },
    {
      title: 'Interface utilisateur intuitive',
      description: 'Interface dédiée pour la gestion des notifications',
      status: 'completed',
      icon: CheckCircle
    },
    {
      title: 'Gestion des erreurs',
      description: 'Fallbacks et messages d&apos;erreur informatifs',
      status: 'completed',
      icon: AlertCircle
    },
    {
      title: 'Intégration WebSocket',
      description: 'Notifications en temps réel pour messages et matches',
      status: 'completed',
      icon: CheckCircle
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'in-progress':
        return { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle };
      case 'planned':
        return { color: 'bg-blue-100 text-blue-700', icon: Info };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: Info };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      default:
        return 'Prévu';
    }
  };

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
          {improvements.map((improvement) => {
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