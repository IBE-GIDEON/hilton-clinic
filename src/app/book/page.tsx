import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionLabel } from "@/components/section-label";
import { SplitLines, Reveal } from "@/components/motion";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book a specialist consultation, haemodialysis session, antenatal check or laboratory test at Hilton Clinics, Ada-George, Port Harcourt.",
};

export default function BookPage() {
  return (
    <div className="bg-paper pb-24 pt-36 lg:pt-44">
      <div className="container-x">
        <SectionLabel index="01" label="Online Booking" />

        <div className="mt-10 grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.4rem,5.5vw,4.75rem)] text-ink"
              lines={["Book your visit", "in two minutes."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Real-time consultation slots with instant booking reference and optional WhatsApp confirmation with our reception desk.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={
              <div className="rounded-[3px] border border-line bg-white p-10 text-center text-[14px] text-muted">
                Loading booking calendar…
              </div>
            }
          >
            <BookingFlow />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
