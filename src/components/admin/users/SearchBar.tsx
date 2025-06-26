import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

function SearchBar() {
  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `users-export-${timestamp}.csv`;

    // Create CSV headers
    const headers = ['User ID', 'Name', 'Surname', 'Email', 'Status', 'Report Count', 'Created At'];
    const csvContent = headers.join(',') + '\n';

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
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
        >
          <Download size={18} />
          Export Data
        </Button>
      </div>
    </div>
  )
}

export default SearchBar;
