"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MessageSquare, Calendar, Phone, AlertCircle } from "lucide-react";

type AnalyticsData = {
  totalInquiries: number;
  responseTime: number;
  inquiriesAnswered: number;
  qualifiedLeads: number;
  appointmentRequests: number;
  appointmentsBooked: number;
  followUpCompletion: number;
  humanHandoffRate: number;
  unresolvedCount: number;
  topQuestions: string | null;
  commonObjections: string | null;
  leadSources: string | null;
  outcomes: string | null;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((res) => {
        // The analytics endpoint returns dashboard stats, not the analytics table
        // So we'll show what we have
        setData({
          totalInquiries: res.totalLeads || 0,
          responseTime: 0,
          inquiriesAnswered: res.totalLeads || 0,
          qualifiedLeads: (res.hotLeads || 0) + (res.warmLeads || 0),
          appointmentRequests: res.appointmentsRequested || 0,
          appointmentsBooked: res.appointmentsBooked || 0,
          followUpCompletion: 0,
          humanHandoffRate: res.humanHandoffs || 0,
          unresolvedCount: res.unresolved || 0,
          topQuestions: null,
          commonObjections: null,
          leadSources: null,
          outcomes: null,
        });
      })
      .catch(() => {});
  }, []);

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Inquiries" value={data.totalInquiries} icon={MessageSquare} color="bg-blue-50 text-blue-700" />
        <StatCard label="Inquiries Answered" value={data.inquiriesAnswered} icon={TrendingUp} color="bg-green-50 text-green-700" />
        <StatCard label="Qualified Leads" value={data.qualifiedLeads} icon={Users} color="bg-purple-50 text-purple-700" />
        <StatCard label="Appointment Requests" value={data.appointmentRequests} icon={Calendar} color="bg-orange-50 text-orange-700" />
        <StatCard label="Appointments Booked" value={data.appointmentsBooked} icon={Calendar} color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Human Handoffs" value={data.humanHandoffRate} icon={Phone} color="bg-pink-50 text-pink-700" />
        <StatCard label="Unresolved" value={data.unresolvedCount} icon={AlertCircle} color="bg-red-50 text-red-700" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
        </div>
        <p className="text-sm text-gray-500">
          Detailed analytics will populate as your chatbot handles real conversations.
          Connect your database to track trends over time.
        </p>
      </div>
    </div>
  );
}
