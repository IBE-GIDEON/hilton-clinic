"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { services } from "@/lib/services";
import { SectionLabel } from "../section-label";
import { ButtonLink } from "../button";
import { EASE, SplitLines } from "../motion";
import { ArrowUpRight, Check, Clock } from "../icons";

const featured = services.slice(0, 8);

export function Specialties() {
  const [activeSlug, setActiveSlug] = useState(featured[0].slug);
  const current = featured.find((s) => s.slug === activeSlug) ?? featured[0];
  const currentIndex = featured.findIndex((s) => s.slug === current.slug);

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="01" label="Specialties" />

        {/* Horizontal boxed specialty selector echoing the architectural reference */}
        <div
          role="tablist"
          aria-label="Medical specialties"
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 pb-2 lg:gap-x-6 lg:gap-y-3"
        >
          {featured.map((s) => {
            const active = s.slug === current.slug;
            return (
              <button
                key={s.slug}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveSlug(s.slug)}
                className={`relative shrink-0 px-3.5 py-2 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="specialty-box"
                    className="absolute inset-0 rounded-[2px] border border-ink bg-paper/50"
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                )}
                <span className="relative z-10">{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Heading & overview link */}
        <div className="mt-14 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitLines
              as="h2"
              className="display text-[clamp(2.2rem,5vw,4.25rem)] text-ink"
              lines={["Specialist care", "under one roof."]}
            />
          </div>
          <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end lg:text-right">
            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Whether it is routine antenatal care, kidney dialysis, a child&apos;s fever or a specialist consultation, our doctors coordinate directly so you are never passed from pillar to post.
            </p>
            <Link href="/services" className="link-u inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue">
              View all {services.length} departments <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* Active specialty editorial showcase */}
        <div className="mt-12 border-t border-line pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14"
            >
              {/* Photo */}
              <div className="relative min-h-[320px] overflow-hidden rounded-[3px] bg-paper sm:min-h-[420px] lg:col-span-6 lg:min-h-[500px]">
                <motion.div
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={`${current.name} at Hilton Clinics Port Harcourt`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent p-6 text-white">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="eyebrow text-white/80">
                      {String(currentIndex + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")} · {current.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white/85">
                      <Clock size={13} /> Typical visit ~{current.duration} mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <span className="eyebrow text-blue">{current.short}</span>
                  <h3 className="heading mt-3 text-[clamp(1.85rem,3vw,2.75rem)] text-ink">{current.name}</h3>
                  <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">{current.intro}</p>

                  <div className="mt-8 border-t border-line-soft pt-7">
                    <p className="eyebrow mb-4 text-muted">What we provide</p>
                    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {current.offers.map((offer) => (
                        <li key={offer} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-soft">
                          <Check size={15} className="mt-0.5 shrink-0 text-blue" />
                          <span>{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {current.conditions.map((cond) => (
                      <span
                        key={cond}
                        className="rounded-[2px] border border-line bg-paper px-3 py-1 text-[12px] text-ink-soft"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line-soft pt-7">
                  <ButtonLink href={`/book?service=${current.slug}`} variant="primary">
                    Book {current.short.toLowerCase()}
                  </ButtonLink>
                  <ButtonLink href={`/services/${current.slug}`} variant="outline" arrow={false}>
                    Read department guide
                  </ButtonLink>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
