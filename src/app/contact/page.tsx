import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return <UnderConstruction a="contact" b="us." />;
}
