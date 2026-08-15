import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leads = await db.getLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = await db.createLead(body);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const lead = await db.updateLead(id, data);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
