"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Eye, CheckCircle, XCircle, User, Bot, Hand } from "lucide-react";

type Conversation = {
  id: string;
  leadId: string | null;
  lead: { name: string | null; email: string | null } | null;
  detectedIntent: string | null;
  leadScore: string | null;
  approvalStatus: string;
  isClosed: boolean;
  createdAt: string;
  messages: { role: string; content: string; createdAt: string }[];
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {});
  }, []);

  const approve = async (id: string) => {
    await fetch("/api/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approvalStatus: "approved" }),
    });
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approvalStatus: "approved" } : c))
    );
  };

  const close = async (id: string) => {
    await fetch("/api/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isClosed: true }),
    });
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isClosed: true } : c))
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Conversations</h1>

      {!selected ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Lead</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Intent</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Score</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Messages</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No conversations yet. They will appear when visitors use the chatbot.
                    </td>
                  </tr>
                ) : (
                  conversations.map((conv) => (
                    <tr key={conv.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {conv.lead?.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">{conv.lead?.email || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{conv.detectedIntent || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            conv.leadScore === "HOT"
                              ? "bg-red-50 text-red-700"
                              : conv.leadScore === "WARM"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {conv.leadScore || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            conv.isClosed
                              ? "bg-green-50 text-green-700"
                              : conv.approvalStatus === "approved"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {conv.isClosed ? "Closed" : conv.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{conv.messages?.length || 0}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelected(conv)}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={16} />
                          </button>
                          {!conv.isClosed && (
                            <>
                              <button
                                onClick={() => approve(conv.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => close(conv.id)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
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
      ) : (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to list
          </button>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Conversation with {selected.lead?.name || "Anonymous"}
                </h2>
                <p className="text-xs text-gray-500">
                  Intent: {selected.detectedIntent || "-"} | Score: {selected.leadScore || "-"} |{" "}
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {!selected.isClosed && (
                  <>
                    <button
                      onClick={() => {
                        approve(selected.id);
                        setSelected({ ...selected, approvalStatus: "approved" });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => {
                        close(selected.id);
                        setSelected({ ...selected, isClosed: true });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      <XCircle size={14} /> Close
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {selected.messages?.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-gray-200" : "bg-primary-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} className="text-primary-700" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
