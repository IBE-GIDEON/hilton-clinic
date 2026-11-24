import { whatsappLink } from "./site";

export function formatTime12(time24: string): string {
  const [hRaw, mRaw] = time24.split(":").map(Number);
  if (Number.isNaN(hRaw) || Number.isNaN(mRaw)) return time24;
  const suffix = hRaw >= 12 ? "pm" : "am";
  const h = hRaw % 12 || 12;
  return `${h}:${String(mRaw).padStart(2, "0")} ${suffix}`;
}

export function formatDateReadable(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

export function bookingWhatsAppUrl(b: {
  reference: string;
  patientName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
}) {
  const msg = [
    `Hello Hilton Clinics, I just booked an appointment online.`,
    `Ref: ${b.reference}`,
    `Patient: ${b.patientName}`,
    `Department: ${b.serviceName}`,
    `Date & Time: ${formatDateReadable(b.date)} at ${formatTime12(b.timeSlot)}`,
  ].join("\n");
  return whatsappLink(msg);
}

export function patientWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits.startsWith("234") ? digits : `234${digits}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}
