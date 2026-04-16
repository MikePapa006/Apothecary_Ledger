// ============================================================
// Apothecary Ledger — TypeScript Types
// ============================================================

// ── Reference / Lookup Types ─────────────────────────────────

export type DosageForm = {
  id: number;
  name: string;
  slug: string;
  brand_count: number;
  created_at: string;
};

export type DrugClass = {
  id: number;
  name: string;
  slug: string;
  generics_count: number;
  created_at: string;
};

export type Indication = {
  id: number;
  name: string;
  slug: string;
  generics_count: number;
  created_at: string;
};

export type Manufacturer = {
  id: number;
  name: string;
  slug: string;
  generics_count: number;
  brand_count: number;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
};

export type Generic = {
  id: number;
  name: string;
  slug: string;
  monograph_link: string | null;
  drug_class: string | null;
  indication: string | null;
  storage_conditions: string | null;
  created_at: string;
};

// ── Medicine / Inventory ──────────────────────────────────────

export type Medicine = {
  id: number;
  brand_name: string;
  type: "allopathic" | "herbal";
  slug: string;
  dosage_form: string | null;
  generic_name: string | null;
  strength: string | null;
  manufacturer_name: string | null;
  package_container: string | null;
  package_size: string | null;
  unit_price: number | null;
  stock_quantity: number;
  reorder_level: number;
  expiry_date: string | null;
  location_in_store: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LowStockMedicine = Pick<
  Medicine,
  | "id"
  | "brand_name"
  | "generic_name"
  | "dosage_form"
  | "strength"
  | "manufacturer_name"
  | "stock_quantity"
  | "reorder_level"
  | "unit_price"
>;

// ── Users / Auth ──────────────────────────────────────────────

export type UserRole = "admin" | "pharmacist" | "cashier";

export type AppUser = {
  id: string;
  clerk_user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ── Patients ──────────────────────────────────────────────────

export type Gender = "male" | "female" | "other";

export type Patient = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  address: string | null;
  blood_group: string | null;
  allergies: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// ── Prescriptions ─────────────────────────────────────────────

export type Prescription = {
  id: string;
  patient_id: string | null;
  prescribed_by: string;
  doctor_designation: string | null;
  hospital_clinic: string | null;
  prescription_date: string;
  notes: string | null;
  image_url: string | null;
  is_fulfilled: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  patient?: Patient;
};

export type PrescriptionItem = {
  id: string;
  prescription_id: string;
  medicine_id: number | null;
  medicine_name: string;
  dosage_instruction: string | null;
  quantity_prescribed: number | null;
  created_at: string;
  // Joined
  medicine?: Medicine;
};

// ── Suppliers ─────────────────────────────────────────────────

export type Supplier = {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  manufacturer_id: number | null;
  payment_terms: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ── Purchase Orders ───────────────────────────────────────────

export type PurchaseOrderStatus =
  | "pending"
  | "confirmed"
  | "delivered"
  | "cancelled";

export type PurchaseOrder = {
  id: string;
  supplier_id: string;
  order_date: string;
  expected_delivery: string | null;
  actual_delivery: string | null;
  status: PurchaseOrderStatus;
  total_amount: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  medicine_id: number | null;
  medicine_name: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
  expiry_date: string | null;
  created_at: string;
  // Joined
  medicine?: Medicine;
};

// ── Sales / POS ───────────────────────────────────────────────

export type PaymentMethod = "cash" | "card" | "mobile_banking" | "stripe";
export type PaymentStatus = "paid" | "pending" | "partial" | "refunded";

export type Sale = {
  id: string;
  invoice_number: string;
  patient_id: string | null;
  prescription_id: string | null;
  sale_date: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  stripe_payment_id: string | null;
  notes: string | null;
  served_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  patient?: Patient;
  items?: SaleItem[];
};

export type SaleItem = {
  id: string;
  sale_id: string;
  medicine_id: number | null;
  medicine_name: string;
  generic_name: string | null;
  dosage_form: string | null;
  strength: string | null;
  quantity: number;
  unit_price: number;
  discount_pct: number;
  total_price: number;
  created_at: string;
  // Joined
  medicine?: Medicine;
};

// ── POS Cart (client-side only) ───────────────────────────────

export type CartItem = {
  medicine: Medicine;
  quantity: number;
  unit_price: number;
  discount_pct: number;
  total_price: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
};

// ── Reports / Analytics ───────────────────────────────────────

export type DailySalesSummary = {
  sale_day: string;
  total_invoices: number;
  total_revenue: number;
  total_discounts: number;
  avg_invoice_value: number;
};

export type TopSellingMedicine = {
  medicine_id: number;
  medicine_name: string;
  generic_name: string;
  dosage_form: string;
  total_units_sold: number;
  total_revenue: number;
};

// ── API Response Helpers ──────────────────────────────────────

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
