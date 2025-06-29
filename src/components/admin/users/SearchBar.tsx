import { Download, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface SearchBarProps {
  readonly userData?: UserManagementDto[];
  readonly onSearch?: (searchTerm: string) => void;
  readonly searchTerm?: string;
  readonly isSearching?: boolean;
}

function SearchBar({ userData, onSearch, searchTerm = '', isSearching = false }: SearchBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const handleSearchChange = (value: string) => {
    onSearch?.(value);
  };

  const clearSearch = () => {
    onSearch?.('');
  };
  const handleExport = async () => {
    if (!userData || userData.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users to export at the moment.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `users-export-${timestamp}.csv`;

      // Create CSV headers
      const headers = ['User ID', 'Profile ID', 'Name', 'Surname', 'Status', 'Report Count', 'Created At'];

      // Convert user data to CSV rows
      const csvRows = userData.map(user => [
        user.userId,
        user.profileId.toString(),
        user.name,
        user.surname,
        user.isBanned ? 'Banned' : 'Active',
        user.reportCount.toString(),
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
      ]);

      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Exported ${userData.length} users to ${filename}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, view profiles, and handle reports</p>
        </div>
        <Button
          onClick={handleExport}
          className="flex items-center gap-2"
          variant="outline"
          disabled={isExporting ?? !userData ?? userData.length === 0}
        >
          <Download size={18} />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          {isSearching ? (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          )}
          <Input
            type="text"
            placeholder="Search by name or surname (min 2 chars)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBar;
