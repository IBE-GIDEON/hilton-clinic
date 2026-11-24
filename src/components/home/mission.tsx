"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE } from "../motion";
import { Wordmark } from "./wordmark";
import { RevealLines } from "./reveal-lines";

const view = { once: true, margin: "0px 0px -15% 0px" } as const;

export function Mission() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#f4f5f6]">
      {/* soft studio light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_70%_45%,#ffffff_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 px-5 py-24 sm:px-8 lg:min-h-[88vh] lg:grid-cols-[1fr_1.15fr] lg:py-0">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease: EASE }}>
            <Wordmark a="our" b="mission." />
          </motion.div>

          <RevealLines
            lines={["Listen First.", "Then Heal."]}
            className="mt-7 font-[family-name:var(--font-display)] text-[clamp(2.7rem,5.2vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
            className="mt-6 max-w-[23rem] text-[16px] leading-relaxed text-ink/55"
          >
            Consultants who take their time, tests under one roof, and doors that never close.
          </motion.p>
        </div>

        {/* team, presented like a product on a studio floor */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[640px]"
        >
          <motion.div style={{ y: imgY }} className="relative">
            <Image
              src="/images/team-cutout.webp"
              alt="Hilton Clinics doctors and nurses walking together"
              width={708}
              height={574}
              sizes="(max-width: 1024px) 92vw, 640px"
              className="relative z-10 h-auto w-full select-none"
              draggable={false}
            />
            {/* floor shadow, moves with the feet */}
            <div aria-hidden="true" className="absolute -bottom-3 left-[6%] right-[4%] h-10 rounded-[50%] bg-ink/[0.16] blur-xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
