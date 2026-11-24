"use client";

import { motion } from "motion/react";
import { EASE } from "../motion";

/*
 * Masked line-by-line headline reveal.
 * The in-view trigger sits on the heading itself (always visible), not on the masked lines,
 * which start fully clipped and would otherwise never be reported as "in view".
 */
export function RevealLines({
  lines,
  as = "h2",
  className = "",
  delay = 0.1,
}: {
  lines: string[];
  as?: "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const Tag = as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 1.05, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
