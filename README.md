# Symbiosis Timetable Portal

Student timetable and organized activities portal for Symbiosis Skills and Professional University, Kiwale, Pune.

**Deploy it:** follow [DEPLOYMENT.md](DEPLOYMENT.md). It includes database creation, importing all existing schedules, Vercel settings and a two-device verification checklist.

## Features

- 694 imported timetable entries, cohort/batch filters, weekly/list and print views.
- Student first-visit setup, live next-class countdown, four themes and personal subject colours.
- Administrator timetable upload: text-PDF grid extraction with review, CSV and JSON; source PDF storage.
- Shared schedules and activities using Supabase PostgreSQL, Realtime notifications and reconnect/polling fallback.
- Server-side organizer password checks, signed HttpOnly administrator cookies and database-backed login attempt limits.
- Cohort-aware shared uploads and optimistic version checks to prevent lost updates.
- 118 official faculty profiles, local photos and source-linked matching notes.

## Run locally

Use Node.js 22+. No npm package installation is needed.

```sh
npm start
npm test
npm run build
```

Open http://localhost:4173 . For local-only mode, first run `npm run set-activity-password`. For shared cloud development, privately copy `.env.example` to `.env` and fill the five values from DEPLOYMENT.md.

Without cloud credentials, schedules stay browser-local and activities use local JSON files. On Vercel, missing cloud credentials fail closed instead of falling back to a nonpersistent filesystem.

## Layout

- `dist/`: frontend and bundled PDF.js/Supabase browser clients with their licenses.
- `api/index.js`: Vercel serverless entry point.
- `lib/cloud.cjs`: shared database API and authorization.
- `lib/activities.cjs`: local activities and reusable validation.
- `supabase/01-setup.sql`: tables, permissions, update notifications, PDF storage and password attempt limiting.
- `supabase/02-seed.sql`: original 694 timetable entries and existing local activities; safe to rerun.
- `test/`: regression and cloud API tests.
- `docs/`: source research, data export and previous screenshots where included.

Uploaded timetables, activities and PDFs are shared. Student roll numbers/preferences, themes and custom colours remain in the browser. Public source PDFs must be intended for student access. Shared PDF uploads are limited to 2 MB; unsupported/scanned layouts need CSV transcription.

Passwords, `.env`, `.local`, local runtime data and hosting credentials are ignored by Git. Never put a Supabase secret key in frontend code or a public repository.

Local integration tests emulate database responses; real database migration and live cross-device verification must be completed after connecting the accounts. See README.txt for historical import details; DEPLOYMENT.md takes precedence for cloud operation.
