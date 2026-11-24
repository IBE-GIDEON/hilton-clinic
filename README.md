# Hilton Clinics — Port Harcourt Website

Full-stack Next.js website for **Hilton Clinics** (2 Ejekwu Wike Street, Mile 4, off Ada-George Road, Rumuepirikom, Port Harcourt, Rivers State).

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key pages

- `/` — Home (hero search & quick booking, interactive specialties showcase, leadership & approach, flagship renal/dialysis centre, patient visit journey, live Ada-George Google Map & Port Harcourt clock, patient FAQs)
- `/services` & `/services/[slug]` — Full filterable department directory and individual clinical guides
- `/book` — Multi-step appointment booking with live time-slot availability, reference code receipt, and pre-filled WhatsApp confirmation
- `/appointment` — Patient self-service booking lookup, rescheduling, and cancellation
- `/contact` — Live Google Map, Ada-George / Wimpey road directions, 24-hour emergency numbers, WhatsApp front desk, and callback form
- `/about` — Story, medical leadership (Prof. Okafor Umezurike Hughes), and facility gallery
- `/patients` — Practical preparation notes, clinic hours, and emergency instructions
- `/admin` — Staff Front-Desk Portal for confirming/updating bookings and replying to callback enquiries

## Configuration

- **Clinic details, phones, WhatsApp number, and map coordinates:** edit `src/lib/site.ts`.
- **Staff Portal (`/admin`) passcode:** defaults to `hilton2026` locally. Set `ADMIN_PASSCODE` and `SESSION_SECRET` in `.env.local` for production.
- **Local database:** appointments and enquiries are saved atomically to `data/clinic-db.json` (created automatically on first submission).
