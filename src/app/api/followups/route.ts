import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const followups = await db.getFollowUps();
    return NextResponse.json({ followups });
  } catch {
    return NextResponse.json({ followups: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const followup = await db.createFollowUp(body);
    return NextResponse.json({ success: true, followup });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const followup = await db.updateFollowUp(id, data);
    return NextResponse.json({ success: true, followup });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
