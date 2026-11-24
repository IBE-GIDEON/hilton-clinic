"use client";

import { motion } from "motion/react";
import { EASE } from "./motion";

/* Kept for backwards compatibility with older layouts; renders nothing visible now. */
export function Crosshair({ className = "" }: { className?: string; light?: boolean }) {
  return <span aria-hidden="true" className={`pointer-events-none hidden ${className}`} />;
}

/* Small pill label that sits above section headlines */
export function SectionLabel({
  label,
  light = false,
  className = "",
}: {
  index?: string;
  label: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`flex ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium ${
          light ? "border-white/15 bg-white/[0.04] text-white/75" : "border-ink/10 bg-white/50 text-ink/70"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-aqua" : "bg-teal"}`} />
        {label}
      </span>
    </motion.div>
  );
}
