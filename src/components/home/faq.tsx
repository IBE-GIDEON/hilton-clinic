"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import { EASE } from "../motion";
import { Wordmark } from "./wordmark";
import { RevealLines } from "./reveal-lines";

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Do I need an appointment?",
    a: "Not for emergencies, just walk in, any hour. For specialist clinics, booking ahead shortens your wait.",
  },
  {
    q: "Can I start dialysis here?",
    a: "Yes. Book under Kidney Care or message us, and bring your latest kidney function results.",
  },
  {
    q: "Are lab tests done on-site?",
    a: "Yes. Most blood, urine and pregnancy tests are done here, often during the same visit.",
  },
  {
    q: "Can family come with me?",
    a: "Of course. You're welcome to bring someone you trust into the consultation.",
  },
  {
    q: "How do I change my booking?",
    a: (
      <>
        Use your reference code on{" "}
        <Link href="/appointment" className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-sky-500">
          Manage Booking
        </Link>{" "}
        to reschedule or cancel.
      </>
    ),
  },
  {
    q: "What should I bring?",
    a: "A valid ID, any past results or scans, and the medicines you currently take.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <li className="border-b border-ink/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left lg:py-7"
      >
        <span className="font-[family-name:var(--font-serif)] text-[clamp(1.5rem,2.3vw,2rem)] leading-tight tracking-[-0.01em] text-ink">
          {q}
        </span>
        <span
          aria-hidden="true"
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
            open ? "border-ink bg-ink text-white" : "border-ink/15 text-ink group-hover:border-ink/40"
          }`}
        >
          <motion.span
            className="absolute h-px w-3.5 bg-current"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          <motion.span
            className="absolute h-3.5 w-px bg-current"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[34rem] pb-7 pr-14 text-[15px] leading-relaxed text-ink/55">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-32">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Wordmark a="good" b="questions." />
          </motion.div>
          <RevealLines
            lines={["Questions,", "Answered."]}
            italicLast
            className="title-serif mt-6 text-[clamp(3.2rem,6vw,5.6rem)] text-ink"
          />
          <p className="mt-8 text-[13.5px] text-ink/45">
            Still unsure? Call{" "}
            <a href={`tel:${site.phones.emergency.tel}`} className="text-ink/80 transition-colors hover:text-sky-600">
              {site.phones.emergency.display}
            </a>
          </p>
        </div>

        <ul className="border-t border-ink/[0.08]">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
