"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Flame, Thermometer, Snowflake, Eye, Phone, Calendar } from "lucide-react";
import Link from "next/link";

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  productInterest: string | null;
  location: string | null;
  leadScore: string;
  status: string;
  assignedTo: string | null;
  nextAction: string | null;
  followUpDate: string | null;
  appointmentDate: string | null;
  handoffStatus: string;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => setLeads(data.leads || []))
      .catch(() => {});
  }, []);

  const filtered = leads.filter((lead) => {
    const matchesFilter = filter === "all" || lead.leadScore === filter;
    const matchesSearch =
      !search ||
      (lead.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.company || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scoreIcon = (score: string) => {
    if (score === "HOT") return <Flame size={14} className="text-red-500" />;
    if (score === "WARM") return <Thermometer size={14} className="text-orange-500" />;
    return <Snowflake size={14} className="text-cyan-500" />;
  };

  const scoreBadge = (score: string) => {
    const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ";
    if (score === "HOT") return base + "bg-red-50 text-red-700";
    if (score === "WARM") return base + "bg-orange-50 text-orange-700";
    return base + "bg-cyan-50 text-cyan-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "HOT", "WARM", "COLD"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Interest</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Assigned</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Next Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No leads found. They will appear here when visitors chat with your assistant.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{lead.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{lead.company || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{lead.email || "-"}</div>
                      <div className="text-xs text-gray-500">{lead.phone || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{lead.productInterest || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={scoreBadge(lead.leadScore)}>
                        {scoreIcon(lead.leadScore)}
                        {lead.leadScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{lead.assignedTo || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{lead.nextAction || "-"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/conversations`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
