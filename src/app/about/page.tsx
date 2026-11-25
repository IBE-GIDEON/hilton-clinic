import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "About Hilton Clinics",
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return <UnderConstruction a="our" b="story." />;
}
