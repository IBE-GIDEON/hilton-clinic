import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Manage Booking",
  robots: { index: false, follow: true },
};

export default function AppointmentPage() {
  return <UnderConstruction a="manage" b="booking." />;
}
