import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CareSearch } from "@/components/care-search";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Hilton Clinics — Specialist Hospital, Ada-George, Port Harcourt",
    template: "%s · Hilton Clinics",
  },
  description: site.description,
  keywords: [
    "Hilton Clinics",
    "hospital Port Harcourt",
    "dialysis Port Harcourt",
    "kidney specialist Port Harcourt",
    "Ada George hospital",
    "nephrology Rivers State",
    "maternity Port Harcourt",
  ],
  openGraph: {
    title: "Hilton Clinics — Port Harcourt",
    description: site.description,
    images: ["/images/hero.jpg"],
    locale: "en_NG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05101b",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hospital",
  name: site.name,
  description: site.description,
  telephone: site.phones.emergency.tel,
  openingHours: "Mo-Su 00:00-23:59",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: "NG",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  medicalSpecialty: ["Nephrology", "Cardiology", "Obstetrics", "Gynecology", "Pediatrics", "Orthopedics", "Dermatology", "Endocrinology"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className="h-full" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget />
          <CareSearch />
        </SmoothScroll>
      </body>
    </html>
  );
}
