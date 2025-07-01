"use client";
import { useSearchParams } from "next/navigation";
import AdminStats from "@/components/admin/dashboard/AdminStats";
import { JSX } from "react";
import UserManagement from "./users/UserManagement";

const adminRoutes: Record<
  string,
  { title: string; component: JSX.Element }
> = {
  dashboard: {
    title: "Dashboard",
    component: <AdminStats />,
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

  return currentKey ? (
    adminRoutes[currentKey].component
  ) : (
    <p>Select a section from above.</p>
  )
}

export default AdminPage;
