"use client";

import { SectionLabel } from "../section-label";
import { DrawLine, SplitLines, Stagger, StaggerItem, Reveal } from "../motion";

const steps = [
  {
    n: "01",
    title: "Choose a time — or simply walk in",
    body: "Book an appointment online in two minutes, message our front desk on WhatsApp, or walk in anytime for urgent care. We confirm your slot promptly.",
  },
  {
    n: "02",
    title: "Warm reception & calm triage",
    body: "Arrive at 2 Ejekwu Wike Street, off Ada-George Road. Registration is quick, vitals are checked privately, and waiting areas stay uncrowded.",
  },
  {
    n: "03",
    title: "Unhurried consultation & on-site tests",
    body: "Your doctor listens properly before recommending tests. Blood work, ECG and routine diagnostics are carried out under the same roof for faster answers.",
  },
  {
    n: "04",
    title: "A clear plan & ongoing support",
    body: "Leave with written instructions, realistic next steps, and a direct number to reach us if anything feels unclear once you are back home.",
  },
];

export function Journey() {
  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="container-x">
        <SectionLabel index="04" label="Your Visit" />

        <div className="mt-14 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitLines
              as="h2"
              className="display text-[clamp(2.2rem,5vw,4.25rem)] text-ink"
              lines={["What to expect", "when you visit."]}
            />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <Reveal>
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                Going to a hospital is often stressful enough. We keep every step predictable, respectful of your time, and transparent.
              </p>
            </Reveal>
          </div>
        </div>

        <DrawLine className="mt-14" />

        <Stagger className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4" gap={0.09}>
          {steps.map((step) => (
            <StaggerItem key={step.n}>
              <article className="group flex h-full flex-col justify-between rounded-[3px] border border-line-soft bg-paper/55 p-7 transition-colors duration-500 hover:border-ink/30 hover:bg-paper">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-blue">Step {step.n}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-line transition-colors duration-300 group-hover:bg-blue" />
                  </div>
                  <h3 className="heading mt-5 text-[21px] text-ink">{step.title}</h3>
                  <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
