"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LogoMark } from "./logo";
import { formatDateReadable, formatTime12, patientWhatsAppUrl } from "@/lib/format";
import { Check, Search, WhatsApp } from "./icons";

type Appointment = {
  id: string;
  reference: string;
  serviceSlug: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  visitType: string;
  patientName: string;
  phone: string;
  email: string;
  ageGroup: string;
  preferredContact: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  staffNote: string;
  createdAt: string;
};

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  topic: string;
  message: string;
  preferredChannel: string;
  status: "new" | "replied";
  createdAt: string;
};

const badgeMap: Record<Appointment["status"], string> = {
  pending: "border-blue/30 bg-blue-soft text-blue",
  confirmed: "border-sage/30 bg-sage/10 text-sage",
  completed: "border-ink/20 bg-paper text-ink",
  cancelled: "border-clay/30 bg-clay/10 text-clay",
};

export function AdminDesk() {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [tab, setTab] = useState<"appointments" | "enquiries">("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | Appointment["status"]>("all");
  const [query, setQuery] = useState("");
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, eRes] = await Promise.all([fetch("/api/appointments"), fetch("/api/contact")]);
      if (aRes.status === 401 || eRes.status === 401) {
        setAuthed(false);
        return;
      }
      const aJson = await aRes.json();
      const eJson = await eRes.json();
      setAppointments(Array.isArray(aJson.appointments) ? aJson.appointments : []);
      setEnquiries(Array.isArray(eJson.enquiries) ? eJson.enquiries : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        setAuthed(Boolean(d.authenticated));
        setCheckedAuth(true);
        if (d.authenticated) loadData();
      })
      .catch(() => setCheckedAuth(true));
  }, [loadData]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setSigningIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Invalid passcode.");
        return;
      }
      setAuthed(true);
      setPasscode("");
      loadData();
    } finally {
      setSigningIn(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
    setAppointments([]);
    setEnquiries([]);
  }

  async function updateBooking(ref: string, patch: { status?: Appointment["status"]; staffNote?: string }) {
    setBusyRef(ref);
    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(ref)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments((prev) => prev.map((a) => (a.reference === ref ? data.appointment : a)));
      }
    } finally {
      setBusyRef(null);
    }
  }

  async function toggleEnquiry(enq: Enquiry) {
    const nextStatus = enq.status === "new" ? "replied" : "new";
    const res = await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: enq.id, status: nextStatus }),
    });
    if (res.ok) {
      setEnquiries((prev) => prev.map((e) => (e.id === enq.id ? { ...e, status: nextStatus } : e)));
    }
  }

  const filteredAppointments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      return (
        a.reference.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.serviceName.toLowerCase().includes(q)
      );
    });
  }, [appointments, statusFilter, query]);

  if (!checkedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-[14px] text-muted">
        Checking staff session…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-12">
        <div className="w-full max-w-md rounded-[3px] border border-line bg-white p-8">
          <div className="flex items-center gap-3 text-blue">
            <LogoMark size={30} />
            <div>
              <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[0.14em] text-ink">
                HILTON CLINICS
              </p>
              <p className="eyebrow text-[10px] text-muted">Front Desk Portal</p>
            </div>
          </div>

          <h1 className="heading mt-7 text-[24px] text-ink">Staff sign in</h1>
          <p className="mt-1.5 text-[14px] text-muted">
            Enter the reception desk passcode to view appointments and patient callback requests.
          </p>

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-pass" className="mb-1.5 block text-[13px] font-medium text-ink">
                Staff passcode
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="field"
              />
            </div>

            {authError && <p className="text-[13px] text-clay">{authError}</p>}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full rounded-[3px] bg-ink py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-blue disabled:opacity-50"
            >
              {signingIn ? "Signing in…" : "Open Front Desk"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-4 text-[12.5px] text-muted">
            <span>Default local PIN: <code className="font-[family-name:var(--font-mono)] text-ink">hilton2026</code></span>
            <Link href="/" className="text-blue hover:underline">← Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Top staff bar */}
      <header className="border-b border-line bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-blue">
            <LogoMark size={26} />
            <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold tracking-[0.14em] text-ink">
              HILTON · FRONT DESK
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <button onClick={loadData} className="text-muted hover:text-ink">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <Link href="/" className="text-muted hover:text-ink">Public site</Link>
            <button
              onClick={signOut}
              className="rounded-[2px] border border-line px-3 py-1.5 text-ink hover:border-ink"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-x pt-10">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-[3px] border border-line bg-white p-5">
            <p className="eyebrow text-muted">Total Bookings</p>
            <p className="display mt-2 text-[36px] text-ink">{appointments.length}</p>
          </div>
          <div className="rounded-[3px] border border-line bg-white p-5">
            <p className="eyebrow text-blue">Pending Review</p>
            <p className="display mt-2 text-[36px] text-blue">{pendingCount}</p>
          </div>
          <div className="rounded-[3px] border border-line bg-white p-5">
            <p className="eyebrow text-sage">Confirmed</p>
            <p className="display mt-2 text-[36px] text-sage">{confirmedCount}</p>
          </div>
          <div className="rounded-[3px] border border-line bg-white p-5">
            <p className="eyebrow text-clay">New Enquiries</p>
            <p className="display mt-2 text-[36px] text-ink">{newEnquiriesCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("appointments")}
              className={`rounded-[2px] px-4 py-2 text-[13px] font-medium ${
                tab === "appointments" ? "bg-ink text-white" : "bg-white text-ink-soft hover:text-ink"
              }`}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setTab("enquiries")}
              className={`rounded-[2px] px-4 py-2 text-[13px] font-medium ${
                tab === "enquiries" ? "bg-ink text-white" : "bg-white text-ink-soft hover:text-ink"
              }`}
            >
              Callback Enquiries ({enquiries.length})
            </button>
          </div>

          {tab === "appointments" && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="field h-10 w-full py-0 text-[13px] sm:w-44"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <label className="flex w-full items-center gap-2 rounded-[3px] border border-line bg-white px-3 sm:w-64">
                <Search size={15} className="shrink-0 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone or ref…"
                  className="h-10 w-full bg-transparent text-[13px] outline-none"
                />
              </label>
            </div>
          )}
        </div>

        {/* Appointments list */}
        {tab === "appointments" ? (
          <div className="mt-6 space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="rounded-[3px] border border-line bg-white p-10 text-center text-[14.5px] text-muted">
                No appointments match your current filter. New bookings from <Link href="/book" className="text-blue underline">/book</Link> will appear here right away.
              </div>
            ) : (
              filteredAppointments.map((a) => {
                const draft = noteDrafts[a.reference] ?? a.staffNote;
                const waConfirm = patientWhatsAppUrl(
                  a.phone,
                  `Hello ${a.patientName}, your ${a.serviceName} appointment at Hilton Clinics (2 Ejekwu Wike St, Ada-George) is confirmed for ${formatDateReadable(
                    a.date
                  )} at ${formatTime12(a.timeSlot)}. Reference: ${a.reference}.`
                );
                return (
                  <article key={a.id} className="rounded-[3px] border border-line bg-white p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-blue">
                            {a.reference}
                          </span>
                          <span className={`rounded-[2px] border px-2.5 py-0.5 text-[11.5px] font-medium capitalize ${badgeMap[a.status]}`}>
                            {a.status}
                          </span>
                          <span className="text-[12px] capitalize text-muted">
                            {a.visitType.replace("-", " ")} · {a.ageGroup}
                          </span>
                        </div>
                        <h3 className="heading mt-2 text-[20px] text-ink">
                          {a.patientName} — <span className="font-normal text-ink-soft">{a.serviceName}</span>
                        </h3>
                        <p className="mt-1 text-[14px] text-ink-soft">
                          {formatDateReadable(a.date)} at <strong className="font-medium text-ink">{formatTime12(a.timeSlot)}</strong> ·{" "}
                          <a href={`tel:${a.phone}`} className="underline-offset-2 hover:underline">{a.phone}</a>
                          {a.email ? ` · ${a.email}` : ""} · prefers {a.preferredContact}
                        </p>
                        {a.notes && (
                          <p className="mt-2.5 rounded-[2px] bg-paper px-3.5 py-2 text-[13.5px] text-ink-soft">
                            Patient note: {a.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {a.status !== "confirmed" && (
                          <button
                            disabled={busyRef === a.reference}
                            onClick={() => updateBooking(a.reference, { status: "confirmed" })}
                            className="rounded-[2px] bg-sage px-3.5 py-2 text-[12.5px] font-medium text-white hover:opacity-90 disabled:opacity-40"
                          >
                            Confirm
                          </button>
                        )}
                        {a.status !== "completed" && (
                          <button
                            disabled={busyRef === a.reference}
                            onClick={() => updateBooking(a.reference, { status: "completed" })}
                            className="rounded-[2px] border border-line px-3.5 py-2 text-[12.5px] text-ink hover:border-ink disabled:opacity-40"
                          >
                            Mark completed
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button
                            disabled={busyRef === a.reference}
                            onClick={() => updateBooking(a.reference, { status: "cancelled" })}
                            className="rounded-[2px] border border-clay/30 px-3.5 py-2 text-[12.5px] text-clay hover:bg-clay hover:text-white disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        )}
                        <a
                          href={waConfirm}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#1f7a4d] px-3.5 py-2 text-[12.5px] font-medium text-white hover:bg-[#17613c]"
                        >
                          <WhatsApp size={14} /> WhatsApp patient
                        </a>
                      </div>
                    </div>

                    {/* Staff note editor */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-4">
                      <input
                        value={draft}
                        onChange={(e) => setNoteDrafts((d) => ({ ...d, [a.reference]: e.target.value }))}
                        placeholder="Add a note visible on the patient's booking page (e.g. Please come fasting)…"
                        className="field h-9 flex-1 py-0 text-[13px]"
                      />
                      <button
                        type="button"
                        disabled={busyRef === a.reference || draft === a.staffNote}
                        onClick={() => updateBooking(a.reference, { staffNote: draft })}
                        className="inline-flex items-center gap-1 rounded-[2px] bg-ink px-3.5 py-2 text-[12px] font-medium text-white disabled:opacity-35"
                      >
                        <Check size={13} /> Save note
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {enquiries.length === 0 ? (
              <div className="rounded-[3px] border border-line bg-white p-10 text-center text-[14.5px] text-muted">
                No contact enquiries yet. Messages submitted on <Link href="/contact" className="text-blue underline">/contact</Link> appear here.
              </div>
            ) : (
              enquiries.map((e) => (
                <article key={e.id} className="rounded-[3px] border border-line bg-white p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded-[2px] border px-2.5 py-0.5 text-[11.5px] font-medium ${
                            e.status === "new"
                              ? "border-blue/30 bg-blue-soft text-blue"
                              : "border-sage/30 bg-sage/10 text-sage"
                          }`}
                        >
                          {e.status === "new" ? "New" : "Replied"}
                        </span>
                        <span className="eyebrow text-muted">{e.topic}</span>
                      </div>
                      <h3 className="heading mt-2 text-[19px] text-ink">{e.name}</h3>
                      <p className="mt-0.5 text-[13.5px] text-muted">
                        {e.phone} · prefers {e.preferredChannel}
                      </p>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{e.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={patientWhatsAppUrl(
                          e.phone,
                          `Hello ${e.name}, thank you for contacting Hilton Clinics regarding ${e.topic}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#1f7a4d] px-3.5 py-2 text-[12.5px] font-medium text-white hover:bg-[#17613c]"
                      >
                        <WhatsApp size={14} /> Reply on WhatsApp
                      </a>
                      <button
                        onClick={() => toggleEnquiry(e)}
                        className="rounded-[2px] border border-line px-3.5 py-2 text-[12.5px] text-ink hover:border-ink"
                      >
                        {e.status === "new" ? "Mark replied" : "Reopen"}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
