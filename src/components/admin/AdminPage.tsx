"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import RecentReports from "./reports/RecentReports";
import UserManagement from "./users/UserManagement";
import { JSX } from "react";
import AdminStats from "@/components/admin/dashboard/AdminStats";

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
    <>
      <nav className="flex w-full items-center justify-center gap-4 my-4">
        {Object.entries(adminRoutes).map(([key, { title }]) => {
          const isSelected = key === currentKey;
          return (
            <a key={key} href={`/admin?${key}`}>
              <Button className={clsx('bg-transparent text-black hover:text-white',{ "bg-blue-300": isSelected })}>
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
    </>
  );
}

export default AdminPage;
