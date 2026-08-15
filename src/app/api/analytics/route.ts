import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leads = await db.getLeads();
    const appointments = await db.getAppointments();
    const followups = await db.getFollowUps();
    const conversations = await db.getConversations();

    const hotLeads = leads.filter((l) => l.leadScore === "HOT").length;
    const warmLeads = leads.filter((l) => l.leadScore === "WARM").length;
    const coldLeads = leads.filter((l) => l.leadScore === "COLD").length;
    const handoffs = leads.filter((l) => l.handoffStatus !== "none").length;
    const unresolved = conversations.filter((c) => !c.isClosed).length;

    const totalInquiries = conversations.length;
    const qualifiedLeads = hotLeads + warmLeads;
    const conversionRate = totalInquiries > 0 ? ((qualifiedLeads / totalInquiries) * 100).toFixed(1) + "%" : "-";

    const stats = {
      totalLeads: leads.length,
      hotLeads,
      warmLeads,
      coldLeads,
      appointmentsRequested: appointments.filter((a) => a.status === "requested").length,
      appointmentsBooked: appointments.filter((a) => a.status === "booked").length,
      followUpsPending: followups.filter((f) => f.status === "pending").length,
      humanHandoffs: handoffs,
      unresolved,
      avgResponseTime: "-",
      conversionRate,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({
      totalLeads: 0, hotLeads: 0, warmLeads: 0, coldLeads: 0,
      appointmentsRequested: 0, appointmentsBooked: 0,
      followUpsPending: 0, humanHandoffs: 0, unresolved: 0,
      avgResponseTime: "-", conversionRate: "-",
    });
  }
}
