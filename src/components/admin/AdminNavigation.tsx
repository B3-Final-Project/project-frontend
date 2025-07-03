"use client";

import { AlertTriangle, BarChart3, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
  },
  {
    key: "reports",
    label: "Reports",
    icon: AlertTriangle,
  },
];

function AdminNavigation() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentKey = navigationItems.find((item) =>
    searchParams.has(item.key),
  )?.key;

  const handleNavigation = (key: string) => {
    const newParams = new URLSearchParams(searchParams);

    // Clear all navigation params and set the new one
    navigationItems.forEach(item => {
      newParams.delete(item.key);
    });
    newParams.set(key, "");

    router.push(`/admin?${newParams.toString()}`);
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentKey === item.key;

              return (
                <Button
                  key={item.key}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminNavigation;
