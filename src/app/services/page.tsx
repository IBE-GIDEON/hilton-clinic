import type { Metadata } from "next";
import { SectionLabel } from "@/components/section-label";
import { SplitLines, Reveal } from "@/components/motion";
import { ServicesDirectory } from "@/components/services-directory";
import { ButtonLink } from "@/components/button";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Specialties & Clinical Departments",
  description:
    "Explore nephrology & haemodialysis, kidney transplant care, cardiology, obstetrics & gynaecology, paediatrics, orthopaedics, laboratory and 24-hour emergency care at Hilton Clinics, Port Harcourt.",
};

export default function ServicesPage() {
  return (
    <div className="bg-paper pb-24 pt-36 lg:pt-44">
      <div className="container-x">
        <SectionLabel index="01" label="Clinical Departments" />

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.5rem,6vw,5.2rem)] text-ink"
              lines={["Every specialty,", "connected care."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15.5px] leading-relaxed text-ink-soft">
              From specialist kidney and heart clinics to family medicine and round-the-clock emergency admissions in Mile 4, Ada-George.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          <ServicesDirectory />
        </div>

        {/* Unsure banner */}
        <Reveal className="mt-20 grid items-center gap-8 rounded-[3px] bg-ink p-8 text-white sm:p-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow text-sky">Not sure which clinic you need?</p>
            <h2 className="heading mt-3 text-[clamp(1.6rem,3vw,2.35rem)]">
              Start with a general consultation or ask our nurse desk.
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">
              Tell us briefly what you are experiencing and we will book you with the right doctor — or call our 24-hour emergency line at {site.phones.emergency.display} if symptoms feel urgent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href="/book" variant="light">Book a consultation</ButtonLink>
            <ButtonLink href={whatsappLink("Hello Hilton Clinics, I need help choosing the right department.")} variant="outline-light" external arrow={false}>
              Ask on WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
