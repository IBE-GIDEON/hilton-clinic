"use client";

import { useEffect, useState } from "react";
import { SectionLabel } from "../section-label";
import { Reveal, SplitLines } from "../motion";
import { site, mapsDirections, mapsEmbed } from "@/lib/site";
import { Clock, MapPin, Navigation, Phone } from "../icons";

function PortHarcourtClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-NG", {
          timeZone: "Africa/Lagos",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setTime(formatted);
      } catch {
        setTime("");
      }
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-[2px] border border-sage/30 bg-sage/10 px-3 py-1.5 text-[12px] font-medium text-sage">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
      </span>
      Open right now · 24/7{time ? ` · ${time} WAT` : ""}
    </span>
  );
}

export function LocationBand() {
  return (
    <section className="relative bg-paper py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="05" label="Ada-George · Port Harcourt" />

        <div className="mt-14 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitLines
              as="h2"
              className="display text-[clamp(2.2rem,5vw,4.25rem)] text-ink"
              lines={["Easy to find,", "always open."]}
            />
          </div>
          <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
            <PortHarcourtClock />
            <p className="text-[14px] text-muted lg:text-right">
              Quiet street right off Ada-George Road, Mile 4 — minutes from Wimpey Junction.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Live Google Map */}
          <Reveal className="lg:col-span-7">
            <div className="map-tint relative h-[420px] w-full overflow-hidden rounded-[3px] border border-line bg-paper-deep sm:h-[500px]">
              <iframe
                title="Hilton Clinics live map — 2 Ejekwu Wike Street, Ada-George, Port Harcourt"
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
              <div className="pointer-events-none absolute left-4 top-4 rounded-[3px] bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur">
                <p className="eyebrow text-blue">Live Coordinates</p>
                <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[12px] text-ink">
                  4.8302° N, 6.9753° E
                </p>
              </div>
              <a
                href={mapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-[3px] bg-ink px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg transition-colors hover:bg-blue"
              >
                <Navigation size={14} /> Open turn-by-turn directions
              </a>
            </div>
          </Reveal>

          {/* Practical clinic details */}
          <Reveal delay={0.12} className="flex flex-col justify-between rounded-[3px] border border-line bg-white p-7 sm:p-9 lg:col-span-5">
            <div className="space-y-7">
              <div>
                <p className="eyebrow flex items-center gap-2 text-blue">
                  <MapPin size={14} /> Address &amp; Landmarks
                </p>
                <address className="mt-3 not-italic text-[16px] leading-relaxed text-ink">
                  {site.address.line1}, {site.address.line2}
                  <br />
                  {site.address.area}, {site.address.city}, {site.address.state}
                </address>
                <p className="mt-2 text-[13.5px] text-muted">
                  Landmark: {site.address.landmark} (opposite the former Silver Spoon Hotel axis).
                </p>
              </div>

              <div className="rule-dotted" />

              <div>
                <p className="eyebrow flex items-center gap-2 text-blue">
                  <Clock size={14} /> Clinic Hours
                </p>
                <dl className="mt-3 space-y-2 text-[14px]">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-ink">Emergency &amp; Admissions</dt>
                    <dd className="text-sage font-medium">24 hours daily</dd>
                  </div>
                  {site.hours.consultations.map((row) => (
                    <div key={row.days} className="flex justify-between gap-4 text-ink-soft">
                      <dt>{row.days}</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rule-dotted" />

              <div>
                <p className="eyebrow flex items-center gap-2 text-blue">
                  <Phone size={14} /> Direct Phone Lines
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a
                    href={`tel:${site.phones.emergency.tel}`}
                    className="rounded-[2px] border border-line bg-paper/60 px-3.5 py-2.5 transition-colors hover:border-blue hover:bg-blue-soft/40"
                  >
                    <span className="block text-[11px] uppercase tracking-wider text-muted">Emergency (24/7)</span>
                    <span className="mt-0.5 block font-medium text-ink">{site.phones.emergency.display}</span>
                  </a>
                  <a
                    href={`tel:${site.phones.mobile.tel}`}
                    className="rounded-[2px] border border-line bg-paper/60 px-3.5 py-2.5 transition-colors hover:border-blue hover:bg-blue-soft/40"
                  >
                    <span className="block text-[11px] uppercase tracking-wider text-muted">Front Desk</span>
                    <span className="mt-0.5 block font-medium text-ink">{site.phones.mobile.display}</span>
                  </a>
                </div>
              </div>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  );
}
