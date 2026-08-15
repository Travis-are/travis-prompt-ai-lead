"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, User } from "lucide-react";

type Appointment = {
  id: string;
  lead: { name: string | null; email: string | null; phone: string | null } | null;
  type: string;
  date: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => setAppointments(data.appointments || []))
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  const statusBadge = (status: string) => {
    const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ";
    if (status === "booked") return base + "bg-green-50 text-green-700";
    if (status === "confirmed") return base + "bg-blue-50 text-blue-700";
    if (status === "cancelled") return base + "bg-red-50 text-red-700";
    return base + "bg-yellow-50 text-yellow-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>

      <div className="flex gap-2 mb-6">
        {["all", "requested", "booked", "confirmed", "cancelled"].map((f) => (
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
                <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No appointments yet. They will appear when visitors request them through the chatbot.
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{appt.lead?.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{appt.lead?.email || appt.lead?.phone || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{appt.type}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(appt.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(appt.status)}>{appt.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{appt.notes || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {appt.status === "requested" && (
                          <>
                            <button
                              onClick={() => updateStatus(appt.id, "booked")}
                              className="text-green-600 hover:text-green-700"
                              title="Mark as booked"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => updateStatus(appt.id, "cancelled")}
                              className="text-red-600 hover:text-red-700"
                              title="Cancel"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {appt.status === "booked" && (
                          <button
                            onClick={() => updateStatus(appt.id, "confirmed")}
                            className="text-blue-600 hover:text-blue-700"
                            title="Confirm"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
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
