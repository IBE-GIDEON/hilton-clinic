import type { Metadata } from "next";
import { AdminDesk } from "@/components/admin-desk";

export const metadata: Metadata = {
  title: "Front Desk Staff Portal",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDesk />;
}
