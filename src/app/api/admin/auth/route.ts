import { NextRequest, NextResponse } from "next/server";
import { clearStaffSession, createStaffSession, isStaffAuthenticated, verifyPasscode } from "@/lib/auth";

export async function GET() {
  const authenticated = await isStaffAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  let body: { passcode?: string } = {};
  try {
    body = (await req.json()) as { passcode?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.passcode || !verifyPasscode(body.passcode)) {
    return NextResponse.json({ error: "Incorrect staff passcode." }, { status: 401 });
  }

  await createStaffSession();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearStaffSession();
  return NextResponse.json({ authenticated: false });
}
