import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createEnquiry, listEnquiries, markEnquiryStatus } from "@/lib/db";
import { isStaffAuthenticated } from "@/lib/auth";

const postSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(7, "Please enter a phone number we can reach").max(25),
  topic: z.string().trim().min(2).max(100),
  message: z.string().trim().min(5, "Please share a brief message so we can help").max(1000),
  preferredChannel: z.enum(["whatsapp", "phone"]).default("whatsapp"),
});

const patchSchema = z.object({
  id: z.string().min(2),
  status: z.enum(["new", "replied"]),
});

export async function GET() {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Please complete all fields." },
      { status: 400 }
    );
  }
  const enquiry = await createEnquiry(parsed.data);
  return NextResponse.json({ enquiry }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await isStaffAuthenticated())) {
    return NextResponse.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status update." }, { status: 400 });
  }
  const updated = await markEnquiryStatus(parsed.data.id, parsed.data.status);
  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }
  return NextResponse.json({ enquiry: updated });
}
