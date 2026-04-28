# PetCalm — Pet Anxiety Assessment & Paid Report

A Next.js + Supabase web app where pet owners take a 30-question anxiety
assessment, see a free profile result, and pay to unlock a personalised full
report with PDF export.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Supabase** for auth + Postgres + RLS
- **Stripe Checkout** for payment (with a local mock fallback)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

The file already contains the Supabase URL and anon key for the
`ymsenxnnxkkotsxyujmv` project. Add the **service role key** (only if you plan
to use the Stripe webhook) and your **Stripe secret + publishable + webhook
secret** for real payments. If you leave `STRIPE_SECRET_KEY` blank, the
`/api/checkout` route falls back to a **mock checkout** that marks the
assessment as paid immediately — useful for local testing.

### 3. Apply the database schema

Open the Supabase SQL editor for the `ymsenxnnxkkotsxyujmv` project and run
the contents of [`supabase/schema.sql`](supabase/schema.sql). It creates the
`assessments` table, indexes, an `updated_at` trigger, and RLS policies so
each user can only see their own data.

### 4. Run the app

```bash
npm run dev
```

Open <http://localhost:3000>.

## User flow

1. **Landing page** (`/`) — hero, how-it-works, FAQ.
2. **Sign up / log in** (`/signup`, `/login`) — Supabase email + password auth.
3. **Pet intake** (`/intake`) — collects pet attributes.
4. **Quiz** (`/quiz/[id]`) — 30 questions, one per screen on mobile.
5. **Free result** (`/results/[id]`) — profile type, radar chart, top
   insights, and a paywalled CTA.
6. **Checkout** (`/api/checkout`) — Stripe Checkout, or a local mock if no
   Stripe key is configured.
7. **Full report** (`/report/[id]`) — multi-page report with action plan,
   breed insights, recommended products, and PDF/print export.
8. **Dashboard** (`/dashboard`) — list of all of the user's pets and their
   status.

Without paying, the user can only see the free result page. After payment,
the full report unlocks plus the **Export / Print PDF** button.

## Switching from Stripe test → live

1. Replace `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and
   `STRIPE_WEBHOOK_SECRET` with live values.
2. Configure your live webhook to POST to `/api/stripe/webhook`.
3. No code changes required.

## Pricing & A/B test

`lib/pricing.ts` deterministically assigns each user to cohort A
(`PETCALM_PRICE_A_CENTS`, default $19.90) or cohort B (`PETCALM_PRICE_B_CENTS`,
default $9.90) using `PETCALM_AB_SPLIT` (default 0.5). The cohort and price
are stamped on the assessment when payment completes.

## Editing breed data

Breed entries live in [`lib/breeds.ts`](lib/breeds.ts) — simply edit the
arrays. Each entry has predisposition level, common dimensions, and the notes
shown in the report.

## Swapping affiliate links

All affiliate URLs live in
[`lib/report.ts`](lib/report.ts) under `recommendedProducts`. Replace the
placeholder `https://example.com/affiliate/...` URLs with your real affiliate
links.

## Notes

- PDF export is implemented via the browser's native print dialog using a
  print-friendly layout (`@media print` rules in `globals.css`). Choose
  "Save as PDF" in the print dialog. This avoids a server-side rendering
  dependency and works reliably on every platform.
- Phase-2 features (subscription progress reports, multi-pet reassessment
  comparison, admin dashboard) have data-model hooks (`paid_at`, `ab_cohort`,
  per-user listing) but are intentionally not built yet.
