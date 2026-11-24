import type { Metadata } from "next";
import { SectionLabel } from "@/components/section-label";
import { SplitLines, Reveal } from "@/components/motion";
import { ContactForm } from "@/components/contact-form";
import { site, mapsDirections, mapsEmbed, mapsPlace, whatsappLink } from "@/lib/site";
import { Clock, MapPin, Navigation, Phone, WhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact & Live Location",
  description:
    "Find Hilton Clinics at 2 Ejekwu Wike Street, Mile 4, off Ada-George Road, Rumuepirikom, Port Harcourt. Open 24 hours daily with live map directions, emergency phone lines and WhatsApp.",
};

const landmarks = [
  {
    from: "From Wimpey Junction / Ikwerre Road",
    detail:
      "Turn onto Ada-George Road towards Mile 4 / Rumuepirikom. Look out for Ejekwu Wike Street (opposite the former Silver Spoon Hotel axis) — Hilton Clinics is at Number 2.",
  },
  {
    from: "From Mgbuoba / NTA Road",
    detail:
      "Head south along Ada-George Road past Rumuepirikom towards Wimpey Junction. Turn off into Ejekwu Wike Street just before the Wimpey corridor.",
  },
  {
    from: "By Bolt / Uber / Drop-off",
    detail:
      'Search "Hilton Clinics, Ejekwu Wike Street, Ada-George" or use coordinates 4.83017, 6.97530. Calm on-site drop-off is available right at reception.',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-paper pb-24 pt-36 lg:pt-44">
      <div className="container-x">
        <SectionLabel index="01" label="Contact & Location" />

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.5rem,6vw,5rem)] text-ink"
              lines={["Here whenever", "you need us."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15.5px] leading-relaxed text-ink-soft">
              Call our 24-hour emergency desk, message us directly on WhatsApp, or use the live map below to reach us off Ada-George Road.
            </p>
          </Reveal>
        </div>

        {/* Direct contact cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal className="rounded-[3px] border border-line bg-white p-6">
            <p className="eyebrow flex items-center gap-2 text-blue">
              <Phone size={14} /> 24-Hour Emergency Line
            </p>
            <a
              href={`tel:${site.phones.emergency.tel}`}
              className="heading mt-3 block text-[26px] text-ink hover:text-blue"
            >
              {site.phones.emergency.display}
            </a>
            <p className="mt-2 text-[13.5px] text-muted">
              Front desk: <a href={`tel:${site.phones.mobile.tel}`} className="text-ink hover:underline">{site.phones.mobile.display}</a> · Landline:{" "}
              <a href={`tel:${site.phones.landline.tel}`} className="text-ink hover:underline">{site.phones.landline.display}</a>
            </p>
          </Reveal>

          <Reveal delay={0.08} className="rounded-[3px] border border-line bg-white p-6">
            <p className="eyebrow flex items-center gap-2 text-[#1f7a4d]">
              <WhatsApp size={14} /> WhatsApp Front Desk
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="heading mt-3 block text-[26px] text-ink hover:text-[#1f7a4d]"
            >
              Chat instantly →
            </a>
            <p className="mt-2 text-[13.5px] text-muted">
              Fast replies for appointment enquiries, dialysis chairs, lab preparation and directions.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="rounded-[3px] border border-line bg-white p-6">
            <p className="eyebrow flex items-center gap-2 text-blue">
              <Clock size={14} /> Opening Hours
            </p>
            <p className="heading mt-3 text-[26px] text-ink">Open 24 / 7</p>
            <p className="mt-2 text-[13.5px] text-muted">
              Outpatient clinics Mon–Fri 8am–6pm, Sat 9am–3pm. Emergency &amp; wards never close.
            </p>
          </Reveal>
        </div>

        {/* Form + Live Map */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="map-tint relative h-[380px] w-full overflow-hidden rounded-[3px] border border-line bg-paper-deep sm:h-[430px]">
              <iframe
                title="Hilton Clinics live Google Map — 2 Ejekwu Wike Street, Ada-George, Port Harcourt"
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg transition-colors hover:bg-blue"
              >
                <Navigation size={14} /> Start navigation
              </a>
            </div>

            <div className="rounded-[3px] border border-line bg-white p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow flex items-center gap-2 text-blue">
                    <MapPin size={14} /> Street Address
                  </p>
                  <address className="mt-2 not-italic text-[16px] leading-relaxed text-ink">
                    {site.address.line1}, {site.address.line2}, {site.address.area}, {site.address.city}, {site.address.state}
                  </address>
                </div>
                <a
                  href={mapsPlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u text-[13px] font-medium text-blue"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div className="rule-dotted my-5" />

              <div className="space-y-4">
                {landmarks.map((l) => (
                  <div key={l.from}>
                    <p className="text-[13.5px] font-medium text-ink">{l.from}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{l.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
