"use client";

import { useRouter, useSearchParams } from "next/navigation";

import AdminStats from "@/components/admin/dashboard/AdminStats";
import { Button } from "@/components/ui/button";
import { JSX } from "react";
import RecentReports from "./reports/RecentReports";
import UserManagement from "./users/UserManagement";
import clsx from "clsx";

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
  const router = useRouter();
  const currentKey = Object.keys(adminRoutes).find((key) =>
    searchParams.has(key)
  );

  const handleNavigation = (key: string) => {
    router.push(`/admin?${key}`);
  };

  return (
    <>
      <nav className="flex w-full items-center justify-center gap-4 my-4">
        {Object.entries(adminRoutes).map(([key, { title }]) => {
          const isSelected = key === currentKey;
          return (
            <Button 
              key={key} 
              onClick={() => handleNavigation(key)}
              className={clsx('bg-transparent text-black hover:text-white',{ "bg-blue-300": isSelected })}
            >
              {title}
            </Button>
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
