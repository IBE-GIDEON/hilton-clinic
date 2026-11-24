import type { Metadata } from "next";
import Image from "next/image";
import { SectionLabel } from "@/components/section-label";
import { ButtonLink } from "@/components/button";
import { DrawLine, ImageReveal, Parallax, Reveal, SplitLines, Stagger, StaggerItem } from "@/components/motion";
import { site, whatsappLink } from "@/lib/site";
import { Heart, Shield, Users, Flask } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Hilton Clinics",
  description:
    "Learn about Hilton Clinics in Mile 4, off Ada-George Road, Port Harcourt — our medical leadership, renal & specialist care, and 24-hour commitment to families.",
};

const values = [
  {
    icon: Heart,
    title: "Dignity first",
    body: "Whether you are here for a quick malaria test or three dialysis sessions every week, you are greeted by name and treated without rush.",
  },
  {
    icon: Shield,
    title: "Evidence-led decisions",
    body: "We rely on careful examination and reliable in-house diagnostics — never unnecessary procedures, and always plain-English explanations.",
  },
  {
    icon: Users,
    title: "Whole-family continuity",
    body: "Parents, children and older relatives often share the same hospital. Keeping records and care under one roof builds genuine long-term trust.",
  },
  {
    icon: Flask,
    title: "Same-roof diagnostics",
    body: "Our medical laboratory works directly alongside our clinicians so critical blood work, kidney panels and blood sugar checks inform care immediately.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-paper pb-24 pt-36 lg:pt-44">
      <div className="container-x">
        <SectionLabel index="01" label="About Hilton Clinics" />

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.5rem,6vw,5.25rem)] text-ink"
              lines={["Quiet excellence", "in Ada-George."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15.5px] leading-relaxed text-ink-soft">
              A private, 24-hour multi-specialty hospital in Mile 4, Rumuepirikom, Port Harcourt — combining specialist kidney care with warm everyday family medicine.
            </p>
          </Reveal>
        </div>

        {/* Hero wide photo */}
        <ImageReveal className="relative mt-14 aspect-[16/9] max-h-[580px] w-full overflow-hidden rounded-[3px] bg-paper-deep">
          <Parallax amount={8} className="h-full w-full">
            <Image
              src="/images/team.jpg"
              alt="Doctors and nurses walking down a bright corridor at Hilton Clinics Port Harcourt"
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
        </ImageReveal>

        {/* Story & leadership */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02" label="Leadership" />
            <h2 className="heading mt-6 text-[clamp(1.75rem,3vw,2.6rem)] text-ink">
              Led by specialists who know Rivers State.
            </h2>
          </div>
          <Reveal className="space-y-5 text-[16.5px] leading-[1.75] text-ink-soft lg:col-span-7">
            <p>
              Hilton Clinics was built around a simple conviction: families in Port Harcourt should not have to travel out of state — or sit in overwhelming, impersonal waiting rooms — to receive dependable specialist care.
            </p>
            <p>
              Under the clinical leadership of Founder and Medical Director{" "}
              <strong className="font-medium text-ink">Prof. Okafor Umezurike Hughes</strong>, the hospital became widely trusted for nephrology, haemodialysis and kidney transplant care, while expanding steadily to serve mothers, children, heart patients and 24-hour emergencies.
            </p>
            <p>
              Tucked quietly at 2 Ejekwu Wike Street, just off Ada-George Road by Wimpey, our doors stay open 24 hours a day, seven days a week — backed by attentive nursing staff, private inpatient wards and an on-site medical laboratory.
            </p>
          </Reveal>
        </div>

        {/* Values */}
        <DrawLine className="mt-20" />
        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-[3px] border border-line bg-white p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-blue-soft text-blue">
                    <Icon size={18} />
                  </span>
                  <h3 className="heading mt-5 text-[20px] text-ink">{v.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Inside the clinic gallery */}
        <div className="mt-24">
          <SectionLabel index="03" label="Inside Hilton Clinics" />
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <ImageReveal className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-paper-deep">
                <Image src="/images/reception.jpg" alt="Hilton Clinics reception and waiting lounge" fill sizes="(max-width:768px) 100vw, 58vw" className="object-cover" />
              </ImageReveal>
              <p className="eyebrow mt-2.5 text-muted">Reception &amp; calm waiting lounge</p>
            </div>
            <div className="md:col-span-5">
              <ImageReveal delay={0.1} className="relative aspect-[16/10] h-full overflow-hidden rounded-[3px] bg-paper-deep">
                <Image src="/images/ward.jpg" alt="Private inpatient recovery room" fill sizes="(max-width:768px) 100vw, 42vw" className="object-cover" />
              </ImageReveal>
              <p className="eyebrow mt-2.5 text-muted">Private inpatient &amp; recovery rooms</p>
            </div>
            <div className="md:col-span-6">
              <ImageReveal delay={0.1} className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-paper-deep">
                <Image src="/images/dialysis.jpg" alt="Modern haemodialysis bay" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
              </ImageReveal>
              <p className="eyebrow mt-2.5 text-muted">Haemodialysis &amp; renal care bay</p>
            </div>
            <div className="md:col-span-6">
              <ImageReveal delay={0.18} className="relative aspect-[3/2] overflow-hidden rounded-[3px] bg-paper-deep">
                <Image src="/images/lab.jpg" alt="On-site medical laboratory" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
              </ImageReveal>
              <p className="eyebrow mt-2.5 text-muted">On-site diagnostic laboratory</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-24 flex flex-col items-start justify-between gap-6 rounded-[3px] border border-line bg-white p-8 sm:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-blue">Visit us anytime</p>
            <h2 className="heading mt-2 text-[clamp(1.6rem,3vw,2.35rem)] text-ink">
              Come see us at {site.address.line1}, Ada-George.
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              Book an appointment online or message our front desk on WhatsApp for directions and consultation hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book" variant="primary">Book an appointment</ButtonLink>
            <ButtonLink href={whatsappLink()} variant="outline" external arrow={false}>Chat on WhatsApp</ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
