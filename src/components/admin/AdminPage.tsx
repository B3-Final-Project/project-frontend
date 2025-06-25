"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import AdminStats from "./root/AdminStats";
import RecentReports from "./reports/RecentReports";
import UserManagement from "./users/UserManagement";
import { JSX } from "react";

const adminRoutes: Record<
  string,
  { title: string; component: JSX.Element }
> = {
  dashboard: {
    title: "Dashboard",
    component: <AdminStats />,
  },
  reports: {
    title: "Reports",
    component: <RecentReports />,
  },
  users: {
    title: "User Management",
    component: <UserManagement />,
  },
};

function AdminPage() {
  const searchParams = useSearchParams();
  const currentKey = Object.keys(adminRoutes).find((key) =>
    searchParams.has(key)
  );

  return (
    <div>
      <nav className="flex gap-2 mb-4">
        {Object.entries(adminRoutes).map(([key, { title }]) => {
          const isSelected = key === currentKey;
          return (
            <a key={key} href={`/admin?${key}`}>
              <Button className={clsx({ "bg-blue-300": isSelected })}>
                {title}
              </Button>
            </a>
          );
        })}
      </nav>

      {currentKey ? (
        adminRoutes[currentKey].component
      ) : (
        <p>Select a section from above.</p>
      )}
    </div>
  );
}

export default AdminPage;
