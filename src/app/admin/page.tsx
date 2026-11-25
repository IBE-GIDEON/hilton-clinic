import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Staff Portal",
  robots: { index: false, follow: true },
};

export default function AdminPage() {
  return <UnderConstruction a="staff" b="portal." />;
}
