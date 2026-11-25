"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { site, mapsDirections, mapsEmbed } from "@/lib/site";
import { EASE } from "../motion";
import { ArrowUpRight } from "../icons";
import { Wordmark } from "./wordmark";
import { RevealLines } from "./reveal-lines";

const view = { once: true, margin: "0px 0px -12% 0px" } as const;

function useLagosTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", hour: "numeric", minute: "2-digit", hour12: true });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-6 border-t border-ink/[0.07] py-4">
      <dt className="w-20 shrink-0 text-[12.5px] text-ink/40">{label}</dt>
      <dd className="text-[14px] leading-relaxed text-ink/75">{children}</dd>
    </div>
  );
}

export function FindUs() {
  const time = useLagosTime();

  return (
    <section className="relative overflow-hidden bg-[#f4f5f6]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_68%_50%,#ffffff_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-32">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease: EASE }}>
            <Wordmark a="find" b="us." />
          </motion.div>
          <RevealLines
            lines={["Always Open.", "Easy to Find."]}
            italicLast
            className="title-serif mt-6 text-[clamp(3.2rem,6vw,5.6rem)] text-ink"
          />

          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="mt-10 max-w-[25rem] border-b border-ink/[0.07]"
          >
            <Line label="Address">
              {site.address.line1}, off Ada-George Rd, Port Harcourt
            </Line>
            <Line label="Hours">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Open 24 hours{time && <span className="text-ink/40">· {time} now</span>}
              </span>
            </Line>
            <Line label="Call">
              <a href={`tel:${site.phones.emergency.tel}`} className="transition-colors hover:text-sky-600">
                {site.phones.emergency.display}
              </a>
            </Line>
          </motion.dl>

          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={view}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
            href={mapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-ink"
          >
            Get directions
            <ArrowUpRight size={15} className="text-sky-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        {/* Map, framed like the other images: rounded, with a soft floor shadow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
          className="relative isolate"
        >
          <div className="map-tint relative aspect-[4/3.3] overflow-hidden rounded-[32px] bg-paper-deep ring-1 ring-ink/[0.05]">
            <iframe
              title="Map: Hilton Clinics, 2 Ejekwu Wike Street, Ada-George, Port Harcourt"
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div aria-hidden="true" className="absolute -bottom-5 left-[10%] right-[10%] -z-10 h-10 rounded-[50%] bg-ink/[0.14] blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}
