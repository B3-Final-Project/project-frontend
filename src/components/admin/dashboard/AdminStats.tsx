"use client";

import { Separator } from "@/components/ui/separator";

function AdminStats() {

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your application statistics and user engagement
        </p>
      </div>

      <Separator />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div>
    </div>
  );
}

export default AdminStats;
