import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {icon && (
        <div className="text-gray-400">
          {icon}
        </div>
      )}
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}; 