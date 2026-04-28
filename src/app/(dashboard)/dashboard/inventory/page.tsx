import { createClient } from "@/lib/supabase/server";
import { Pill, Search, Filter, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";

type SearchParams = { filter?: string; q?: string; page?: string };

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { filter, q, page } = await searchParams;
  const supabase = await createClient();

  const currentPage = parseInt(page ?? "1");
  const pageSize = 20;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("medicines")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("brand_name", { ascending: true })
    .range(from, to);

  if (q) {
    query = query.or(
      `brand_name.ilike.%${q}%,generic_name.ilike.%${q}%,manufacturer_name.ilike.%${q}%`
    );
  }

  if (filter === "low_stock") {
    query = query.filter("stock_quantity", "lte", "reorder_level");
  } else if (filter === "out_of_stock") {
    query = query.eq("stock_quantity", 0);
  } else if (filter === "herbal") {
    query = query.eq("type", "herbal");
  }

  const { data: medicines, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {count?.toLocaleString() ?? 0} medicines
          </p>
        </div>
        <Link
          href="/dashboard/inventory/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 self-start"
          style={{ background: "var(--color-primary)" }}
        >
          <Plus size={16} />
          Add Medicine
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
          <Search size={15} style={{ color: "var(--color-text-muted)" }} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by brand, generic, or manufacturer..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--color-text)" }}
          />
        </form>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: "All", value: undefined },
            { label: "Low Stock", value: "low_stock" },
            { label: "Out of Stock", value: "out_of_stock" },
            { label: "Herbal", value: "herbal" },
          ].map(({ label, value }) => (
            <Link
              key={label}
              href={value ? `/dashboard/inventory?filter=${value}` : "/dashboard/inventory"}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === value ? "var(--color-primary)" : "var(--color-bg)",
                color: filter === value ? "white" : "var(--color-text-muted)",
                border: `1px solid ${filter === value ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
                {["Brand Name", "Generic", "Dosage Form", "Strength", "Manufacturer", "Price (৳)", "Stock", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                    style={{ color: "var(--color-text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {medicines && medicines.length > 0 ? (
                medicines.map((med: any) => {
                  const isOut = med.stock_quantity === 0;
                  const isLow = !isOut && med.stock_quantity <= med.reorder_level;
                  return (
                    <tr key={med.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "var(--color-primary-pale)" }}>
                            <Pill size={13} style={{ color: "var(--color-primary)" }} />
                          </div>
                          <div>
                            <p className="font-medium">{med.brand_name}</p>
                            <p className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>
                              {med.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>
                        {med.generic_name ?? "—"}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>
                        {med.dosage_form ?? "—"}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-text-muted)" }}>
                        {med.strength ?? "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[160px] truncate"
                        style={{ color: "var(--color-text-muted)" }}>
                        {med.manufacturer_name ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">
                        {med.unit_price ? `৳${Number(med.unit_price).toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {med.stock_quantity}
                      </td>
                      <td className="px-4 py-3">
                        {isOut ? (
                          <span className="badge badge-danger">Out of Stock</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">
                            <AlertTriangle size={10} className="mr-1" />Low
                          </span>
                        ) : (
                          <span className="badge badge-success">In Stock</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center"
                    style={{ color: "var(--color-text-muted)" }}>
                    <Pill size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium">No medicines found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid var(--color-border)" }}>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Page {currentPage} of {totalPages} · {count?.toLocaleString()} total
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/dashboard/inventory?page=${currentPage - 1}${q ? `&q=${q}` : ""}${filter ? `&filter=${filter}` : ""}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50"
                  style={{ borderColor: "var(--color-border)" }}>
                  ← Prev
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/dashboard/inventory?page=${currentPage + 1}${q ? `&q=${q}` : ""}${filter ? `&filter=${filter}` : ""}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                  style={{ background: "var(--color-primary)" }}>
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
