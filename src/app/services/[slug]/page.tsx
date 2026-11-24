import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";
import { SectionLabel } from "@/components/section-label";
import { ButtonLink } from "@/components/button";
import { ImageReveal, Reveal, SplitLines } from "@/components/motion";
import { ArrowLeft, ArrowRight, Check, Clock, Phone, WhatsApp } from "@/components/icons";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Department" };
  return {
    title: service.name,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const bookSlug = service.slug === "emergency-general-practice" ? "emergency-general-practice" : service.slug;

  return (
    <div className="bg-paper pb-24 pt-32 lg:pt-40">
      <div className="container-x">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} /> All specialties
        </Link>

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span className="eyebrow text-blue">
              {service.category} · {service.short}
            </span>
            <SplitLines
              as="h1"
              animateOnMount
              className="display mt-3 text-[clamp(2.3rem,5.5vw,4.8rem)] text-ink"
              lines={[service.name]}
            />
            <p className="lede mt-6 max-w-2xl">{service.summary}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href={`/book?service=${bookSlug}`} variant="primary">
              Book this department
            </ButtonLink>
            <a
              href={whatsappLink(`Hello Hilton Clinics, I have an enquiry about ${service.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] border border-ink/20 bg-white px-5 py-3.5 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <WhatsApp size={15} /> Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* Hero image */}
        <ImageReveal className="relative mt-12 aspect-[16/9] max-h-[560px] w-full overflow-hidden rounded-[3px] bg-paper-deep">
          <Image
            src={service.image}
            alt={`${service.name} at Hilton Clinics, Port Harcourt`}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </ImageReveal>

        {/* Body */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <Reveal>
              <SectionLabel index="01" label="Overview" />
              <p className="mt-7 text-[17px] leading-[1.75] text-ink-soft">{service.intro}</p>
            </Reveal>

            <Reveal>
              <SectionLabel index="02" label="Services & Procedures" />
              <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
                {service.offers.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-[3px] border border-line-soft bg-white p-4 text-[14.5px] leading-snug text-ink"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <SectionLabel index="03" label="Conditions Commonly Seen" />
              <div className="mt-7 flex flex-wrap gap-2.5">
                {service.conditions.map((c) => (
                  <span
                    key={c}
                    className="rounded-[2px] border border-line bg-white px-3.5 py-2 text-[13.5px] text-ink-soft"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <Reveal className="rounded-[3px] border border-line bg-white p-7 sm:p-8">
                <p className="eyebrow text-blue">Before you arrive</p>
                <h2 className="heading mt-2 text-[22px] text-ink">How to prepare</h2>
                <ul className="mt-5 space-y-3.5">
                  {service.prepare.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="rule-dotted my-6" />

                <div className="flex items-center justify-between text-[14px]">
                  <span className="inline-flex items-center gap-2 text-muted">
                    <Clock size={15} /> Typical appointment
                  </span>
                  <span className="font-medium text-ink">~{service.duration} minutes</span>
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <ButtonLink href={`/book?service=${bookSlug}`} variant="primary" className="w-full">
                    Check available times
                  </ButtonLink>
                  <a
                    href={`tel:${site.phones.emergency.tel}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-line py-3 text-[13px] font-medium text-ink transition-colors hover:border-ink"
                  >
                    <Phone size={14} /> Call {site.phones.emergency.display}
                  </a>
                </div>
              </Reveal>

              <div className="rounded-[3px] border border-line bg-paper-deep/60 p-6 text-[13.5px] leading-relaxed text-ink-soft">
                <p className="font-medium text-ink">Location</p>
                <p className="mt-1">
                  {site.address.line1}, {site.address.line2}, {site.address.area}, {site.address.city}. Open 24 hours daily.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related departments */}
        <div className="mt-24 border-t border-line pt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="heading text-[28px] text-ink">Other departments at Hilton Clinics</h2>
            <Link href="/services" className="link-u text-[13.5px] font-medium text-blue">
              See all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="group rounded-[3px] border border-line bg-white p-6 transition-colors hover:border-ink/40"
              >
                <span className="eyebrow text-blue">{r.short}</span>
                <h3 className="heading mt-2 text-[20px] text-ink group-hover:text-blue">{r.name}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{r.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  Learn more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
