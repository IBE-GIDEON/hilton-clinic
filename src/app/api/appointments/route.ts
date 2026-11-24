import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAppointment, findAppointmentByRef, listAppointments, phonesMatch } from "@/lib/db";
import { isStaffAuthenticated } from "@/lib/auth";
import { bookableServices } from "@/lib/services";
import { bookingWhatsAppUrl } from "@/lib/format";

const createSchema = z.object({
  serviceSlug: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Select a time slot"),
  visitType: z.enum(["first-visit", "follow-up", "dialysis", "lab-test"]).default("first-visit"),
  patientName: z.string().trim().min(2, "Please enter the patient's full name").max(120),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(25),
  email: z.string().trim().email("Please enter a valid email").or(z.literal("")).default(""),
  ageGroup: z.enum(["child", "adult", "senior"]).default("adult"),
  preferredContact: z.enum(["whatsapp", "phone"]).default("whatsapp"),
  notes: z.string().trim().max(600).default(""),
});

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  const phone = req.nextUrl.searchParams.get("phone");

  if (ref) {
    const booking = await findAppointmentByRef(ref);
    const staff = await isStaffAuthenticated();
    if (!booking) {
      return NextResponse.json({ error: "No appointment found with that reference code." }, { status: 404 });
    }
    if (!staff) {
      if (!phone || !phonesMatch(phone, booking.phone)) {
        return NextResponse.json(
          { error: "The phone number does not match this booking reference." },
          { status: 403 }
        );
      }
    }
    return NextResponse.json({
      appointment: booking,
      whatsappUrl: bookingWhatsAppUrl(booking),
    });
  }

  const staff = await isStaffAuthenticated();
  if (!staff) {
    return NextResponse.json({ error: "Staff sign-in required." }, { status: 401 });
  }

  const appointments = await listAppointments();
  return NextResponse.json({ appointments });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Please check all required fields.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const svc = bookableServices.find((s) => s.slug === parsed.data.serviceSlug);
  if (!svc) {
    return NextResponse.json({ error: "Please select a valid clinic department." }, { status: 400 });
  }

  const result = await createAppointment({
    ...parsed.data,
    serviceName: svc.name,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(
    {
      appointment: result.appointment,
      whatsappUrl: bookingWhatsAppUrl(result.appointment),
    },
    { status: 201 }
  );
}
