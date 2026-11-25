import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Patient Guide",
  robots: { index: false, follow: true },
};

export default function PatientsPage() {
  return <UnderConstruction a="patient" b="guide." />;
}
