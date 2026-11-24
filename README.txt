SYMBIOSIS COLLEGE TIMETABLE PORTAL
Symbiosis Skills and Professional University, Kiwale, Pune

RUN LOCALLY
Double-click Start-localhost.cmd, then open http://localhost:4173.
Or run npm start in this folder. Keep the terminal open.
Node.js is required. No dependency installation or API key is needed.
Timetable-only alternative: python -m http.server 4173 --directory dist --bind 127.0.0.1
The standalone Symbiosis-Timetable.html includes the logo, data and source PDF. Organised activities require the Node.js localhost server.

YOUR IMPORTED DATA
694 schedule entries from all 20 pages of All_Timetables_Updated (2).pdf.
The catalog contains 32 named degree/program options plus diploma and
certificate categories: 20 have an uploaded timetable; 14 await schedules.
The work-integrated Automobile option is listed separately.
No old sample timetables, sample rooms, invented faculty or sample events
are mixed into the imported dataset.

KEY VIEWS
Programs: browse by study level; open a program's timetable.
My timetable: program, semester, section, practical batch, faculty and day.
Week/List: exact Monday-Saturday schedule, including source breaks.
Classrooms: actual room references; capacity is not provided in the PDF.
Faculty: individual teaching schedules; unresolved source codes are labelled.
Campus activities: independently organised fun, cultural, sports, club and other events. No timetable sessions appear here.
Schedule manager: add/edit/delete sessions and review potential overlaps.
Click any session to see its original source cell and a PDF page link.

IMPORTANT SOURCE DETAILS
Retail & E-Commerce is specifically dated 2-7 November 2026; it does not
repeat each week. Use Source week to view it, including Diwali Holiday.
Logistics teaching runs on 2nd and 4th Saturdays only. Reserved IDSC dates
10 August, 11 August and 15 September suppress the ordinary schedule.
MBA Digital Marketing runs in the evening until 20:30, with a 17:00 break.
AIML D1/D2, Cyber Security A1/A2, Defence A1/A2 and Mechatronics SA1/SA2
batch allocations are preserved. Whole-class sessions appear for every batch.
The default AIML view selects D1; change Practical batch to D2 or All batches.
Nutrition PDF page 4 says B.Sc Nutrition & Dietetics, mapped under BND.
Page 6 says M.Sc under Nutrition & Dietetics, mapped under MND. These source
labels remain visible; exact degree equivalence requires university confirmation.
Unknown names, codes, TBA faculty and alternative rooms remain unassigned
or explicitly labelled. No room capacities or missing faculty names were invented.
Some sources contain elective alternatives; consult Original timetable cell.

OVERLAPS
60 potential cross-program overlaps are detected in the supplied schedules.
These may include genuine shared classes. They have not been auto-corrected.
Unknown faculty and alternative rooms are excluded from confirmed resource checks.
Different practical batches can run in parallel. Whole-class overlaps are checked.
New additions and edits that clash are blocked. JSON backups preserve original
source overlaps and flag them for review, so an unchanged backup can be restored.

LOCAL STORAGE
Edits are stored in this browser under a versioned SSPU data key.
The old sample-data key remains untouched as a legacy backup.
Use Backup JSON before moving to another computer or browser.
Import JSON replaces the current local schedule after field validation.
This is a local application; other devices do not automatically share its data.
Schedule manager has an explicit Enable demo admin button. This is not secure
authentication and should be replaced before a multi-user production launch.

COMPETITION WALKTHROUGH
1. Open Programs to show the full catalog and uploaded/pending status.
2. Open AIML, switch D1/D2 and show a merged 09:30-11:30 laboratory session.
3. Open the details and the source PDF at page 14.
4. Show the dated Retail week and the evening MBA timetable.
5. Open Schedule manager to review the potential overlaps.
6. In Schedule manager, enable demo admin and attempt Monday 09:45-10:15, AIML section D,
   room E-101 with Dr. Chhaya Nayak. The existing session blocks the save.
7. Print timetable for a clean landscape layout.

SOURCE FILES
dist/timetable-data.js  Imported catalog, source entries, rooms and breaks
dist/core.js            Date rules, validation and overlap detection
dist/app.js             UI, filters, editing and browser storage
dist/styles.css         Red/white responsive university theme and printing
dist/index.html         Page structure and dialogs
dist/assets/            Official university logo and uploaded source PDF
test/core.test.cjs      22 scheduling/data regression checks
test/activities.test.cjs 11 activity publishing and password checks
server.cjs              Local static server, bound to this computer only

TEST
npm test (45 tests across timetable data, student profiles and organised activities)

Logo: https://sspu.ac.in/public/frontend/assets/images/header_logo.svg
Original logo remains the property of its respective owner.

ORGANISED ACTIVITY BOARD
Activities is a separate community event board, not a timetable view.
Click Organise an activity. Choose a type, fill in the details, then review.
The organiser password is required only for the final Publish activity step.
Published events are public to every visitor using this same server.
Other open activity boards refresh automatically within about 10 seconds.
The initial board is empty until an organiser publishes an event.
Events are saved in data/activities.json on this computer and survive restarts.
The organiser password is stored as a salted hash in .local/organizer.json,
which is outside the public dist directory. No password is sent to readers.
This computer is configured with the password you selected in chat.
To set or change it on another computer, run npm run set-activity-password.
The prompt hides input. No server restart is needed after changing the file.
ACTIVITY_PASSWORD is also supported as a server environment variable.
The source ZIP excludes the local password configuration and live event data.
The local server is bound to this computer; separate machines' localhost
addresses are separate servers. Network hosting can be configured separately.
STUDENT SETUP AND PERSONAL TIMETABLES
A first visit asks for department/program, roll number/PRN, semester, section
and practical batch. The student confirms the class before saving.
The profile is saved only in this browser under sspu-student-profile-v1.
It is a personal timetable preference, not authentication or a student registry.
Later visits restore the student's class and batch automatically.
Profile buttons and Change my details reopen setup for editing.
My timetable always returns to the saved class after exploring other programs.

AUTOMATIC PRN RANGES FROM THE SUPPLIED PDF
AIML, semester 1, section D (PDF p.14):
  D1: 2601132003 through 2601132077
  D2: 2601132078 through 2601132156
Cyber Security, semester 1, section A (PDF p.15):
  A1: 2601106003 through 2601106088
  A2: 2601106090 through 2601106155
The missing PRN 2601106089 is not assigned automatically.
No batch is guessed from a short roll number or a different program's ranges.
Other practical splits, including Mechatronics SA1/SA2 and Defence A1/A2,
are chosen manually because no PRN ranges are printed for them in the PDF.
Known practical splits require one specific batch, not All batches.
The personal timetable includes shared classes and only the chosen batch labs.
Unlisted semesters and sections can be saved; they show a clear missing
schedule message instead of displaying another class's timetable.

STUDENT PROFILE FILES
  dist/student-profile.js: placement rules, validation and cohort matching
  test/student-profile.test.cjs: 12 profile and assignment regression checks
Update BATCH_RULES only when a new source establishes additional PRN ranges.

OFFICIAL FACULTY DIRECTORY (checked 24 November 2026)
118 faculty profiles were collected from the 15 official SSPU school faculty
pages, linked from https://sspu.ac.in/ . Each record retains its exact profile
URL, school source URL, published name, designation and locally saved photo.
The app can filter all faculty, people with uploaded timetable entries, or
allocations that need confirmation. Search includes original PDF codes.

62 official profiles link to uploaded timetable allocations. Eight links use
initials or short first names and are explicitly marked Assignment inferred:
RDS, ANS, GL, VH, SSR, Dr. Diksha, Dr. Monica and Dr. Shubhamitra.
SSR is only a possible match because the website does not expand the middle S.
The directory keeps original labels and source-page links visible. It does not
rewrite the PDF dataset or use inferred identities for conflict detection.
Unmatched source names remain visible. NF1/2/3, AGT, SD, SJ1 and similar
ambiguous allocations are not silently attributed to an individual teacher.
Website school membership alone does not imply any teaching assignment.

dist/faculty-data.js: official roster, local photos, source links and aliases
dist/faculty-directory.js: source-preserving matching and program scoping
test/faculty-directory.test.cjs: 6 reconciliation regression checks
Run npm test for all 51 checks, including the activity API and student setup.
Standalone HTML embeds all faculty photos; official profile links need internet.

ADMINISTRATOR PASSWORD
Administrator mode requires the same configured organizer password as activities.
The server verifies it at POST /api/admin/unlock using the existing salted hash.
Wrong passwords are rejected and rate limited. Refresh or Student view locks editing.
The password is never embedded in public JavaScript or standalone HTML.
Timetable edits remain browser-local. Standalone HTML requires localhost for admin access.
All 52 regression checks pass, including administrator password verification.

STUDENT TIMETABLE TOOLS
Timetable toolbar: live countdown, Crimson/Midnight/Pastel/Neon themes, per-subject colour picker and timetable upload.
Missing-class empty states include an upload button. Upload requires administrator access.
CSV headers: day,start,end,subject,faculty,room,type,batch. JSON sessions arrays are supported.
Text-based PDF weekday-column grids are extracted locally with bundled Mozilla PDF.js 4.10.38 (Apache 2.0). Review combined cell text and correct subject/faculty/room/batch/time columns before adding. Scanned PDFs and unsupported grids need CSV transcription; a template is provided.
Uploads append validated entries, skip duplicates and save in this browser. Existing entries remain. Review possible overlaps in Schedule manager. Cloud sharing is not implemented.
PDF extraction requires localhost, not standalone file mode. 54 regression tests pass. New UI has not been browser-verified in this update.
