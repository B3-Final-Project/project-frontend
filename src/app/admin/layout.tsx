import { AdminGate } from "@/components/admin/AdminGate";

interface LayoutProps {
  children: React.ReactNode
}

function layout({children}: LayoutProps) {
  return <AdminGate>
    {children}
  </AdminGate>
}

export default layout
