import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export enum NotificationStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  PLANNED = 'planned'
}

export const getStatusConfig = (status: string) => {
  switch (status) {
    case NotificationStatus.COMPLETED:
      return { color: 'bg-green-100 text-green-700', icon: CheckCircle };
    case NotificationStatus.IN_PROGRESS:
      return { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle };
    case NotificationStatus.PLANNED:
      return { color: 'bg-blue-100 text-blue-700', icon: Info };
    default:
      return { color: 'bg-gray-100 text-gray-700', icon: Info };
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case NotificationStatus.COMPLETED:
      return 'Terminé';
    case NotificationStatus.IN_PROGRESS:
      return 'En cours';
    default:
      return 'Prévu';
  }
}; 