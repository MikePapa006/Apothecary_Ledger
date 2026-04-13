# 🏥 Apothecary Ledger
### A Modern Pharmacy Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635bff?logo=stripe)](https://stripe.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**Apothecary Ledger** is a full-stack, open-source pharmacy management system built for modern pharmacies. It handles everything from medicine inventory and patient records to POS billing, supplier orders, prescription tracking, and analytics — all in one clean, fast web application.

> Built with Next.js 15, Supabase, Clerk Auth, Stripe, and deployed free on Vercel.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 💊 **Inventory Management** | Add, edit, and track medicines with stock level alerts |
| 🛒 **POS / Sales & Billing** | Point-of-sale cart system with invoice generation and Stripe payments |
| 👤 **Patient Records** | Manage patient profiles and full purchase history |
| 🏭 **Supplier & Purchase Orders** | Track suppliers, create purchase orders, manage deliveries |
| 📋 **Prescription Management** | Log and link prescriptions to patients and sales |
| 📊 **Reports & Analytics** | Sales charts, revenue trends, stock reports, CSV/PDF export |
| 🔐 **Role-Based Access** | Admin, Pharmacist, and Cashier roles with separate permissions |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router + TypeScript) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Authentication | [Clerk](https://clerk.com/) |
| Payments | [Stripe](https://stripe.com/) |
| Deployment | [Vercel](https://vercel.com/) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A [Supabase](https://supabase.com/) account (free)
- A [Clerk](https://clerk.com/) account (free)
- A [Stripe](https://stripe.com/) account (free test mode)

### 1. Clone the repository

```bash
git clone https://github.com/MikePapa006/Apothecary_Ledger.git
cd Apothecary_Ledger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local` (see [Environment Variables](#environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign in / Sign up pages
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── inventory/       # Medicine management
│   │   ├── sales/           # POS billing
│   │   ├── patients/        # Patient records
│   │   ├── suppliers/       # Supplier & purchase orders
│   │   ├── prescriptions/   # Prescription management
│   │   └── reports/         # Analytics & reports
│   └── api/                 # API routes (backend)
├── components/              # Reusable UI components
├── lib/                     # Supabase client, Stripe, utilities
└── types/                   # TypeScript type definitions
```

---

## 🗄️ Database Schema

The system uses PostgreSQL via Supabase with the following core tables:

- `medicines` — drug inventory with stock levels and pricing
- `suppliers` — supplier profiles and contact info
- `purchase_orders` — orders placed to suppliers
- `patients` — patient profiles
- `prescriptions` — prescription records linked to patients
- `sales` — sales transactions
- `sale_items` — line items for each sale

Full schema SQL is available in [`/supabase/schema.sql`](supabase/schema.sql).

---

## 🚢 Deployment

This app is deployed on **Vercel** with automatic deployments on every push to `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MikePapa006/Apothecary_Ledger)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**MikePapa006** — [GitHub](https://github.com/MikePapa006)

---

*Apothecary Ledger — Built with ❤️ for modern pharmacy management*
