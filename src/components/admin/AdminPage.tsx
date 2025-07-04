"use client";

import AdminNavigation from "./AdminNavigation";
import AdminStats from "@/components/admin/dashboard/AdminStats";
import { JSX } from "react";
import ReportsPage from "./reports/ReportsPage";
import UserManagement from "./users/UserManagement";
import { useSearchParams } from "next/navigation";

const adminRoutes: Record<string, { title: string; component: JSX.Element }> = {
  dashboard: {
    title: "Dashboard",
    component: <AdminStats />,
  },
  users: {
    title: "User Management",
    component: <UserManagement />,
  },
  reports: {
    title: "Reports Management",
    component: <ReportsPage />,
  },
};

function AdminPage() {
  const searchParams = useSearchParams();
  const currentKey = Object.keys(adminRoutes).find((key) =>
    searchParams.has(key),
  );

  // Default to dashboard if no route is selected
  const activeRoute = currentKey ?? "dashboard";
  const activeComponent = adminRoutes[activeRoute]?.component ?? adminRoutes.dashboard.component;

  return (
    <div className="min-h-screen">
      <AdminNavigation />
      <main className="container mx-auto">
        {activeComponent}
      </main>
    </div>
  );
}

export default AdminPage;
