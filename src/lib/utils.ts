import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

// ── Tailwind class merger ─────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Currency formatter (BDT) ──────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(amount);
}

// ── Date formatters ───────────────────────────────────────────
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy, hh:mm a");
}

// ── Stock status helper ───────────────────────────────────────
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(
  quantity: number,
  reorderLevel: number
): StockStatus {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= reorderLevel) return "low_stock";
  return "in_stock";
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case "in_stock":     return "In Stock";
    case "low_stock":    return "Low Stock";
    case "out_of_stock": return "Out of Stock";
  }
}

export function getStockStatusColor(status: StockStatus): string {
  switch (status) {
    case "in_stock":     return "text-green-600 bg-green-50";
    case "low_stock":    return "text-amber-600 bg-amber-50";
    case "out_of_stock": return "text-red-600 bg-red-50";
  }
}

// ── Invoice number generator (client-side fallback) ───────────
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
  return `INV-${year}-${rand}`;
}

// ── Cart calculations ─────────────────────────────────────────
export function calculateCartTotals(items: {
  quantity: number;
  unit_price: number;
  discount_pct: number;
}[]) {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.quantity * item.unit_price;
  }, 0);

  const discount_amount = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unit_price;
    return sum + (lineTotal * item.discount_pct) / 100;
  }, 0);

  const tax_amount = 0; // adjust if you add VAT later
  const total_amount = subtotal - discount_amount + tax_amount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount_amount: Math.round(discount_amount * 100) / 100,
    tax_amount,
    total_amount: Math.round(total_amount * 100) / 100,
  };
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
