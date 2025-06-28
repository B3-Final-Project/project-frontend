"use client";

import { AlertTriangle, Ban, Eye, ShieldCheck } from "lucide-react";
import { useBanUserMutation, useUnbanUserMutation } from "@/hooks/react-query/admin";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from '@tanstack/react-table'
import { UserManagementDto } from "@/lib/routes/admin/dto/user-management.dto";
import { UserProfileModalLoader } from "./UserProfileModalLoader";
import { useState } from "react";

export const UserManagementCollumns: ColumnDef<UserManagementDto>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name} {user.surname}</span>
          <span className="text-xs text-gray-500">ID: {user.userId}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'reportCount',
    header: 'Reports',
    cell: ({ row }) => {
      const count = row.original.reportCount;
      let variant: "destructive" | "secondary" | "outline" = "outline";

      if (count > 5) {
        variant = "destructive";
      } else if (count > 0) {
        variant = "secondary";
      }

      return (
        <div className="flex items-center gap-2">
          {count > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          <Badge variant={variant} className="text-xs">
            {count}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'isBanned',
    header: 'Status',
    cell: ({ row }) => {
      const isBanned = row.original.isBanned;
      return (
        <Badge
          variant={isBanned ? "destructive" : "default"}
          className="text-xs"
        >
          {isBanned ? "Banned" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-sm text-gray-400">Unknown</span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionsCell user={user} />;
    },
  },
];

function UserActionsCell({ user }: { readonly user: UserManagementDto }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const banUserMutation = useBanUserMutation();
  const unbanUserMutation = useUnbanUserMutation();

  const handleBanToggle = () => {
    if (user.isBanned) {
      unbanUserMutation.mutate(user.userId);
    } else {
      banUserMutation.mutate(user.userId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowProfileModal(true)}
        className="h-8 px-2"
      >
        <Eye className="h-3 w-3" />
      </Button>

      <Button
        variant={user.isBanned ? "default" : "destructive"}
        size="sm"
        onClick={handleBanToggle}
        disabled={banUserMutation.isPending || unbanUserMutation.isPending}
        className="h-8 px-2"
      >
        {user.isBanned ? (
          <ShieldCheck className="h-3 w-3" />
        ) : (
          <Ban className="h-3 w-3" />
        )}
      </Button>

      <UserProfileModalLoader
        user={user}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
