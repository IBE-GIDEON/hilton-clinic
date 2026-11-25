"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { site } from "@/lib/site";
import { EASE } from "./motion";
import { ArrowRight } from "./icons";
import { Wordmark } from "./home/wordmark";
import { RevealLines } from "./home/reveal-lines";

/* Placeholder for pages that will be built once the project is signed off. */
export function UnderConstruction({ a, b }: { a: string; b: string }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#f4f5f6]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_40%_45%,#ffffff_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative mx-auto w-full max-w-[1240px] px-5 pb-24 pt-36 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
          <Wordmark a={a} b={b} />
        </motion.div>

        <RevealLines
          as="h2"
          lines={["Under", "Construction."]}
          italicLast
          className="title-serif mt-6 text-[clamp(3.6rem,8vw,7.5rem)] text-ink"
        />

        {/* quiet "in progress" bar */}
        <div className="mt-10 h-px w-48 overflow-hidden bg-ink/10" aria-hidden="true">
          <motion.div
            className="h-px w-1/3 bg-sky-500"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="mt-8 max-w-[26rem] text-[15px] leading-relaxed text-ink/55"
        >
          This page is being built. Until then, our team is one call away, day or night.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] font-medium"
        >
          <a href={`tel:${site.phones.emergency.tel}`} className="text-ink transition-colors hover:text-sky-600">
            Call {site.phones.emergency.display}
          </a>
          <Link href="/" className="group inline-flex items-center gap-2 text-ink/60 transition-colors hover:text-ink">
            Back to home
            <ArrowRight size={15} className="text-sky-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
