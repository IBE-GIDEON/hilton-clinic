# Hilton Clinics — Port Harcourt Website

Next.js website for **Hilton Clinics** (2 Ejekwu Wike Street, Mile 4, off Ada-George Road, Rumuepirikom, Port Harcourt, Rivers State).

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is built

- `/` — Home: hero, Our Mission, all ten specialties, Find Us (map, hours, phone) and Questions & Answers.
- Ctrl/Cmd + K opens a "find care" search over the specialties.

## Under construction

These routes currently show an "Under Construction" placeholder and will be completed once the project is signed off:
`/about`, `/services`, `/services/[slug]`, `/patients`, `/contact`, `/book`, `/appointment`, `/admin`.

The original booking flow, booking manager, contact form, staff portal and their API routes are kept in git history
(commit `3b44fdd` and earlier) and can be restored from there when that work begins.

## Configuration

Clinic details, phone numbers, WhatsApp number and map coordinates live in `src/lib/site.ts`.
