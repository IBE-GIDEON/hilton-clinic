import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnderConstruction } from "@/components/under-construction";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Specialty",
  robots: { index: false, follow: true },
};

/* Placeholder route: render normally (blocking) rather than as an instant-navigation shell. */
export const instant = false;

/* Prerender every specialty page; unknown slugs fall through to the 404 page. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!services.some((s) => s.slug === slug)) notFound();
  return <UnderConstruction a="specialty" b="details." />;
}
