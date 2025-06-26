import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table"
import { FullScreenLoading } from "@/components/FullScreenLoading";
import SearchBar from "@/components/admin/users/SearchBar";
import { SortControls } from "@/components/admin/users/SortControls";
import { UserManagementCollumns } from "./collumns";
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import { useAllProfilesQuery } from "@/hooks/react-query/profiles";

function UserManagement() {
  const [sortBy, setSortBy] = useState<'reportCount' | 'createdAt' | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const query = useAllProfilesQuery(sortBy, sortOrder);

  const handleSortChange = (newSortBy: 'reportCount' | 'createdAt', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Flatten all pages data
  const allUsers = useMemo(() => {
    if (!query.data?.pages) return [];
    return query.data.pages.reduce((acc: UserManagementDto[], page) => {
      return [...acc, ...page.profiles];
    }, []);
  }, [query.data?.pages]);

  // Get total count from the first page
  const totalCount = query.data?.pages?.[0]?.totalCount ?? 0;

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FullScreenLoading />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600">{query.error?.message || 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar/>
        <SortControls 
          sortBy={sortBy} 
          sortOrder={sortOrder} 
          onSortChange={handleSortChange} 
        />
      </div>
      <div className="space-y-4">
        <DataTable columns={UserManagementCollumns} data={allUsers}/>

        {/* Load More Button */}
        {query.hasNextPage && (
          <div className="flex justify-center">
            <Button
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
              variant="outline"
              className="min-w-[120px]"
            >
              {query.isFetchingNextPage ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                `Load More (${allUsers.length}/${totalCount})`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
