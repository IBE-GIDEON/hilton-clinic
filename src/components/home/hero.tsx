"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE } from "../motion";
import { ArrowRight } from "../icons";

/* Cut-out portrait (transparent background) generated from Unsplash photo mOSuHTOqZF8 by David Akinwale */
const DOCTOR = { src: "/images/hero-doctor.webp", width: 901, height: 1738 };

function Beams() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#e9f1f7_0%,#eef4f9_45%,#f6f9fc_100%)]" />
      {/* fan of soft light rays from the top centre */}
      <motion.div
        className="absolute left-1/2 top-[-12%] h-[135%] w-[190%] -translate-x-1/2 blur-[28px]"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, rgba(255,255,255,0.95) 0deg, rgba(255,255,255,0) 9deg, rgba(255,255,255,0) 17deg, rgba(255,255,255,0.75) 23deg, rgba(255,255,255,0) 31deg, rgba(255,255,255,0) 41deg, rgba(255,255,255,0.6) 47deg, rgba(255,255,255,0) 56deg, rgba(255,255,255,0) 304deg, rgba(255,255,255,0.6) 313deg, rgba(255,255,255,0) 319deg, rgba(255,255,255,0) 329deg, rgba(255,255,255,0.75) 337deg, rgba(255,255,255,0) 343deg, rgba(255,255,255,0) 351deg, rgba(255,255,255,0.95) 360deg)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 75% at 50% 0%, #000 35%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 60% 75% at 50% 0%, #000 35%, transparent 100%)",
        }}
        animate={{ opacity: [0.85, 1, 0.85], rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* bright core behind the headline */}
      <div className="absolute left-1/2 top-[-18%] h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
      {/* sky accent glows */}
      <div className="absolute -left-[10%] bottom-[-10%] h-[55%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.16),transparent)]" />
      <div className="absolute -right-[10%] bottom-[-10%] h-[55%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.16),transparent)]" />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // depth parallax: doctor and watermark drift in opposite directions
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const docX = useTransform(sx, [-1, 1], [-12, 12]);
  const wordX = useTransform(sx, [-1, 1], [28, -28]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const docY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") mx.set((e.clientX / window.innerWidth) * 2 - 1);
      }}
      onPointerLeave={() => mx.set(0)}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <Beams />

      {/* Oversized watermark word, sits behind the doctor */}
      <motion.div
        aria-hidden="true"
        style={{ x: wordX, y: wordY }}
        className="pointer-events-none absolute inset-x-0 bottom-[3%] -z-[5] flex select-none justify-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
          className="whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(8.5rem,31vw,31rem)] font-semibold leading-[0.8] tracking-[-0.065em] text-[#0c4a6e]/[0.06]"
        >
          Hilton
        </motion.span>
      </motion.div>

      {/* Copy */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative z-20 mx-auto flex w-full max-w-[920px] flex-col items-center px-5 pt-[clamp(7.5rem,17vh,10.5rem)] text-center"
      >
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,5.7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
          {["Specialist Care", "Close to Home."].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.15 + i * 0.1 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          className="mt-5 max-w-[31rem] text-[16px] leading-relaxed text-ink/65 sm:text-[17px]"
        >
          Consultant-led kidney, heart and family care,
          <br className="hidden sm:block" /> open 24 hours in Ada-George, Port Harcourt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/book"
            className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14.5px] font-medium text-white shadow-[0_16px_32px_-12px_rgba(7,19,30,0.6)] transition-colors hover:bg-ink-2"
          >
            Book an Appointment
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400 text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-45">
              <ArrowRight size={17} />
            </span>
          </Link>
          <Link
            href="/services"
            className="inline-flex h-[52px] items-center rounded-full bg-white px-7 text-[14.5px] font-medium text-ink shadow-[0_14px_30px_-14px_rgba(7,19,30,0.3)] ring-1 ring-ink/[0.04] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Explore Services
          </Link>
        </motion.div>
      </motion.div>

      {/* Doctor, anchored to the bottom edge */}
      <motion.div style={{ x: docX, y: docY }} className="relative z-10 min-h-[380px] flex-1">
        <motion.div
          initial={{ opacity: 0, y: 90, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.7, ease: EASE, delay: 0.3 }}
          className="absolute left-1/2 top-3 h-[128%] -translate-x-1/2"
        >
          {/* soft sky halo behind the head and shoulders */}
          <div className="absolute -inset-x-[30%] top-[2%] -z-10 h-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.38),transparent)] blur-2xl" />
          <Image
            src={DOCTOR.src}
            alt="Smiling Hilton Clinics surgeon in blue scrubs with a stethoscope, arms folded"
            width={DOCTOR.width}
            height={DOCTOR.height}
            preload
            sizes="(max-width: 768px) 80vw, 560px"
            className="h-full w-auto max-w-none select-none drop-shadow-[0_30px_40px_rgba(12,74,110,0.18)]"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* blend into the next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-white via-white/50 to-transparent" />
    </section>
  );
}
