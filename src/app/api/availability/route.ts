import { NextRequest, NextResponse } from "next/server";
import { getAvailability, todayInLagos } from "@/lib/db";
import { bookableServices } from "@/lib/services";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") || todayInLagos();
  const service = req.nextUrl.searchParams.get("service") || bookableServices[0].slug;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  const data = await getAvailability(date, service);
  return NextResponse.json(data);
}
