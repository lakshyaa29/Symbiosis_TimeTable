# Deploy Symbiosis Timetable: Supabase + Vercel

This repository includes the website, Node serverless backend, database creation script, all 694 original timetable entries, live update subscriptions, PDF storage and password-protected shared writes. Follow the status update below before using the setup steps.

**Update, 24 November 2026:** Supabase project `tmbwyyhmgbjrchoayrmy` is now configured and verified. For that project, skip steps 1 and 2 and continue at step 3. See SUPABASE-SETUP-STATUS.md for the verification record. Steps 1 and 2 below are retained for creating another project.

## 1. Create a free Supabase project

1. Open https://supabase.com/dashboard and sign up/sign in.
2. Create an organisation on the **Free** plan.
3. Choose **New project**. Name it `symbiosis-timetable`.
4. Set a strong **database password** and save it privately. This is different from the website organizer password.
5. Select a nearby available region, such as Mumbai if offered. Create the project and wait for it to finish.

## 2. Create and populate the database

1. In the project, open **SQL Editor** and create a new query.
2. Open `supabase/01-setup.sql` in this folder (or GitHub), copy its entire contents into the editor and click **Run**.
3. Create another query. Copy the entire `supabase/02-seed.sql` file and click **Run**. Use the actual file contents, not a preview truncated by an editor.
4. In **Table Editor**, verify `portal_state` has one row with id `main`. Its `sessions` field contains the imported timetables; `activities` contains existing local activities included in this export.
5. Verify `portal_signal` has one row. It carries small live-update notifications.
6. Open **Storage**. Verify the public `timetables` bucket exists, with a 2 MB PDF size limit.

Both scripts are safe to rerun: setup recreates policies/triggers; seed never overwrites existing shared data. They enable Row Level Security and give browser clients read-only access. Writes and uploads go through the protected backend. Do not create an unrestricted public insert/update policy.

`portal_login_attempts` is private and rate-limits password attempts across serverless instances. The SQL script also enables Realtime for the small `portal_signal` table; no manual Realtime toggle is needed. If Realtime has been disabled for the whole project, enable it in project settings.

## 3. Find the three Supabase values

In project **Settings**, find the project URL and **API Keys** (dashboard names can vary).

- **Project URL**: looks like `https://abcdefgh.supabase.co`.
- **Publishable key**: starts with `sb_publishable_`; this may be exposed to the browser for read-only Realtime subscriptions.
- **Secret key**: starts with `sb_secret_`; reveal/copy it privately. This is backend-only and bypasses RLS.

Use the current publishable and secret keys, not the database password. Never paste the secret key into GitHub, frontend code, screenshots or chat.

## 4. Import the GitHub repository into Vercel

1. Open https://vercel.com/new and sign in with GitHub.
2. Grant access to `lakshyaa29/Symbiosis_TimeTable` if prompted.
3. Import that repository. Choose your personal Hobby account for a non-commercial student demo.
4. Framework Preset: **Other**. Root Directory: repository root (`./`), **not** `dist`.
5. Build Command: `npm run build`. Output Directory: `dist`. Node.js: **22.x**. Leave Install Command at its default; no third-party npm dependencies are required.
6. The checked-in `vercel.json` configures the API function and routes `/api/*` to it. Do not deploy only the `dist` folder or use a static-only hosting workflow.

## 5. Add environment variables before deploying

In the Vercel import form's **Environment Variables**, add:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Your `sb_publishable_...` key |
| `SUPABASE_SECRET_KEY` | Your private `sb_secret_...` key |
| `ACTIVITY_PASSWORD` | Your chosen organizer/admin password; enter the existing one privately if retaining it |
| `SESSION_SECRET` | A random secret of at least 32 characters |

Generate a session secret locally with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the result into Vercel only. Do not commit it. Set the variables for **Production** and, if needed, **Preview**. Production and preview share the same data if you use the same Supabase project; use a second free project for isolated previews if desired. Variable changes require a redeployment.

## 6. Deploy

Click **Deploy**. After the build completes, open the `.vercel.app` URL. Your laptop does not need to stay running.

The timetable toolbar should show **Shared timetable · connected**. If it says cloud setup is unavailable or remains disconnected, use the troubleshooting section below. On Vercel, the server never silently falls back to local JSON storage.

No custom domain, email provider, Supabase Auth user account or credit-card-based paid add-on is needed for the described student demo.

## 7. Verify with two independent browsers/devices

1. Open the deployed URL on a laptop and phone. Select the same program, semester, section and batch on both.
2. On the laptop, open Schedule manager and unlock administrator using the organizer password.
3. Upload a timetable or add a session. Check that it appears on the phone without refreshing.
4. Open a different program/semester on the phone: that program should keep its own schedule.
5. Publish an organized activity; it should appear on both activity boards.
6. Open an uploaded class detail and test **Open uploaded source PDF**.
7. Try a wrong password and try saving as a student. Neither should write to the database.
8. Reload/reopen the site. Shared schedules and activities should remain.
9. If two administrators edit simultaneously, a stale save must be rejected instead of overwriting newer data.

Realtime notifications normally trigger a refresh immediately. If a WebSocket is disconnected, schedules retry every 15 seconds and the activity page refreshes every 10 seconds. Returning to the tab or reconnecting also refreshes shared data. Offline reads may show the last cached timetable; offline edits are blocked.

## Upload behaviour and limits

- Uploads require administrator access. Choose program, semester and class before uploading. Enter batch on the reviewed CSV rows; blank means the whole class.
- PDF uploads are read locally, reviewed, then the original PDF is saved in Supabase Storage and the extracted sessions in the shared database. Students in that cohort do not need to upload it again.
- Shared PDFs must be below **2 MB**. Compress larger files. Uploaded PDFs are publicly readable, as are timetables; upload only class documents intended for students to view.
- CSV and JSON imports are supported. Unsupported or scanned PDF layouts need the provided CSV template/transcription. Arbitrary academic calendar PDFs are not automatically interpreted as structured timetables.
- Themes, subject colours and student preferences stay personal in each browser. Roll numbers are not sent to the shared database.
- Source uploads can remain as unlinked files if a subsequent schedule save fails; unused PDFs can be removed manually in Supabase Storage after checking they are not referenced.

## Local development with the same cloud backend

Requires Node 22+. Copy `.env.example` to `.env` and fill the five values privately. `npm start` automatically loads `.env`. The file is ignored by Git. Run `npm test` and `npm run build` before pushing changes. Use a separate Supabase project if local testing should not affect deployed users.

Without `.env` or Supabase variables, `npm start` keeps the previous browser-local schedules and local activity JSON mode. Run `npm run set-activity-password` to configure that mode. Cloud and local data do not merge automatically: seed/import is intentional.

## Troubleshooting

- **Database is not initialized:** run both SQL scripts, in order.
- **Database request failed:** check the URL and secret key; confirm the project is not paused and SQL setup completed.
- **Realtime is delayed:** check Realtime is enabled and `portal_signal` is in the `supabase_realtime` publication. Polling provides a fallback.
- **Incorrect administrator password:** check `ACTIVITY_PASSWORD` in Vercel and redeploy. The Supabase database password is not the organizer password.
- **Too many password attempts:** wait five minutes. Limits apply per hashed client address, so students sharing a network share the limit.
- **Shared PDF storage failed:** verify the `timetables` bucket exists and the file is a PDF below 2 MB.
- **API 404/HTML instead of JSON:** project root must be the repository root, framework Other, output dist, and vercel.json must be committed.
- **Newer timetable exists:** reload, review the newer version, then reapply the intended edit. This prevents lost updates.
- **Admin session expired:** unlock again. Sessions expire after four hours or on Student view/logout. Password changes alone do not invalidate existing cookies; rotate SESSION_SECRET to invalidate all sessions.

## Costs and validation status

Use Vercel Hobby only within its personal/non-commercial terms. Supabase Free has finite storage, bandwidth, concurrent connections and message quotas, and may pause after a week of inactivity. Review https://supabase.com/pricing and https://vercel.com/docs/plans/hobby before expanding to an official university service. Keep manual database backups; do not rely on the free plan for automatic backups.

The supplied code has local unit/integration tests using an emulated database transport, and a source/build check. Supabase project tmbwyyhmgbjrchoayrmy has now passed live database, permissions, REST and WebSocket signal checks. Vercel deployment and two-device website verification remain pending; see SUPABASE-SETUP-STATUS.md.

Official references: https://supabase.com/docs/guides/realtime/postgres-changes , https://supabase.com/docs/guides/database/postgres/row-level-security , https://supabase.com/docs/guides/getting-started/api-keys , https://vercel.com/docs/functions/quickstart .
