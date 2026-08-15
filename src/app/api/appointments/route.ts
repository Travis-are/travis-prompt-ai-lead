import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const appointments = await db.getAppointments();
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ appointments: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appointment = await db.createAppointment(body);
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const appointment = await db.updateAppointment(id, data);
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
