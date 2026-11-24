"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { SectionLabel } from "../section-label";
import { EASE, Reveal, SplitLines } from "../motion";
import { Minus, Plus, WhatsApp } from "../icons";
import { site, whatsappLink } from "@/lib/site";

const faqs = [
  {
    q: "Do I need an appointment before coming in?",
    a: "For specialist clinics (nephrology, cardiology, obstetrics, orthopaedics, dermatology and endocrinology), booking ahead shortens your wait and ensures the right doctor is ready for you. For emergencies and urgent general consultations, you can walk in at any hour — day or night.",
  },
  {
    q: "How do I schedule a haemodialysis session or transfer from another centre?",
    a: "Book under Nephrology & Dialysis or message our front desk on WhatsApp. Please bring your most recent kidney function results (urea, creatinine, electrolytes), viral screening results if available, and a summary from your previous dialysis unit.",
  },
  {
    q: "Can a family member stay with a patient or join the consultation?",
    a: "Yes. We encourage patients — especially older relatives, expectant mothers, and anyone preparing for dialysis or transplant decisions — to come with someone they trust. Visiting hours for admitted wards are explained calmly at admission.",
  },
  {
    q: "Are laboratory tests done inside Hilton Clinics?",
    a: "Yes. Our in-house medical laboratory runs blood counts, malaria, typhoid, kidney and liver panels, blood sugar/HbA1c, urinalysis and pregnancy screening, allowing most routine decisions to happen on the same visit.",
  },
  {
    q: "Can I reschedule or cancel an appointment I booked online?",
    a: "Yes. Every online booking gives you a reference code (such as HC-2611-4821). Visit the Manage Booking page anytime with your reference code and phone number to reschedule or cancel without hassle.",
  },
  {
    q: "What should I bring to my first consultation?",
    a: "Bring a valid ID, any previous scan reports or laboratory results, your antenatal or child immunisation card (if applicable), and the actual packs or a clear list of every medication you currently take.",
  },
];

export function Questions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="06" label="Patient Questions" />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SplitLines
              as="h2"
              className="display text-[clamp(2.2rem,4.6vw,3.9rem)] text-ink"
              lines={["Honest answers,", "before you arrive."]}
            />
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
                If you are unsure which department to book, what a test requires, or whether you should come in right away, ask us directly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappLink("Hello Hilton Clinics, I have a question before visiting.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-ink px-5 py-3 text-[13px] font-medium text-white transition-colors hover:bg-blue"
                >
                  <WhatsApp size={15} /> Ask on WhatsApp
                </a>
                <Link href="/patients" className="link-u text-[13.5px] font-medium text-blue">
                  Full patient guide →
                </Link>
              </div>
              <p className="mt-6 text-[13px] text-muted">
                Urgent medical concern? Call <a href={`tel:${site.phones.emergency.tel}`} className="font-medium text-ink underline-offset-2 hover:underline">{site.phones.emergency.display}</a> immediately.
              </p>
            </Reveal>
          </div>

          <div className="border-t border-line lg:col-span-7">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="heading text-[18px] text-ink sm:text-[20px]">{item.q}</span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-300 ${
                        isOpen ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"
                      }`}
                    >
                      {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 pr-12 text-[15px] leading-relaxed text-ink-soft">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
