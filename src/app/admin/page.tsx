import { AdminGate } from "@/components/admin/AdminGate";
import AdminPage from "@/components/admin/AdminPage";

export default function page() {
  return (
    <AdminGate>
      <AdminPage />
    </AdminGate>
  );
}
