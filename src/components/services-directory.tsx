"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { services, type Service } from "@/lib/services";
import { EASE } from "./motion";
import { ArrowRight, Clock, Search } from "./icons";

const categories: Array<"All" | Service["category"]> = [
  "All",
  "Specialist",
  "Family",
  "Diagnostics",
  "Emergency",
];

export function ServicesDirectory() {
  const [cat, setCat] = useState<"All" | Service["category"]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.conditions.some((c) => c.toLowerCase().includes(q)) ||
        s.offers.some((o) => o.toLowerCase().includes(q))
      );
    });
  }, [cat, query]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-5 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter specialties by category">
          {categories.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={active}
                onClick={() => setCat(c)}
                className={`relative rounded-[2px] px-4 py-2 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="services-cat"
                    className="absolute inset-0 rounded-[2px] bg-ink"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            );
          })}
        </div>

        <label className="flex w-full items-center gap-2.5 rounded-[3px] border border-line bg-white px-3.5 focus-within:border-blue lg:w-80">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by condition or service…"
            aria-label="Search departments"
            className="h-11 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9aa2aa]"
          />
        </label>
      </div>

      {/* Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((s) => (
            <motion.article
              key={s.slug}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="group flex flex-col overflow-hidden rounded-[3px] border border-line bg-white transition-colors duration-300 hover:border-ink/35"
            >
              <Link href={`/services/${s.slug}`} className="relative aspect-[16/10] overflow-hidden bg-paper-deep">
                <Image
                  src={s.image}
                  alt={`${s.name} at Hilton Clinics`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <span className="eyebrow absolute left-3.5 top-3.5 rounded-[2px] bg-white/90 px-2.5 py-1 text-ink backdrop-blur">
                  {s.category}
                </span>
              </Link>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between text-[12px] text-muted">
                    <span className="eyebrow text-blue">{s.short}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> ~{s.duration}m
                    </span>
                  </div>
                  <h2 className="heading mt-2.5 text-[22px] text-ink">
                    <Link href={`/services/${s.slug}`} className="hover:text-blue transition-colors">
                      {s.name}
                    </Link>
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{s.summary}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-5">
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors group-hover:text-blue"
                  >
                    Department guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="rounded-[2px] border border-line px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-blue hover:bg-blue hover:text-white"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 rounded-[3px] border border-line bg-white p-10 text-center">
          <p className="heading text-[22px] text-ink">No matching department found</p>
          <p className="mt-2 text-[14.5px] text-muted">
            Try clearing your filter, or reach out to our front desk and we will point you to the right doctor.
          </p>
          <button
            onClick={() => {
              setCat("All");
              setQuery("");
            }}
            className="mt-5 rounded-[3px] bg-ink px-5 py-2.5 text-[13px] text-white hover:bg-blue"
          >
            Show all departments
          </button>
        </div>
      )}
    </div>
  );
}
