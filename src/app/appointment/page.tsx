import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionLabel } from "@/components/section-label";
import { SplitLines, Reveal } from "@/components/motion";
import { ManageBooking } from "@/components/manage-booking";

export const metadata: Metadata = {
  title: "Manage Your Booking",
  description:
    "Check the status of your Hilton Clinics appointment, reschedule to a new time, or cancel online using your reference code.",
};

export default function AppointmentPage() {
  return (
    <div className="bg-paper pb-24 pt-36 lg:pt-44">
      <div className="container-x">
        <SectionLabel index="01" label="Manage Booking" />

        <div className="mt-10 grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SplitLines
              as="h1"
              animateOnMount
              className="display text-[clamp(2.4rem,5.5vw,4.75rem)] text-ink"
              lines={["Manage your", "appointment."]}
            />
          </div>
          <Reveal className="lg:col-span-4">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Plans change — check your appointment confirmation, move it to another open slot, or let us know if you can no longer make it.
            </p>
          </Reveal>
        </div>

        <div className="mt-12">
          <Suspense
            fallback={
              <div className="rounded-[3px] border border-line bg-white p-10 text-center text-[14px] text-muted">
                Loading booking lookup…
              </div>
            }
          >
            <ManageBooking />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
