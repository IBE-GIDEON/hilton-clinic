"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { EASE } from "./motion";
import { ArrowRight, Phone, Search } from "./icons";

export const OPEN_SEARCH_EVENT = "hc-open-search";

export function openCareSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

const popular = ["Dialysis", "Pregnancy", "Blood pressure", "Diabetes", "Child fever", "Back pain"];

export function CareSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return services.slice(0, 6);
    return services
      .filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.short.toLowerCase().includes(term) ||
          s.conditions.some((c) => c.toLowerCase().includes(term)) ||
          s.offers.some((o) => o.toLowerCase().includes(term))
      )
      .slice(0, 6);
  }, [q]);

  const close = () => {
    setOpen(false);
    setQ("");
    setActive(0);
  };

  const go = (slug: string) => {
    close();
    router.push(`/services/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="care-search"
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Find care"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            }
            if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active].slug);
            }
          }}
        >
          <button aria-label="Close search" onClick={close} className="absolute inset-0 bg-ink/55 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative w-full max-w-[640px] overflow-hidden rounded-[28px] bg-white shadow-[0_50px_120px_-30px_rgba(0,0,0,0.6)]"
          >
            <label className="flex items-center gap-3 border-b border-line-soft px-6">
              <Search size={20} className="text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder="What brings you in? Try “dialysis” or “pregnancy”"
                aria-label="Search conditions and services"
                className="h-[68px] flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-[#9aa2aa]"
              />
              <kbd className="hidden rounded-md border border-line px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-muted sm:block">
                ESC
              </kbd>
            </label>

            {!q && (
              <div className="flex flex-wrap gap-2 px-6 pt-5">
                {popular.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQ(p)}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <ul className="max-h-[46vh] overflow-y-auto p-3">
              {results.map((r, i) => (
                <li key={r.slug}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.slug)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors ${
                      i === active ? "bg-paper" : ""
                    }`}
                  >
                    <span
                      className="h-11 w-11 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${r.image})` }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium text-ink">{r.name}</span>
                      <span className="block truncate text-[13px] text-muted">{r.conditions.slice(0, 3).join(" · ")}</span>
                    </span>
                    <ArrowRight size={16} className={`shrink-0 transition-all ${i === active ? "translate-x-0 text-teal opacity-100" : "-translate-x-1 opacity-0"}`} />
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-6 text-[14px] text-muted">
                  No direct match. Start with a{" "}
                  <Link href="/book" onClick={close} className="text-teal underline underline-offset-2">
                    general consultation
                  </Link>{" "}
                  and we&apos;ll route you to the right doctor.
                </li>
              )}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-line-soft bg-paper/60 px-6 py-4 text-[13px]">
              <span className="text-muted">Feels urgent?</span>
              <a href={`tel:${site.phones.emergency.tel}`} className="inline-flex items-center gap-2 font-medium text-clay">
                <Phone size={15} /> Call 24/7 · {site.phones.emergency.display}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
