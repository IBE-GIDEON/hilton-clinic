import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findAppointmentByRef, phonesMatch, updateAppointment } from "@/lib/db";
import { isStaffAuthenticated } from "@/lib/auth";
import { bookingWhatsAppUrl } from "@/lib/format";

const patchSchema = z.object({
  phone: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  staffNote: z.string().max(400).optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ ref: string }> }
) {
  const { ref } = await context.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update values." }, { status: 400 });
  }

  const existing = await findAppointmentByRef(ref);
  if (!existing) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const staff = await isStaffAuthenticated();
  if (!staff) {
    if (!parsed.data.phone || !phonesMatch(parsed.data.phone, existing.phone)) {
      return NextResponse.json({ error: "Phone verification failed for this booking." }, { status: 403 });
    }
    if (parsed.data.status && parsed.data.status !== "cancelled") {
      return NextResponse.json({ error: "Only clinic staff can set that status." }, { status: 403 });
    }
    if (parsed.data.staffNote !== undefined) {
      return NextResponse.json({ error: "Only clinic staff can edit internal notes." }, { status: 403 });
    }
  }

  const nextStatus =
    !staff && (parsed.data.date || parsed.data.timeSlot) && !parsed.data.status
      ? "pending"
      : parsed.data.status;

  const updated = await updateAppointment(ref, {
    date: parsed.data.date,
    timeSlot: parsed.data.timeSlot,
    status: nextStatus,
    staffNote: staff ? parsed.data.staffNote : undefined,
  });

  if (!updated.ok) {
    return NextResponse.json({ error: updated.error }, { status: updated.status });
  }

  return NextResponse.json({
    appointment: updated.appointment,
    whatsappUrl: bookingWhatsAppUrl(updated.appointment),
  });
}
