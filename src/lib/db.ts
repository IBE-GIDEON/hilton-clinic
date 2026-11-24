import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type VisitType = "first-visit" | "follow-up" | "dialysis" | "lab-test";
export type AgeGroup = "child" | "adult" | "senior";
export type ContactChannel = "whatsapp" | "phone";

export type Appointment = {
  id: string;
  reference: string;
  serviceSlug: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM (24h)
  visitType: VisitType;
  patientName: string;
  phone: string;
  email: string;
  ageGroup: AgeGroup;
  preferredContact: ContactChannel;
  notes: string;
  status: AppointmentStatus;
  staffNote: string;
  createdAt: string;
  updatedAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  topic: string;
  message: string;
  preferredChannel: ContactChannel;
  status: "new" | "replied";
  createdAt: string;
};

type DatabaseSchema = {
  appointments: Appointment[];
  enquiries: Enquiry[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "clinic-db.json");

let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
}

async function readDb(): Promise<DatabaseSchema> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return {
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") {
      return { appointments: [], enquiries: [] };
    }
    throw err;
  }
}

async function writeDb(db: DatabaseSchema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length >= 13) {
    return "0" + digits.slice(3);
  }
  return digits;
}

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.slice(-10) === nb.slice(-10) && na.length >= 10 && nb.length >= 10;
}

export function todayInLagos(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).getUTCDay(); // 0=Sun..6=Sat
}

export function getStandardSlots(dateStr: string, serviceSlug: string): { slots: string[]; note?: string } {
  const dow = getDayOfWeek(dateStr);
  if (dow === 0) {
    if (serviceSlug === "nephrology-dialysis") {
      return {
        slots: ["09:00", "12:30", "16:00"],
        note: "Sunday haemodialysis sessions run by appointment; emergency care is open 24 hours.",
      };
    }
    return {
      slots: [],
      note: "Sunday is dedicated to 24-hour emergencies, admitted patients and scheduled dialysis. Please pick Monday–Saturday for specialist clinics, or call 0708 902 9932 for urgent care.",
    };
  }
  if (dow === 6) {
    if (serviceSlug === "nephrology-dialysis") {
      return {
        slots: ["08:30", "10:00", "11:30", "13:00", "14:30"],
        note: "Saturday clinic hours: 9:00 am – 3:00 pm (dialysis starts 8:30 am).",
      };
    }
    return {
      slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:30", "14:00", "14:30"],
      note: "Saturday consultation hours: 9:00 am – 3:00 pm.",
    };
  }
  if (serviceSlug === "nephrology-dialysis") {
    return {
      slots: ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"],
    };
  }
  return {
    slots: [
      "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
      "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    ],
  };
}

export async function getAvailability(dateStr: string, serviceSlug: string) {
  const db = await readDb();
  const { slots, note } = getStandardSlots(dateStr, serviceSlug);
  const taken = new Set(
    db.appointments
      .filter((a) => a.date === dateStr && a.serviceSlug === serviceSlug && a.status !== "cancelled")
      .map((a) => a.timeSlot)
  );
  const today = todayInLagos();
  const isPast = dateStr < today;

  return {
    date: dateStr,
    serviceSlug,
    isPast,
    note,
    slots: slots.map((time) => ({
      time,
      available: !isPast && !taken.has(time),
    })),
  };
}

function generateReference(existing: Set<string>): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  for (let i = 0; i < 20; i++) {
    const code = `HC-${yy}${mm}-${crypto.randomInt(1000, 9999)}`;
    if (!existing.has(code)) return code;
  }
  return `HC-${yy}${mm}-${Date.now().toString().slice(-4)}`;
}

export async function createAppointment(input: {
  serviceSlug: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  visitType: VisitType;
  patientName: string;
  phone: string;
  email: string;
  ageGroup: AgeGroup;
  preferredContact: ContactChannel;
  notes: string;
}): Promise<{ ok: true; appointment: Appointment } | { ok: false; error: string; status: number }> {
  return serialize(async () => {
    const db = await readDb();
    const today = todayInLagos();
    if (input.date < today) {
      return { ok: false, error: "Please choose today or a future date.", status: 400 };
    }
    const { slots } = getStandardSlots(input.date, input.serviceSlug);
    if (!slots.includes(input.timeSlot)) {
      return { ok: false, error: "That time slot is not offered on the selected day.", status: 400 };
    }
    const conflict = db.appointments.some(
      (a) =>
        a.date === input.date &&
        a.serviceSlug === input.serviceSlug &&
        a.timeSlot === input.timeSlot &&
        a.status !== "cancelled"
    );
    if (conflict) {
      return { ok: false, error: "That time slot has just been booked. Please pick another time.", status: 409 };
    }

    const refs = new Set(db.appointments.map((a) => a.reference));
    const now = new Date().toISOString();
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      reference: generateReference(refs),
      serviceSlug: input.serviceSlug,
      serviceName: input.serviceName,
      date: input.date,
      timeSlot: input.timeSlot,
      visitType: input.visitType,
      patientName: input.patientName.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      ageGroup: input.ageGroup,
      preferredContact: input.preferredContact,
      notes: input.notes.trim(),
      status: "pending",
      staffNote: "",
      createdAt: now,
      updatedAt: now,
    };

    db.appointments.unshift(appointment);
    await writeDb(db);
    return { ok: true, appointment };
  });
}

export async function listAppointments(): Promise<Appointment[]> {
  const db = await readDb();
  return db.appointments;
}

export async function findAppointmentByRef(reference: string): Promise<Appointment | undefined> {
  const db = await readDb();
  const target = reference.trim().toUpperCase();
  return db.appointments.find((a) => a.reference.toUpperCase() === target);
}

export async function updateAppointment(
  reference: string,
  patch: {
    date?: string;
    timeSlot?: string;
    status?: AppointmentStatus;
    staffNote?: string;
  }
): Promise<{ ok: true; appointment: Appointment } | { ok: false; error: string; status: number }> {
  return serialize(async () => {
    const db = await readDb();
    const target = reference.trim().toUpperCase();
    const idx = db.appointments.findIndex((a) => a.reference.toUpperCase() === target);
    if (idx === -1) {
      return { ok: false, error: "Booking reference not found.", status: 404 };
    }

    const current = db.appointments[idx];
    const nextDate = patch.date ?? current.date;
    const nextSlot = patch.timeSlot ?? current.timeSlot;
    const nextStatus = patch.status ?? current.status;

    if (patch.date || patch.timeSlot) {
      if (nextDate < todayInLagos()) {
        return { ok: false, error: "Please select today or an upcoming date.", status: 400 };
      }
      const { slots } = getStandardSlots(nextDate, current.serviceSlug);
      if (!slots.includes(nextSlot)) {
        return { ok: false, error: "Selected time slot is unavailable on that day.", status: 400 };
      }
      const conflict = db.appointments.some(
        (a, i) =>
          i !== idx &&
          a.date === nextDate &&
          a.serviceSlug === current.serviceSlug &&
          a.timeSlot === nextSlot &&
          a.status !== "cancelled"
      );
      if (conflict) {
        return { ok: false, error: "That time slot is already taken. Please select another.", status: 409 };
      }
    }

    const updated: Appointment = {
      ...current,
      date: nextDate,
      timeSlot: nextSlot,
      status: nextStatus,
      staffNote: patch.staffNote !== undefined ? patch.staffNote.trim() : current.staffNote,
      updatedAt: new Date().toISOString(),
    };

    db.appointments[idx] = updated;
    await writeDb(db);
    return { ok: true, appointment: updated };
  });
}

export async function createEnquiry(input: {
  name: string;
  phone: string;
  topic: string;
  message: string;
  preferredChannel: ContactChannel;
}): Promise<Enquiry> {
  return serialize(async () => {
    const db = await readDb();
    const enquiry: Enquiry = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      topic: input.topic.trim(),
      message: input.message.trim(),
      preferredChannel: input.preferredChannel,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    db.enquiries.unshift(enquiry);
    await writeDb(db);
    return enquiry;
  });
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const db = await readDb();
  return db.enquiries;
}

export async function markEnquiryStatus(id: string, status: "new" | "replied"): Promise<Enquiry | null> {
  return serialize(async () => {
    const db = await readDb();
    const idx = db.enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    db.enquiries[idx] = { ...db.enquiries[idx], status };
    await writeDb(db);
    return db.enquiries[idx];
  });
}
