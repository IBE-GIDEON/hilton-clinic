"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { bookableServices } from "@/lib/services";
import { site, mapsDirections } from "@/lib/site";
import { formatDateReadable, formatTime12 } from "@/lib/format";
import { EASE } from "./motion";
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, MapPin, Phone, WhatsApp } from "./icons";

type SlotItem = { time: string; available: boolean };
type VisitType = "first-visit" | "follow-up" | "dialysis" | "lab-test";
type AgeGroup = "child" | "adult" | "senior";
type Channel = "whatsapp" | "phone";

type CreatedAppointment = {
  reference: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  patientName: string;
  phone: string;
  status: string;
};

function getUpcomingDays(count = 14) {
  const days: Array<{ iso: string; weekday: string; day: string; month: string; isSunday: boolean }> = [];
  const now = new Date();
  // Use WAT calendar dates cleanly
  for (let i = 0; i < count; i++) {
    const dt = new Date(now.getTime() + i * 86400_000);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(dt);
    const y = parts.find((p) => p.type === "year")?.value ?? "2026";
    const m = parts.find((p) => p.type === "month")?.value ?? "01";
    const d = parts.find((p) => p.type === "day")?.value ?? "01";
    const iso = `${y}-${m}-${d}`;
    const utc = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    const weekday = new Intl.DateTimeFormat("en-NG", { weekday: "short", timeZone: "UTC" }).format(utc);
    const month = new Intl.DateTimeFormat("en-NG", { month: "short", timeZone: "UTC" }).format(utc);
    days.push({ iso, weekday, day: d, month, isSunday: utc.getUTCDay() === 0 });
  }
  return days;
}

const visitTypes: Array<{ value: VisitType; label: string; desc: string }> = [
  { value: "first-visit", label: "First visit", desc: "New consultation or fresh concern" },
  { value: "follow-up", label: "Follow-up", desc: "Reviewing results or ongoing care" },
  { value: "dialysis", label: "Dialysis session", desc: "Scheduled haemodialysis chair" },
  { value: "lab-test", label: "Lab & diagnostics", desc: "Blood tests, ECG or screening" },
];

export function BookingFlow() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service");
  const initialDate = searchParams.get("date");

  const upcoming = useMemo(() => getUpcomingDays(14), []);
  const defaultDate = useMemo(() => {
    if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) return initialDate;
    const firstNonSunday = upcoming.find((d) => !d.isSunday);
    return firstNonSunday?.iso ?? upcoming[0].iso;
  }, [initialDate, upcoming]);

  const validInitialService = bookableServices.some((s) => s.slug === initialService)
    ? (initialService as string)
    : bookableServices[0].slug;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [serviceSlug, setServiceSlug] = useState(validInitialService);
  const [visitType, setVisitType] = useState<VisitType>(
    validInitialService === "nephrology-dialysis"
      ? "dialysis"
      : validInitialService === "laboratory-diagnostics"
      ? "lab-test"
      : "first-visit"
  );
  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState("");
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [slotNote, setSlotNote] = useState<string | undefined>(undefined);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [preferredContact, setPreferredContact] = useState<Channel>("whatsapp");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ appointment: CreatedAppointment; whatsappUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeService = bookableServices.find((s) => s.slug === serviceSlug) ?? bookableServices[0];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingSlots(true);
      setTimeSlot("");
      setError("");
      try {
        const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}&service=${encodeURIComponent(serviceSlug)}`);
        const data = await res.json();
        if (!cancelled) {
          setSlots(Array.isArray(data.slots) ? data.slots : []);
          setSlotNote(data.note);
        }
      } catch {
        if (!cancelled) {
          setSlots([]);
          setSlotNote("Could not check live slots. Please try again or call our front desk.");
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [date, serviceSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!timeSlot) {
      setError("Please select an available time slot.");
      setStep(2);
      return;
    }
    if (patientName.trim().length < 2) {
      setError("Please enter the patient's full name.");
      return;
    }
    if (phone.trim().length < 7) {
      setError("Please enter a valid Nigerian phone number so we can confirm your slot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          date,
          timeSlot,
          visitType,
          patientName,
          phone,
          email,
          ageGroup,
          preferredContact,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to complete your booking. Please try again.");
        if (res.status === 409) {
          setStep(2);
        }
        return;
      }
      setCreated(data);
      setStep(4);
    } catch {
      setError("Network error while saving your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Main booking column */}
      <div className="min-w-0 lg:col-span-8">
        {/* Step indicator */}
        {step < 4 && (
          <div className="mb-8 flex items-center gap-3 border-b border-line pb-6">
            {[
              { n: 1 as const, label: "Department" },
              { n: 2 as const, label: "Date & time" },
              { n: 3 as const, label: "Your details" },
            ].map((s, idx) => {
              const active = step === s.n;
              const done = step > s.n;
              return (
                <div key={s.n} className="flex flex-1 items-center gap-3">
                  <button
                    type="button"
                    disabled={s.n > step && !(s.n === 2 && step === 1)}
                    onClick={() => {
                      if (s.n <= step) setStep(s.n);
                    }}
                    className="flex items-center gap-2.5 text-left disabled:opacity-50"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-[2px] font-[family-name:var(--font-mono)] text-[11px] transition-colors ${
                        done
                          ? "bg-sage text-white"
                          : active
                          ? "bg-ink text-white"
                          : "border border-line bg-white text-muted"
                      }`}
                    >
                      {done ? <Check size={13} /> : `0${s.n}`}
                    </span>
                    <span className={`hidden text-[13px] font-medium sm:inline ${active ? "text-ink" : "text-muted"}`}>
                      {s.label}
                    </span>
                  </button>
                  {idx < 2 && <span className="h-px flex-1 bg-line" />}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Department & Visit Type */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-8 rounded-[3px] border border-line bg-white p-6 sm:p-9"
            >
              <div>
                <p className="eyebrow text-blue">Step 01</p>
                <h2 className="heading mt-2 text-[26px] text-ink">Choose a department</h2>
                <p className="mt-1.5 text-[14.5px] text-muted">
                  Not completely sure? Pick General Consultation and our doctor will guide you.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {bookableServices.map((s) => {
                    const selected = s.slug === serviceSlug;
                    return (
                      <button
                        type="button"
                        key={s.slug}
                        onClick={() => {
                          setServiceSlug(s.slug);
                          if (s.slug === "nephrology-dialysis") setVisitType("dialysis");
                          else if (s.slug === "laboratory-diagnostics") setVisitType("lab-test");
                        }}
                        className={`flex flex-col justify-between rounded-[3px] border p-4 text-left transition-all ${
                          selected
                            ? "border-blue bg-blue-soft/45 ring-1 ring-blue"
                            : "border-line bg-paper/40 hover:border-ink/40 hover:bg-paper"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[14.5px] font-medium text-ink">{s.name}</span>
                          {selected && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue text-white">
                              <Check size={11} />
                            </span>
                          )}
                        </div>
                        <span className="mt-2 text-[12px] text-muted">
                          {s.short} · ~{s.duration} mins
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-line-soft pt-7">
                <p className="eyebrow text-muted">Visit type</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visitTypes.map((vt) => {
                    const selected = visitType === vt.value;
                    return (
                      <button
                        type="button"
                        key={vt.value}
                        onClick={() => setVisitType(vt.value)}
                        className={`rounded-[3px] border p-3.5 text-left transition-colors ${
                          selected ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
                        }`}
                      >
                        <span className="block text-[14px] font-medium">{vt.label}</span>
                        <span className={`mt-0.5 block text-[12px] ${selected ? "text-white/75" : "text-muted"}`}>
                          {vt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end border-t border-line-soft pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-blue px-7 py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-blue-deep"
                >
                  Continue to date &amp; time <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Date & Live Slots */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-8 rounded-[3px] border border-line bg-white p-6 sm:p-9"
            >
              <div>
                <p className="eyebrow text-blue">Step 02</p>
                <h2 className="heading mt-2 text-[26px] text-ink">Pick a date &amp; time</h2>
                <p className="mt-1.5 text-[14.5px] text-muted">
                  Live slots for <strong className="font-medium text-ink">{activeService.name}</strong>.
                </p>

                {/* Quick 14-day horizontal date strip */}
                <div className="no-scrollbar mt-6 flex gap-2.5 overflow-x-auto pb-2">
                  {upcoming.map((d) => {
                    const selected = d.iso === date;
                    return (
                      <button
                        type="button"
                        key={d.iso}
                        onClick={() => setDate(d.iso)}
                        className={`flex w-[74px] shrink-0 flex-col items-center rounded-[3px] border py-3 transition-colors ${
                          selected
                            ? "border-blue bg-blue text-white"
                            : d.isSunday
                            ? "border-line-soft bg-paper/40 text-muted hover:border-ink/30"
                            : "border-line bg-white text-ink hover:border-ink/50"
                        }`}
                      >
                        <span className={`text-[11px] uppercase ${selected ? "text-white/80" : "text-muted"}`}>
                          {d.weekday}
                        </span>
                        <span className="mt-0.5 text-[20px] font-medium leading-none">{d.day}</span>
                        <span className={`mt-1 text-[11px] ${selected ? "text-white/80" : "text-muted"}`}>
                          {d.month}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom date input */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-[13px] text-muted">
                    <Calendar size={14} /> Or choose another date:
                  </label>
                  <input
                    type="date"
                    min={upcoming[0].iso}
                    value={date}
                    onChange={(e) => e.target.value && setDate(e.target.value)}
                    className="field h-10 w-auto py-0 text-[13.5px]"
                  />
                </div>
              </div>

              {/* Slots */}
              <div className="border-t border-line-soft pt-7">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-muted">Available times · {formatDateReadable(date)}</p>
                  {loadingSlots && <span className="text-[12px] text-blue">Checking availability…</span>}
                </div>

                {slotNote && (
                  <p className="mt-3 rounded-[3px] border border-line bg-paper px-4 py-3 text-[13.5px] leading-relaxed text-ink-soft">
                    {slotNote}
                  </p>
                )}

                {!loadingSlots && slots.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                    {slots.map((s) => {
                      const selected = timeSlot === s.time;
                      return (
                        <button
                          type="button"
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setTimeSlot(s.time)}
                          className={`rounded-[3px] border py-3 text-[13.5px] font-medium transition-colors ${
                            !s.available
                              ? "cursor-not-allowed border-line-soft bg-paper/60 text-muted/45 line-through"
                              : selected
                              ? "border-blue bg-blue text-white"
                              : "border-line bg-white text-ink hover:border-blue hover:bg-blue-soft/40"
                          }`}
                        >
                          {formatTime12(s.time)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {error && <p className="mt-4 text-[13.5px] font-medium text-clay">{error}</p>}
              </div>

              <div className="flex items-center justify-between border-t border-line-soft pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-[13.5px] font-medium text-muted hover:text-ink"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  type="button"
                  disabled={!timeSlot}
                  onClick={() => {
                    setError("");
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-blue px-7 py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-blue-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to patient details <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Patient Details */}
          {step === 3 && (
            <motion.form
              key="step-3"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-6 rounded-[3px] border border-line bg-white p-6 sm:p-9"
            >
              <div>
                <p className="eyebrow text-blue">Step 03</p>
                <h2 className="heading mt-2 text-[26px] text-ink">Patient details</h2>
                <p className="mt-1.5 text-[14.5px] text-muted">
                  Your details stay confidential with our reception and clinical team.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[13px] font-medium text-ink" htmlFor="b-name">
                    Patient&apos;s full name *
                  </label>
                  <input
                    id="b-name"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Chidinma Okafor"
                    className="field"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink" htmlFor="b-phone">
                    Phone / WhatsApp number *
                  </label>
                  <input
                    id="b-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 000 0000"
                    className="field"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink" htmlFor="b-email">
                    Email address <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    id="b-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="field"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink">Patient age group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { v: "child", l: "Child" },
                        { v: "adult", l: "Adult" },
                        { v: "senior", l: "Senior" },
                      ] as const
                    ).map((a) => (
                      <button
                        type="button"
                        key={a.v}
                        onClick={() => setAgeGroup(a.v)}
                        className={`rounded-[3px] border py-2.5 text-[13px] transition-colors ${
                          ageGroup === a.v ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink"
                        }`}
                      >
                        {a.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink">How should we confirm?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { v: "whatsapp", l: "WhatsApp" },
                        { v: "phone", l: "Phone call" },
                      ] as const
                    ).map((ch) => (
                      <button
                        type="button"
                        key={ch.v}
                        onClick={() => setPreferredContact(ch.v)}
                        className={`rounded-[3px] border py-2.5 text-[13px] transition-colors ${
                          preferredContact === ch.v
                            ? "border-ink bg-ink text-white"
                            : "border-line bg-white text-ink-soft hover:border-ink"
                        }`}
                      >
                        {ch.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[13px] font-medium text-ink" htmlFor="b-notes">
                    Anything helpful for the doctor to know? <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <textarea
                    id="b-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Symptoms, dialysis frequency, preferred doctor or accessibility needs…"
                    className="field resize-none"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-[3px] border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] text-clay">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-line-soft pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-[13.5px] font-medium text-muted hover:text-ink"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-[3px] bg-blue px-8 py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-blue-deep disabled:opacity-50"
                >
                  {submitting ? "Saving appointment…" : "Confirm appointment"}
                  {!submitting && <Check size={16} />}
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 4: Confirmation Receipt */}
          {step === 4 && created && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-[3px] border border-line bg-white p-7 sm:p-10"
            >
              <div className="flex items-center gap-3.5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white"
                >
                  <Check size={22} />
                </motion.span>
                <div>
                  <p className="eyebrow text-sage">Appointment Reserved</p>
                  <h2 className="heading mt-1 text-[26px] text-ink">We have saved your visit</h2>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[3px] border border-line bg-paper px-5 py-4">
                <div>
                  <span className="eyebrow text-muted">Your Reference Code</span>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[22px] font-medium tracking-wider text-ink">
                    {created.appointment.reference}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(created.appointment.reference);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="rounded-[2px] border border-line bg-white px-4 py-2 text-[12.5px] font-medium text-ink hover:border-ink"
                >
                  {copied ? "Copied!" : "Copy reference"}
                </button>
              </div>

              <dl className="mt-6 grid gap-4 border-y border-line-soft py-6 text-[14.5px] sm:grid-cols-2">
                <div>
                  <dt className="text-muted">Patient</dt>
                  <dd className="mt-0.5 font-medium text-ink">{created.appointment.patientName}</dd>
                </div>
                <div>
                  <dt className="text-muted">Department</dt>
                  <dd className="mt-0.5 font-medium text-ink">{created.appointment.serviceName}</dd>
                </div>
                <div>
                  <dt className="text-muted">Date &amp; Time</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {formatDateReadable(created.appointment.date)} · {formatTime12(created.appointment.timeSlot)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="mt-0.5 font-medium text-ink">2 Ejekwu Wike St, off Ada-George Rd</dd>
                </div>
              </dl>

              <p className="mt-6 text-[14.5px] leading-relaxed text-ink-soft">
                For instant confirmation with our reception desk, tap the WhatsApp button below — your booking reference and time are already filled in.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={created.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-[#1f7a4d] px-6 py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[#17613c]"
                >
                  <WhatsApp size={17} /> Send details on WhatsApp
                </a>
                <Link
                  href={`/appointment?ref=${encodeURIComponent(created.appointment.reference)}`}
                  className="inline-flex items-center gap-2 rounded-[3px] border border-ink/20 px-6 py-3.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink"
                >
                  Manage this booking
                </Link>
                <a
                  href={mapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[3px] border border-line px-5 py-3.5 text-[13.5px] text-ink-soft hover:border-ink hover:text-ink"
                >
                  <MapPin size={15} /> Get directions
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live summary sidebar */}
      <aside className="lg:col-span-4">
        <div className="sticky top-28 space-y-5">
          <div className="rounded-[3px] border border-line bg-white p-6">
            <p className="eyebrow text-blue">Booking Summary</p>
            <dl className="mt-5 space-y-4 text-[14px]">
              <div className="border-b border-line-soft pb-3">
                <dt className="text-muted">Department</dt>
                <dd className="mt-0.5 font-medium text-ink">{activeService.name}</dd>
              </div>
              <div className="border-b border-line-soft pb-3">
                <dt className="text-muted">Visit type</dt>
                <dd className="mt-0.5 font-medium capitalize text-ink">{visitType.replace("-", " ")}</dd>
              </div>
              <div className="border-b border-line-soft pb-3">
                <dt className="text-muted">Selected date</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDateReadable(date)}</dd>
              </div>
              <div>
                <dt className="text-muted">Selected time</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {timeSlot ? formatTime12(timeSlot) : "Not selected yet"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-[2px] bg-paper p-4 text-[13px] leading-relaxed text-ink-soft">
              <p className="flex items-center gap-2 font-medium text-ink">
                <Clock size={14} className="text-blue" /> Typical visit: ~{activeService.duration} minutes
              </p>
              <p className="mt-1.5">
                Arrive 10 minutes early with any previous lab results or medication packs.
              </p>
            </div>
          </div>

          <div className="rounded-[3px] border border-line bg-ink p-6 text-white">
            <p className="eyebrow text-sky">Need immediate care?</p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/80">
              For emergencies, walk straight into Hilton Clinics at 2 Ejekwu Wike Street, Ada-George — or call us right now.
            </p>
            <a
              href={`tel:${site.phones.emergency.tel}`}
              className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-medium text-white underline-offset-4 hover:underline"
            >
              <Phone size={15} /> {site.phones.emergency.display}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
