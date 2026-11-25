import type { Metadata } from "next";
import { UnderConstruction } from "@/components/under-construction";

export const metadata: Metadata = {
  title: "Book an Appointment",
  robots: { index: false, follow: true },
};

export default function BookPage() {
  return <UnderConstruction a="book" b="appointment." />;
}
