import { createClient } from "@/lib/supabase/server";
import {
  Pill, ShoppingCart, Users, TrendingUp,
  AlertTriangle, Package, ArrowUpRight, Activity
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: totalMedicines },
    { count: lowStockCount },
    { count: totalPatients },
    { count: todaySales },
    { data: recentSales },
    { data: lowStockItems },
  ] = await Promise.all([
    supabase.from("medicines").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("medicines").select("*", { count: "exact", head: true })
      .lte("stock_quantity", supabase.rpc as unknown as number)
      .filter("stock_quantity", "lte", "reorder_level"),
    supabase.from("patients").select("*", { count: "exact", head: true }),
    supabase.from("sales").select("*", { count: "exact", head: true })
      .gte("sale_date", new Date().toISOString().split("T")[0]),
    supabase.from("sales")
      .select("id, invoice_number, total_amount, payment_method, sale_date, patients(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("low_stock_medicines").select("*").limit(5),
  ]);

  const stats = [
    {
      label: "Total Medicines",
      value: totalMedicines?.toLocaleString() ?? "0",
      icon: Pill,
      color: "var(--color-primary)",
      bg: "var(--color-primary-pale)",
      href: "/dashboard/inventory",
      change: "21,714 in database",
    },
    {
      label: "Today's Sales",
      value: todaySales?.toLocaleString() ?? "0",
      icon: ShoppingCart,
      color: "var(--color-info)",
      bg: "var(--color-info-bg)",
      href: "/dashboard/sales",
      change: "invoices today",
    },
    {
      label: "Total Patients",
      value: totalPatients?.toLocaleString() ?? "0",
      icon: Users,
      color: "var(--color-success)",
      bg: "var(--color-success-bg)",
      href: "/dashboard/patients",
      change: "registered patients",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount?.toLocaleString() ?? "0",
      icon: AlertTriangle,
      color: "var(--color-warning)",
      bg: "var(--color-warning-bg)",
      href: "/dashboard/inventory?filter=low_stock",
      change: "need restocking",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {new Date().toLocaleDateString("en-BD", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })}
          </p>
        </div>
        <Link
          href="/dashboard/sales/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--color-primary)" }}
        >
          <ShoppingCart size={16} />
          New Sale
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, href, change }) => (
          <Link key={label} href={href}
            className="card p-5 flex items-start gap-4 hover:shadow-md transition-all group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>{value}</p>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-light)" }}>{change}</p>
            </div>
            <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--color-text-muted)" }} />
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: "var(--color-primary)" }} />
              <h2 className="font-semibold text-sm">Recent Sales</h2>
            </div>
            <Link href="/dashboard/sales"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}>
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {recentSales && recentSales.length > 0 ? (
              recentSales.map((sale: any) => (
                <div key={sale.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "var(--color-primary)" }}>
                    {sale.patients?.full_name?.[0] ?? "G"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {sale.patients?.full_name ?? "Walk-in Customer"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {sale.invoice_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                      ৳{Number(sale.total_amount).toFixed(2)}
                    </p>
                    <p className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>
                      {sale.payment_method}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center" style={{ color: "var(--color-text-muted)" }}>
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No sales yet. <Link href="/dashboard/sales/new"
                  className="underline" style={{ color: "var(--color-primary)" }}>Make your first sale →</Link></p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <Package size={16} style={{ color: "var(--color-warning)" }} />
              <h2 className="font-semibold text-sm">Low Stock Medicines</h2>
            </div>
            <Link href="/dashboard/inventory?filter=low_stock"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}>
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {lowStockItems && lowStockItems.length > 0 ? (
              lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-warning-bg)" }}>
                    <Pill size={14} style={{ color: "var(--color-warning)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.brand_name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                      {item.generic_name ?? "—"} · {item.dosage_form ?? "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`badge ${item.stock_quantity === 0 ? "badge-danger" : "badge-warning"}`}>
                      {item.stock_quantity === 0 ? "Out of stock" : `${item.stock_quantity} left`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center" style={{ color: "var(--color-text-muted)" }}>
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">All medicines are well stocked! ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
