"use client";

import { useState, useEffect } from "react";
import { Phone, Send, CheckCircle, Clock, User, MessageSquare } from "lucide-react";

type FollowUp = {
  id: string;
  lead: { name: string | null; email: string | null; productInterest: string | null } | null;
  sequenceNum: number;
  message: string;
  sentAt: string | null;
  status: string;
  createdAt: string;
};

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/followups")
      .then((r) => r.json())
      .then((data) => setFollowups(data.followups || []))
      .catch(() => {});
  }, []);

  const markSent = async (id: string) => {
    await fetch("/api/followups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "sent", sentAt: new Date().toISOString() }),
    });
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "sent", sentAt: new Date().toISOString() } : f))
    );
  };

  const filtered = filter === "all" ? followups : followups.filter((f) => f.status === filter);

  const statusBadge = (status: string) => {
    const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ";
    if (status === "sent") return base + "bg-green-50 text-green-700";
    if (status === "completed") return base + "bg-blue-50 text-blue-700";
    return base + "bg-yellow-50 text-yellow-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Follow-ups</h1>

      <div className="flex gap-2 mb-6">
        {["all", "pending", "sent", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              filter === f
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Lead</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Sequence</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Message</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Sent At</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No follow-ups yet. They are created automatically when leads show interest.
                  </td>
                </tr>
              ) : (
                filtered.map((fu) => (
                  <tr key={fu.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{fu.lead?.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{fu.lead?.email || "-"}</div>
                      <div className="text-xs text-gray-400">Interest: {fu.lead?.productInterest || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                        {fu.sequenceNum}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{fu.message}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(fu.status)}>{fu.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {fu.sentAt ? new Date(fu.sentAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {fu.status === "pending" && (
                        <button
                          onClick={() => markSent(fu.id)}
                          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-medium"
                        >
                          <Send size={14} /> Mark Sent
                        </button>
                      )}
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
