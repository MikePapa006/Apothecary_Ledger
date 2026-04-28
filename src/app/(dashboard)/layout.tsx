"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Users,
  Truck,
  FileText,
  BarChart3,
  Bell,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",             label: "Dashboard",    icon: LayoutDashboard },
  { href: "/dashboard/inventory",   label: "Inventory",    icon: Pill },
  { href: "/dashboard/sales",       label: "Sales & POS",  icon: ShoppingCart },
  { href: "/dashboard/patients",    label: "Patients",     icon: Users },
  { href: "/dashboard/suppliers",   label: "Suppliers",    icon: Truck },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/dashboard/reports",     label: "Reports",      icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-bg)" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col
          transition-transform duration-300 lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: "var(--sidebar-width)",
          background: "var(--sidebar-bg)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "var(--color-accent)" }}>
            ⚕
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Apothecary</div>
            <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>Ledger</div>
          </div>
          <button
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: active ? "white" : "var(--sidebar-text)",
                  background: active ? "var(--sidebar-active)" : "transparent",
                  borderLeft: active ? "3px solid var(--color-accent)" : "3px solid transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Low stock alert */}
        <div className="mx-3 mb-3 p-3 rounded-lg"
          style={{ background: "rgba(232,168,56,0.12)", border: "1px solid rgba(232,168,56,0.25)" }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={13} style={{ color: "var(--color-accent)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
              Low Stock Alert
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--sidebar-text)" }}>
            Check inventory for items below reorder level.
          </p>
          <Link href="/dashboard/inventory?filter=low_stock"
            className="text-xs font-medium mt-1 block"
            style={{ color: "var(--color-accent)" }}>
            View items →
          </Link>
        </div>

        {/* User */}
        <div className="px-4 py-4 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>
            <div className="font-medium text-white/80">My Account</div>
            <div>Settings & profile</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Page title injected by children via context — for now just show app name */}
          <div className="flex-1" />

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={18} style={{ color: "var(--color-text-muted)" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "var(--color-danger)" }} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
