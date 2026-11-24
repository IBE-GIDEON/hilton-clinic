"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { formatDateReadable, formatTime12 } from "@/lib/format";
import { mapsDirections, site } from "@/lib/site";
import { EASE } from "./motion";
import { Calendar, Check, MapPin, Phone, WhatsApp } from "./icons";

type AppointmentRecord = {
  reference: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  visitType: string;
  patientName: string;
  phone: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  staffNote: string;
};

type SlotItem = { time: string; available: boolean };

const statusStyles: Record<AppointmentRecord["status"], { label: string; cls: string }> = {
  pending: { label: "Pending confirmation", cls: "border-blue/30 bg-blue-soft text-blue" },
  confirmed: { label: "Confirmed", cls: "border-sage/30 bg-sage/10 text-sage" },
  completed: { label: "Completed", cls: "border-ink/20 bg-paper text-ink" },
  cancelled: { label: "Cancelled", cls: "border-clay/30 bg-clay/10 text-clay" },
};

export function ManageBooking() {
  const params = useSearchParams();
  const [refCode, setRefCode] = useState(params.get("ref") || "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [record, setRecord] = useState<AppointmentRecord | null>(null);
  const [waUrl, setWaUrl] = useState("");

  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/appointments?ref=${encodeURIComponent(refCode.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setRecord(null);
        setError(data.error || "Could not locate that booking.");
        return;
      }
      setRecord(data.appointment);
      setWaUrl(data.whatsappUrl);
      setNewDate(data.appointment.date);
      setRescheduling(false);
    } catch {
      setError("Network error while looking up your booking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!rescheduling || !record || !newDate) return;
    let cancelled = false;
    async function loadSlots() {
      setLoadingSlots(true);
      setNewSlot("");
      try {
        const res = await fetch(
          `/api/availability?date=${encodeURIComponent(newDate)}&service=${encodeURIComponent(record!.serviceSlug)}`
        );
        const data = await res.json();
        if (!cancelled) setSlots(Array.isArray(data.slots) ? data.slots : []);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [rescheduling, record, newDate]);

  async function handleReschedule() {
    if (!record || !newDate || !newSlot) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(record.reference)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, date: newDate, timeSlot: newSlot }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reschedule.");
        return;
      }
      setRecord(data.appointment);
      setWaUrl(data.whatsappUrl);
      setRescheduling(false);
      setNotice("Your appointment has been moved to the new date and time.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!record) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(record.reference)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not cancel appointment.");
        return;
      }
      setRecord(data.appointment);
      setNotice("Your appointment has been cancelled. You can book a new time whenever you are ready.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Lookup form */}
      <form
        onSubmit={lookup}
        className="h-fit space-y-5 rounded-[3px] border border-line bg-white p-7 lg:col-span-5"
      >
        <div>
          <p className="eyebrow text-blue">Find Your Booking</p>
          <h2 className="heading mt-2 text-[22px] text-ink">Enter your reference</h2>
        </div>

        <div>
          <label htmlFor="m-ref" className="mb-1.5 block text-[13px] font-medium text-ink">
            Booking reference code
          </label>
          <input
            id="m-ref"
            required
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="e.g. HC-2611-4821"
            className="field font-[family-name:var(--font-mono)] uppercase"
          />
        </div>

        <div>
          <label htmlFor="m-phone" className="mb-1.5 block text-[13px] font-medium text-ink">
            Phone number used when booking
          </label>
          <input
            id="m-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0803 000 0000"
            className="field"
          />
        </div>

        {error && (
          <p className="rounded-[3px] border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] text-clay">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[3px] bg-blue py-3.5 text-[13.5px] font-medium text-white transition-colors hover:bg-blue-deep disabled:opacity-50"
        >
          {loading ? "Looking up booking…" : "Find appointment"}
        </button>

        <p className="text-[13px] text-muted">
          Lost your reference code? Call <a className="text-ink underline-offset-2 hover:underline" href={`tel:${site.phones.emergency.tel}`}>{site.phones.emergency.display}</a> and reception will look you up by name.
        </p>
      </form>

      {/* Result card */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {record ? (
            <motion.div
              key={record.reference}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="rounded-[3px] border border-line bg-white p-7 sm:p-9"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line-soft pb-6">
                <div>
                  <span className="eyebrow text-muted">Reference {record.reference}</span>
                  <h3 className="heading mt-1 text-[26px] text-ink">{record.serviceName}</h3>
                </div>
                <span className={`rounded-[2px] border px-3 py-1.5 text-[12px] font-medium ${statusStyles[record.status].cls}`}>
                  {statusStyles[record.status].label}
                </span>
              </div>

              {notice && (
                <p className="mt-5 flex items-center gap-2 rounded-[3px] border border-sage/30 bg-sage/10 px-4 py-3 text-[13.5px] text-sage">
                  <Check size={15} /> {notice}
                </p>
              )}

              <dl className="mt-6 grid gap-5 text-[14.5px] sm:grid-cols-2">
                <div>
                  <dt className="text-muted">Patient</dt>
                  <dd className="mt-0.5 font-medium text-ink">{record.patientName}</dd>
                </div>
                <div>
                  <dt className="text-muted">Scheduled Date &amp; Time</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {formatDateReadable(record.date)} · {formatTime12(record.timeSlot)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Visit Type</dt>
                  <dd className="mt-0.5 capitalize text-ink">{record.visitType.replace("-", " ")}</dd>
                </div>
                <div>
                  <dt className="text-muted">Clinic Address</dt>
                  <dd className="mt-0.5 text-ink">2 Ejekwu Wike Street, Ada-George</dd>
                </div>
              </dl>

              {record.staffNote && (
                <div className="mt-6 rounded-[3px] border border-blue/20 bg-blue-soft/45 p-4 text-[14px] text-ink">
                  <p className="eyebrow text-blue">Note from Hilton Clinics</p>
                  <p className="mt-1">{record.staffNote}</p>
                </div>
              )}

              {/* Reschedule drawer */}
              {rescheduling && record.status !== "cancelled" && record.status !== "completed" && (
                <div className="mt-7 rounded-[3px] border border-line bg-paper p-5">
                  <p className="eyebrow text-blue">Pick a New Date &amp; Time</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-[13px] text-ink-soft">
                      <Calendar size={14} /> New date:
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="field h-10 w-auto py-0 text-[13.5px]"
                    />
                  </div>
                  <div className="mt-4">
                    {loadingSlots ? (
                      <p className="text-[13px] text-muted">Loading available times…</p>
                    ) : slots.length === 0 ? (
                      <p className="text-[13px] text-muted">No clinic slots on that date. Please pick Monday–Saturday.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {slots.map((s) => (
                          <button
                            type="button"
                            key={s.time}
                            disabled={!s.available}
                            onClick={() => setNewSlot(s.time)}
                            className={`rounded-[2px] border py-2 text-[12.5px] font-medium ${
                              !s.available
                                ? "cursor-not-allowed border-line-soft bg-white/50 text-muted/40 line-through"
                                : newSlot === s.time
                                ? "border-blue bg-blue text-white"
                                : "border-line bg-white text-ink hover:border-blue"
                            }`}
                          >
                            {formatTime12(s.time)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      disabled={!newSlot || saving}
                      onClick={handleReschedule}
                      className="rounded-[3px] bg-blue px-5 py-2.5 text-[13px] font-medium text-white hover:bg-blue-deep disabled:opacity-40"
                    >
                      {saving ? "Saving…" : "Save new time"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRescheduling(false)}
                      className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-[13px] text-ink"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3 border-t border-line-soft pt-6">
                {record.status !== "cancelled" && record.status !== "completed" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setRescheduling((v) => !v)}
                      className="rounded-[3px] border border-ink/25 px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {rescheduling ? "Hide reschedule" : "Reschedule"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleCancel}
                      className="rounded-[3px] border border-clay/35 px-5 py-2.5 text-[13px] font-medium text-clay transition-colors hover:bg-clay hover:text-white"
                    >
                      Cancel appointment
                    </button>
                  </>
                )}
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[3px] bg-[#1f7a4d] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#17613c]"
                  >
                    <WhatsApp size={15} /> Message Front Desk
                  </a>
                )}
                <a
                  href={mapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[3px] border border-line px-4 py-2.5 text-[13px] text-ink-soft hover:border-ink hover:text-ink"
                >
                  <MapPin size={14} /> Directions
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full flex-col justify-between rounded-[3px] border border-dashed border-line bg-white/60 p-8 sm:p-10">
              <div>
                <p className="eyebrow text-muted">Self-Service Portal</p>
                <h3 className="heading mt-2 text-[24px] text-ink">View, reschedule or cancel with ease</h3>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                  Enter the reference code you received after booking along with your phone number to check confirmation status, pick a different day, or notify our front desk.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line-soft pt-6 text-[13.5px]">
                <Link href="/book" className="font-medium text-blue underline-offset-2 hover:underline">
                  Need to make a new booking? →
                </Link>
                <a href={`tel:${site.phones.emergency.tel}`} className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
                  <Phone size={14} /> {site.phones.emergency.display}
                </a>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
