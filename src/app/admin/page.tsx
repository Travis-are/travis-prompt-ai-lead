"use client";

import { useEffect, useState } from "react";
import { Users, Flame, Thermometer, Snowflake, Calendar, Phone, MessageSquare, AlertCircle, Clock, TrendingUp } from "lucide-react";

type Stats = {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  appointmentsRequested: number;
  appointmentsBooked: number;
  followUpsPending: number;
  humanHandoffs: number;
  unresolved: number;
  avgResponseTime: string;
  conversionRate: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0, hotLeads: 0, warmLeads: 0, coldLeads: 0,
    appointmentsRequested: 0, appointmentsBooked: 0,
    followUpsPending: 0, humanHandoffs: 0, unresolved: 0,
    avgResponseTime: "-", conversionRate: "-",
  });

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "bg-blue-50 text-blue-700" },
    { label: "Hot Leads", value: stats.hotLeads, icon: Flame, color: "bg-red-50 text-red-700" },
    { label: "Warm Leads", value: stats.warmLeads, icon: Thermometer, color: "bg-orange-50 text-orange-700" },
    { label: "Cold Leads", value: stats.coldLeads, icon: Snowflake, color: "bg-cyan-50 text-cyan-700" },
    { label: "Appointments Requested", value: stats.appointmentsRequested, icon: Calendar, color: "bg-purple-50 text-purple-700" },
    { label: "Appointments Booked", value: stats.appointmentsBooked, icon: Calendar, color: "bg-green-50 text-green-700" },
    { label: "Follow-ups Pending", value: stats.followUpsPending, icon: Phone, color: "bg-yellow-50 text-yellow-700" },
    { label: "Human Handoffs", value: stats.humanHandoffs, icon: MessageSquare, color: "bg-pink-50 text-pink-700" },
    { label: "Unresolved", value: stats.unresolved, icon: AlertCircle, color: "bg-gray-50 text-gray-700" },
    { label: "Avg Response Time", value: stats.avgResponseTime, icon: Clock, color: "bg-indigo-50 text-indigo-700" },
    { label: "Conversion Rate", value: stats.conversionRate, icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-500">Activity will appear here as conversations happen.</p>
      </div>
    </div>
  );
}
