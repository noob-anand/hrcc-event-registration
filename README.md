# HackerRank Campus Crew (HRCC) - Event Registration Platform

Official production-ready event registration platform built for **HackerRank Campus Crew (HRCC) - IIIT Bhopal**. Recreates the exact visual design language, dark technical aesthetic, bento glass cards, side system rail, and technical grid mesh of `HRCC.html`.

---

## Key Features

### 1. Student Public Portal (`/`)
- **Event Options**: 
  1. `VECTOR 2.0` (Algorithmic OA Warfare & Speed Coding)
  2. `AI/ML WORKSHOP` (Enterprise Model Engineering & Deployment)
  3. `BOTH` (Complete All-Access Node Pass)
- **Live Capacity Counter**: Real-time counter (`237 / 300 REGISTERED`), visual seat progress bar, remaining seat badge, and 3-day registration countdown.
- **Duplicate Prevention**: Scholar Number is treated as the primary unique student key. Real-time client & server validation prevents duplicate registrations (`REGISTRATION ALREADY EXISTS`).
- **Transactional Capacity Enforcement**: Server-side transactional check enforcing a maximum limit of **300 registrations**. Automatically disables registration when capacity is reached.
- **Official Pass & QR Code**: Generates a unique Registration ID (e.g. `HRCC-VEC-0247`) and dynamic check-in QR code containing verification payload for instant event scanning.

### 2. Admin Management Dashboard (`/admin`)
- **Protected Access**: Requires admin authorization (default password: `admin2026`).
- **Live Statistics Overview**: Analytics cards for Total, Vector 2.0, AI/ML Workshop, Both, and Capacity Gauge.
- **Registrations Table**: Search by Name, Scholar Number, Phone, Email, or Registration ID. Filter by Event Track, Branch, and Academic Year. Sort by timestamp or name.
- **CRUD Operations**: View full student pass, Edit student details, and Permanent Delete with confirmation dialog (`Are you sure you want to permanently delete this registration?`).
- **CSV Export**: One-click `EXPORT CSV` button downloading active database records.

---

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS, Glassmorphism, CSS Custom Tokens matching `HRCC.html`
- **Icons & QR**: `lucide-react`, `qrcode.react`, `canvas-confetti`
- **Database**: Supabase PostgreSQL + Stored Procedure (`schema.sql`)

---

## Local Setup & Development

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

ADMIN_PASSWORD=admin2026
ADMIN_SECRET=hrcc_iiitb_secret_key_2026
```

> **Note**: If Supabase keys are not set yet, the application automatically runs in fallback mode with realistic mock records, so you can test all features immediately!

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Database & Supabase Setup Instructions

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project named `hrcc-event-registration`.
3. Open the **SQL Editor** tab in Supabase.
4. Copy all SQL code from `schema.sql` in this repository and run it.
5. Get your Project API Keys from **Project Settings -> API**:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`

---

## Vercel Deployment Instructions

1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Add Environment Variables under **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
5. Click **Deploy**. Vercel will build and deploy the platform in under a minute.

---

## Admin Credentials

- **Admin Route**: `/admin`
- **Default Password**: `admin2026` (Configurable via `ADMIN_PASSWORD` env variable)
