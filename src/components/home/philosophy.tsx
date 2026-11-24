"use client";

import Image from "next/image";
import { SectionLabel } from "../section-label";
import { ButtonLink } from "../button";
import { Counter, DrawLine, ImageReveal, Parallax, Reveal, ScrollText, Stagger, StaggerItem } from "../motion";

const pillars = [
  {
    num: "01",
    title: "Consultants who take time to listen",
    body: "Every diagnosis starts with an unhurried conversation. We explain findings and options in plain language, and welcome family members into the room whenever you wish.",
  },
  {
    num: "02",
    title: "True 24-hour clinical continuity",
    body: "Doctors, nurses, laboratory staff and admission wards operate around the clock — so care never pauses at 5 pm, on weekends or on public holidays.",
  },
  {
    num: "03",
    title: "Rooted in Ada-George, serving Rivers State",
    body: "Located quietly off Ada-George Road by Wimpey, we are easy to reach without navigating city-centre gridlock, with calm waiting rooms and private inpatient wards.",
  },
];

const stats = [
  { value: 24, suffix: "/7", label: "Emergency & inpatient care" },
  { value: 10, suffix: "", label: "Clinical & diagnostic units" },
  { value: 365, suffix: "", label: "Days open every year" },
  { value: 1, suffix: "", label: "Roof for lab, scan & wards" },
];

export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 lg:py-36">
      <div className="container-x">
        <SectionLabel index="02" label="Our Approach" />

        {/* Large scroll-illuminated statement */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <ScrollText
              text="A hospital should feel calm the moment you walk in. At Hilton Clinics, specialist expertise meets unhurried human care — so families across Port Harcourt always have a place they can trust."
              className="heading text-[clamp(1.75rem,3.6vw,3.35rem)] leading-[1.15] text-ink"
            />
          </div>
          <div className="flex flex-col justify-end lg:col-span-3">
            <Reveal delay={0.15}>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">
                Led by Medical Director <strong className="font-medium text-ink">Prof. Okafor Umezurike Hughes</strong>, Hilton Clinics brings consultant-level nephrology, internal medicine, maternal and family care to Mile 4, Ada-George.
              </p>
              <div className="mt-6">
                <ButtonLink href="/about" variant="outline">
                  About our hospital
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Asymmetric editorial photography pair */}
        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ImageReveal className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-paper-deep">
              <Parallax amount={8} className="h-full w-full">
                <Image
                  src="/images/reception.jpg"
                  alt="Warm sunlit reception and waiting room at Hilton Clinics"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </Parallax>
            </ImageReveal>
            <p className="eyebrow mt-3 text-muted">Calm reception &amp; patient registration · 2 Ejekwu Wike Street</p>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:col-span-5 lg:pt-16">
            <ImageReveal delay={0.15} className="relative aspect-[16/11] w-full overflow-hidden rounded-[3px] bg-paper-deep">
              <Parallax amount={8} className="h-full w-full">
                <Image
                  src="/images/team.jpg"
                  alt="Hilton Clinics doctors and nurses walking together along a bright corridor"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </Parallax>
            </ImageReveal>
            <Reveal delay={0.2} className="rounded-[3px] border border-line bg-white p-7">
              <p className="eyebrow text-blue">Medical Leadership</p>
              <blockquote className="mt-3 text-[15.5px] leading-relaxed text-ink">
                &ldquo;Good medicine is never just equipment or prescriptions. It is knowing the patient before you, answering their family honestly, and standing by them through recovery.&rdquo;
              </blockquote>
              <p className="mt-4 text-[13px] text-muted">
                Prof. Okafor Umezurike Hughes · Founder &amp; Medical Director
              </p>
            </Reveal>
          </div>
        </div>

        {/* Three understated pillars */}
        <DrawLine className="mt-20" />
        <Stagger className="mt-14 grid gap-10 md:grid-cols-3" gap={0.1}>
          {pillars.map((p) => (
            <StaggerItem key={p.num}>
              <span className="eyebrow text-blue">{p.num}</span>
              <h3 className="heading mt-3 text-[22px] text-ink">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Quiet factual metrics band */}
        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-line pt-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="display text-[clamp(2.4rem,4.5vw,3.75rem)] text-ink">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13.5px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
