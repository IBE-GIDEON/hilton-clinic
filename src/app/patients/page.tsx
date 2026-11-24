import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { ButtonLink } from "@/components/button";
import { Reveal, SplitLines, Stagger, StaggerItem } from "@/components/motion";
import { Questions } from "@/components/home/questions";
import { site, whatsappLink } from "@/lib/site";
import { Check, Clock, Phone, WhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Patient Guide & Preparation",
  description:
    "Practical information before visiting Hilton Clinics in Port Harcourt — visiting hours, what to bring, dialysis and laboratory preparation, and emergency guidance.",
};

const guides = [
  {
    tag: "General Visits",
    title: "What to bring to your consultation",
    items: [
      "A valid means of identification and your phone number for your file",
      "Previous laboratory test results, X-rays or ultrasound reports",
      "All current medication packs (including supplements or herbal remedies)",
      "A family member or caregiver if you would like a second pair of ears",
    ],
  },
  {
    tag: "Kidney & Dialysis",
    title: "Preparing for haemodialysis",
    items: [
      "Bring recent urea, creatinine, electrolyte and viral screening results",
      "Wear loose sleeves that allow comfortable access to your fistula or line",
      "Have a light meal beforehand unless advised otherwise by your nephrologist",
      "Visiting Port Harcourt temporarily? Message us ahead to reserve your chair",
    ],
  },
  {
    tag: "Laboratory",
    title: "Before fasting blood tests",
    items: [
      "Fast for 8–10 hours before fasting blood sugar or lipid profile tests",
      "Plain water is fine during fasting — avoid tea, coffee and sugary drinks",
      "Continue essential morning blood-pressure medicine unless told otherwise",
      "Most routine blood work and urinalysis results are ready the same day",
    ],
  },
  {
    tag: "Maternity & Children",
    title: "Antenatal & child welfare visits",
    items: [
      "Bring your existing antenatal card or your child's immunisation card",
      "Partners are welcome at antenatal consultations and scans",
      "Note when a child's fever began and any doses of paracetamol already given",
      "Call our 24-hour line immediately if labour begins or symptoms worsen",
    ],
  },
];

export default function PatientsPage() {
  return (
    <div className="bg-paper pt-36 lg:pt-44">
      <div className="container-x pb-20">
        <SectionLabel index="01" label="Patient Guide" />

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.5rem,6vw,5rem)] text-ink"
              lines={["Helpful notes", "before you visit."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15.5px] leading-relaxed text-ink-soft">
              Everything you need to know about clinic hours, preparing for tests or dialysis, managing an online booking, and getting emergency help.
            </p>
          </Reveal>
        </div>

        {/* Emergency & Hours quick strip */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-[3px] bg-blue-deep p-7 text-white sm:p-9 lg:col-span-6">
            <p className="eyebrow text-sky">Medical Emergency</p>
            <h2 className="heading mt-2 text-[26px]">Open 24 hours — walk straight in</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              For chest pain, breathing trouble, severe bleeding, high fever in a young child, sudden weakness, or urgent dialysis, do not wait for a booking slot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${site.phones.emergency.tel}`}
                className="inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-paper"
              >
                <Phone size={15} /> Call {site.phones.emergency.display}
              </a>
              <a
                href={whatsappLink("Urgent enquiry for Hilton Clinics.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[3px] border border-white/30 px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-ink"
              >
                <WhatsApp size={15} /> WhatsApp Front Desk
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-between rounded-[3px] border border-line bg-white p-7 sm:p-9 lg:col-span-6">
            <div>
              <p className="eyebrow flex items-center gap-2 text-blue">
                <Clock size={14} /> Consultation &amp; Visiting Hours
              </p>
              <dl className="mt-5 space-y-3 text-[15px]">
                <div className="flex justify-between gap-4 border-b border-line-soft pb-3">
                  <dt className="font-medium text-ink">Emergency &amp; Admissions</dt>
                  <dd className="font-medium text-sage">24 hours, every day</dd>
                </div>
                {site.hours.consultations.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4 border-b border-line-soft pb-3 text-ink-soft last:border-0 last:pb-0">
                    <dt>{row.days}</dt>
                    <dd>{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5 text-[13.5px]">
              <span className="text-muted">Already have a reference code?</span>
              <Link href="/appointment" className="link-u font-medium text-blue">
                Manage or reschedule your booking →
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Preparation cards */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2" gap={0.08}>
          {guides.map((g) => (
            <StaggerItem key={g.title}>
              <article className="h-full rounded-[3px] border border-line bg-white p-7 sm:p-8">
                <span className="eyebrow text-blue">{g.tag}</span>
                <h3 className="heading mt-2.5 text-[23px] text-ink">{g.title}</h3>
                <ul className="mt-5 space-y-3">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-soft">
                      <Check size={16} className="mt-0.5 shrink-0 text-blue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-[3px] border border-line bg-white px-7 py-6">
          <div>
            <p className="font-medium text-ink">Questions about consultation fees or HMO coverage?</p>
            <p className="mt-1 text-[14px] text-muted">
              Ask our reception desk on WhatsApp before your visit for clear, upfront fee guidance.
            </p>
          </div>
          <ButtonLink href="/book" variant="primary">Book an appointment</ButtonLink>
        </div>
      </div>

      <Questions />
    </div>
  );
}
