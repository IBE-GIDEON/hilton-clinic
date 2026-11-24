"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "../section-label";
import { ButtonLink } from "../button";
import { ImageReveal, Magnetic, Reveal, SplitLines } from "../motion";
import { whatsappLink } from "@/lib/site";
import { Check, WhatsApp } from "../icons";

const highlights = [
  "Consultant nephrologist oversight on dialysis plans and prescriptions",
  "Scheduled daytime sessions and urgent haemodialysis support",
  "Quiet, clean treatment bays with attentive renal nursing throughout",
  "Pre-transplant donor/recipient work-up and ongoing post-transplant monitoring",
];

export function KidneySpotlight() {
  return (
    <section className="relative overflow-hidden bg-blue-deep py-24 text-white lg:py-36">
      <div className="container-x">
        <SectionLabel index="03" label="Flagship Renal Centre" light />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SplitLines
              as="h2"
              className="display text-[clamp(2.3rem,5.2vw,4.5rem)]"
              lines={["Dedicated kidney", "& dialysis care."]}
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-white/80">
                Managing kidney disease takes technical rigour and deep human steadiness. Hilton Clinics is recognised across Port Harcourt and Rivers State for consultant-led nephrology, reliable haemodialysis, and compassionate transplant preparation and follow-up.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <ul className="mt-8 space-y-3.5 border-t border-white/15 pt-8">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-white/90">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/12 text-sky">
                      <Check size={12} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="/book?service=nephrology-dialysis" variant="light">
                  Schedule a renal visit
                </ButtonLink>
              </Magnetic>
              <a
                href={whatsappLink("Hello Hilton Clinics, I would like to speak with the dialysis and nephrology team.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-[3px] border border-white/30 px-5 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
              >
                <WhatsApp size={16} /> Ask dialysis desk
              </a>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-12 lg:col-span-6">
            <div className="sm:col-span-12">
              <ImageReveal className="relative aspect-[3/2] w-full overflow-hidden rounded-[3px] bg-ink">
                <Image
                  src="/images/dialysis.jpg"
                  alt="Renal nurse carefully adjusting a modern haemodialysis machine beside a comfortable patient"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
            <div className="sm:col-span-7">
              <ImageReveal delay={0.12} className="relative aspect-[3/2] w-full overflow-hidden rounded-[3px] bg-ink">
                <Image
                  src="/images/ward.jpg"
                  alt="Private sunlit recovery ward room at Hilton Clinics"
                  fill
                  sizes="(max-width: 1024px) 60vw, 28vw"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
            <Reveal delay={0.2} className="flex flex-col justify-between rounded-[3px] border border-white/15 bg-white/[0.06] p-6 sm:col-span-5">
              <p className="eyebrow text-sky">For families</p>
              <div>
                <p className="text-[14.5px] leading-relaxed text-white/85">
                  Travelling to Port Harcourt for dialysis? Message our renal desk ahead of time and we will reserve your chair and review your recent results.
                </p>
                <Link
                  href="/services/nephrology-dialysis"
                  className="link-u mt-4 inline-block text-[13px] font-medium text-white"
                >
                  Read dialysis guide →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
