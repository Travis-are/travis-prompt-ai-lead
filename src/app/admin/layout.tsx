import Link from "next/link";
import { LayoutDashboard, Settings, Users, MessageSquare, Calendar, BarChart3, Phone } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/followups", label: "Follow-ups", icon: Phone },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/config", label: "Configuration", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-primary-700 text-sm">TRAVIS PROMPT AI</h2>
          <p className="text-[10px] text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
