# Live website

**https://symbiosis-timetable.vercel.app**

Deployed and verified on 24 November 2026.

- Vercel project: `lakshyaa29s-projects/symbiosis-timetable` (Hobby).
- GitHub: https://github.com/lakshyaa29/Symbiosis_TimeTable , production branch `main`.
- Supabase: `tmbwyyhmgbjrchoayrmy`.
- Project dashboard: https://vercel.com/lakshyaa29s-projects/symbiosis-timetable .
- All five environment variables are configured in Vercel for Production and Preview. Secret values are not stored here or in Git.

## Live verification passed

- Anonymous website, API and PDF.js assets return HTTP 200.
- Shared mode is enabled; all 694 database sessions exactly match the original dataset, and the existing activity is available.
- Wrong passwords and unauthenticated schedule changes are rejected.
- Existing organizer password unlocks the server and issues a Secure, HttpOnly administrator cookie.
- An authenticated save of the unchanged schedules persisted and triggered a Supabase notification in a separate client.
- A stale save was rejected with HTTP 409, preserving newer data.
- The original timetable PDF was backed up through the production upload API and downloaded with an identical SHA-256 checksum.
- Invalid activities were rejected; no test activities were published.
- Logout clears the browser session cookie.

These checks cover the deployed API, database, authorization, live subscription and storage. A visual browser walkthrough of onboarding, the upload review dialog, themes and countdown is still recommended; it was not available through browser-control tools during this deployment.

## Daily use

Use the live URL for shared data. Students select their own program, semester, section and batch. An administrator uploads/reviews a timetable once; that cohort sees it automatically. Activities are shared across the activity board. Original PDF uploads must be under 2 MB, and scanned/unsupported layouts need CSV transcription.

Localhost remains local-only unless configured privately with cloud credentials. Do not expect changes made in local-only mode to appear on the live site. Personal roll numbers, theme choices and colours remain in the browser.

Future GitHub pushes to `main` automatically deploy to Vercel. Review changes before pushing: local testing with the production Supabase project affects real students. Keep database exports/backups and monitor free-tier usage. Neither a paid plan nor a custom domain was purchased.
