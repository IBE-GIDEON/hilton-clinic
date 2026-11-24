"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/lib/services";
import { EASE } from "../motion";
import { ArrowRight } from "../icons";
import { Wordmark } from "./wordmark";
import { RevealLines } from "./reveal-lines";

const view = { once: true, margin: "0px 0px -15% 0px" } as const;

/* Short, banner-style copy for every specialty */
const banners: Record<string, { a: string; b: string; title: string[]; image: string; focus?: string }> = {
  "nephrology-dialysis": { a: "kidney", b: "care.", title: ["Kidney Care,", "Done Right."], image: "/images/dialysis.jpg" },
  "kidney-transplant": { a: "transplant", b: "care.", title: ["A Second Chance,", "Guided."], image: "/images/ward.jpg" },
  cardiology: { a: "heart", b: "care.", title: ["Every Beat", "Matters."], image: "/images/cardiology.jpg" },
  "obstetrics-gynaecology": { a: "mother", b: "care.", title: ["Safe Births,", "Calm Mothers."], image: "/images/maternity.jpg" },
  paediatrics: { a: "child", b: "care.", title: ["Little Patients,", "Big Care."], image: "/images/paediatrics.jpg" },
  orthopaedics: { a: "bone", b: "care.", title: ["Move Freely", "Again."], image: "/images/orthopaedics.jpg" },
  "endocrinology-diabetes": { a: "diabetes", b: "care.", title: ["Sugar Under", "Control."], image: "/images/lab.jpg", focus: "object-[75%_center]" },
  dermatology: { a: "skin", b: "care.", title: ["Healthy Skin,", "Clear Answers."], image: "/images/hero.jpg", focus: "object-[68%_center]" },
  "laboratory-diagnostics": { a: "lab", b: "tests.", title: ["Answers,", "Same Visit."], image: "/images/lab.jpg", focus: "object-[25%_center]" },
  "emergency-general-practice": { a: "emergency", b: "care.", title: ["Open Every", "Single Hour."], image: "/images/reception.jpg" },
};

function Row({ slug, index }: { slug: string; index: number }) {
  const s = services.find((x) => x.slug === slug);
  const b = banners[slug];
  if (!s || !b) return null;
  const flip = index % 2 === 1;

  return (
    <li className="border-t border-ink/[0.07] first:border-t-0">
      <Link
        href={`/services/${slug}`}
        className="group grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-24 lg:py-24"
      >
        {/* Text */}
        <div className={flip ? "lg:order-2" : ""}>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease: EASE }}>
            <Wordmark a={b.a} b={b.b} />
          </motion.div>
          <RevealLines
            as="h3"
            lines={b.title}
            delay={0.05}
            className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.3rem,4.4vw,4rem)] font-semibold leading-[1.03] tracking-[-0.045em] text-ink"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={view}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          >
            <p className="mt-5 text-[15px] text-ink/45">{s.conditions.slice(0, 3).join("  ·  ")}</p>
            <span className="mt-7 inline-flex items-center gap-2 text-[14.5px] font-medium text-ink">
              Learn more
              <ArrowRight size={16} className="text-sky-500 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5" />
            </span>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 1.3, ease: EASE }}
          className={`relative isolate ${flip ? "lg:order-1" : ""}`}
        >
          <motion.div
            initial={{ clipPath: "inset(10% 7% 10% 7% round 32px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
            viewport={view}
            transition={{ duration: 1.3, ease: EASE }}
            className="relative aspect-[5/4] overflow-hidden rounded-[32px] bg-paper-deep"
          >
            <Image
              src={b.image}
              alt={`${s.name} at Hilton Clinics, Port Harcourt`}
              fill
              sizes="(max-width: 1024px) 92vw, 560px"
              className={`object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] ${b.focus ?? ""}`}
            />
          </motion.div>
          {/* studio floor shadow */}
          <div aria-hidden="true" className="absolute -bottom-5 left-[10%] right-[10%] -z-10 h-10 rounded-[50%] bg-ink/[0.14] blur-xl" />
        </motion.div>
      </Link>
    </li>
  );
}

export function Specialties() {
  const order = Object.keys(banners);
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[1240px] px-5 pt-28 sm:px-8 lg:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease: EASE }}>
              <Wordmark a="our" b="specialties." />
            </motion.div>
            <RevealLines
              lines={["Ten Clinics.", "One Roof."]}
              className="mt-7 font-[family-name:var(--font-display)] text-[clamp(2.7rem,5.2vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink"
            />
          </div>
        </div>

        <ul className="mt-10 pb-16 lg:mt-14">
          {order.map((slug, i) => (
            <Row key={slug} slug={slug} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
