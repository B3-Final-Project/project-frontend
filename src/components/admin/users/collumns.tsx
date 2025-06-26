'use client'
import {ColumnDef} from '@tanstack/react-table'

interface TableParams {
  user_id: string,
  name: string,
  report_count: number,
  actions: any
}

export const UserManagementCollumns: ColumnDef<TableParams>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'user_id',
    header: 'User ID',
  },
  {
    accessorKey: 'report_count',
    header: 'Report Count',
  },
  {
    accessorKey: 'actions',
    header: 'Actions'
  }
]
