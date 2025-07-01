import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SortControlsProps {
  readonly sortBy?: 'reportCount' | 'createdAt';
  readonly sortOrder?: 'ASC' | 'DESC';
  onSortChange(sortBy: 'reportCount' | 'createdAt', sortOrder: 'ASC' | 'DESC'): void;
}

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  const handleSortReports = () => {
    if (sortBy === 'reportCount') {
      // Toggle order if already sorting by reports
      const newOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      onSortChange('reportCount', newOrder);
    } else {
      // Start with descending (highest reports first)
      onSortChange('reportCount', 'DESC');
    }
  };

  const handleSortDate = () => {
    if (sortBy === 'createdAt') {
      // Toggle order if already sorting by date
      const newOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
      onSortChange('createdAt', newOrder);
    } else {
      // Start with descending (newest first)
      onSortChange('createdAt', 'DESC');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'ASC' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Sort by:</span>
      <Button
        variant={sortBy === 'reportCount' ? 'default' : 'outline'}
        size="sm"
        onClick={handleSortReports}
        className="flex items-center gap-2"
      >
        {getSortIcon('reportCount')}
        Reports
      </Button>
      <Button
        variant={sortBy === 'createdAt' ? 'default' : 'outline'}
        size="sm"
        onClick={handleSortDate}
        className="flex items-center gap-2"
      >
        {getSortIcon('createdAt')}
        Join Date
      </Button>
    </div>
  );
}
