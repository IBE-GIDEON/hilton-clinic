"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { site, whatsappLink, mapsDirections } from "@/lib/site";
import { services } from "@/lib/services";
import { ButtonLink } from "./button";
import { EASE, SplitLines } from "./motion";
import { LogoMark } from "./logo";
import { ArrowUpRight } from "./icons";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const year = 2026;

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="container-x pt-24 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8 text-white/50">When you need us</p>
            <SplitLines
              as="h2"
              className="display text-[clamp(2.6rem,6vw,5.5rem)]"
              lines={["Care that", "stays with you."]}
            />
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-5">
            <p className="max-w-md text-[15px] leading-relaxed text-white/65">
              Book a consultation online in under two minutes, or speak to our front desk directly. Our emergency team is on hand day and night.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/book" variant="light">Book an appointment</ButtonLink>
              <ButtonLink href={whatsappLink()} variant="outline-light" external arrow={false}>
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="rule-dotted-light mt-20" />

        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="eyebrow mb-5 text-white/45">Visit</p>
            <address className="not-italic text-[15px] leading-7 text-white/80">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.area}, {site.address.city}
              <br />
              {site.address.state}
            </address>
            <a href={mapsDirections} target="_blank" rel="noopener noreferrer" className="link-u mt-4 inline-flex items-center gap-1.5 text-sm text-white">
              Get directions <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow mb-5 text-white/45">Call</p>
            <ul className="space-y-3 text-[15px]">
              <li>
                <span className="block text-xs text-white/45">Emergency · 24 hours</span>
                <a className="link-u text-white" href={`tel:${site.phones.emergency.tel}`}>{site.phones.emergency.display}</a>
              </li>
              <li>
                <span className="block text-xs text-white/45">Front desk</span>
                <a className="link-u text-white/80" href={`tel:${site.phones.mobile.tel}`}>{site.phones.mobile.display}</a>
              </li>
              <li>
                <span className="block text-xs text-white/45">Landline</span>
                <a className="link-u text-white/80" href={`tel:${site.phones.landline.tel}`}>{site.phones.landline.display}</a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow mb-5 text-white/45">Specialties</p>
            <ul className="space-y-2.5 text-[14px] text-white/75">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link className="link-u hover:text-white" href={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow mb-5 text-white/45">Patients</p>
            <ul className="space-y-2.5 text-[14px] text-white/75">
              <li><Link className="link-u hover:text-white" href="/book">Book an appointment</Link></li>
              <li><Link className="link-u hover:text-white" href="/appointment">Manage a booking</Link></li>
              <li><Link className="link-u hover:text-white" href="/patients">Patient guide & FAQs</Link></li>
              <li><Link className="link-u hover:text-white" href="/about">About the clinic</Link></li>
              <li><Link className="link-u hover:text-white" href="/contact">Contact & location</Link></li>
              <li><Link className="link-u hover:text-white" href="/admin">Staff portal</Link></li>
            </ul>
            <p className="eyebrow mb-3 mt-8 text-white/45">Hours</p>
            <p className="text-[14px] text-white/75">{site.hours.summary}</p>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="relative select-none overflow-hidden" aria-hidden="true">
        <div className="container-x">
          <div className="flex items-end gap-[2vw] pb-4">
            <motion.div
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
              className="text-white/90"
              style={{ ["--logo-fg" as string]: "#0f1d2b" }}
            >
              <LogoMark size={0} className="h-[13vw] w-[13vw] max-h-[190px] max-w-[190px]" />
            </motion.div>
            <p className="display flex overflow-hidden text-[clamp(4rem,17vw,15.5rem)] leading-[0.8] text-white/90">
              {"HILTON".split("").map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.08 + i * 0.05 }}
                >
                  {c}
                </motion.span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[12px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} Hilton Clinics, Port Harcourt. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Information on this website is general and does not replace a consultation. In an emergency, call {site.phones.emergency.display} or come straight in.
          </p>
        </div>
      </div>
    </footer>
  );
}
