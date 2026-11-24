# Supabase setup completed

Verified on 24 November 2026 for project **symbiosis-timetable** (`tmbwyyhmgbjrchoayrmy`).

API URL: `https://tmbwyyhmgbjrchoayrmy.supabase.co`

## Completed and verified

- Healthy existing project; no paid projects or branches created.
- Shared database initialized with **694 timetable sessions**, **20 programs**, and **1 existing activity**.
- `portal_state` stores schedules and activities; the `main` row is initialized.
- `portal_signal` carries compact live-update notifications.
- `portal_login_attempts` is inaccessible to public clients and implements password-attempt limits.
- Row Level Security enabled on all three tables. Public users can read schedules but cannot write them or invoke the private login-limiter function.
- `timetables` Storage bucket created for public student PDFs, PDF-only, maximum 2 MB. No public upload policy granted; uploads require the server's secret key plus the website administrator session.
- Realtime publication includes `portal_signal`.
- Live WebSocket subscription from the bundled Supabase client succeeded and received an actual revision-change event.
- Live public REST read returned HTTP 200; public mutation and access to private login records were rejected with HTTP 401.
- Login limiter tested as `service_role` inside a rolled-back transaction.
- Supabase security and performance advisors reported no findings after setup.

The data was imported without overwriting any pre-existing portal row. Setup was recorded in hosted migration history. The notification-only live test advanced revision metadata without changing timetable sessions or activities.

## Still required for the live website

Supabase's database is ready. Vercel environment variables and deployment are still required. This is not yet a verified live website deployment.

1. Import `lakshyaa29/Symbiosis_TimeTable` at https://vercel.com/new .
2. Use framework Other, repository root, build command `npm run build`, output `dist`, Node 22.x.
3. Set the five values described in DEPLOYMENT.md. The project URL and publishable key are supplied in VERCEL-ENVIRONMENT.txt; the secret key must be copied privately from your Supabase dashboard into Vercel.
4. Set your existing organizer password privately as `ACTIVITY_PASSWORD` and generate a random `SESSION_SECRET`.
5. Deploy and run the two-device checks in DEPLOYMENT.md.

You do **not** need to run the SQL setup/import again for this project. Secret keys have not been retrieved, printed, or committed to GitHub. Personal roll numbers, appearance settings and saved browser profiles were not uploaded.
