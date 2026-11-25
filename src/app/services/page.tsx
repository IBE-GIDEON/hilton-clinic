import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Specialties",
  robots: { index: false, follow: true },
};

export default function ServicesPage() {
  return <UnderConstruction a="our" b="specialties." />;
}
