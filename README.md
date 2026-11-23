# Next Learning

Next turns a lesson or task from ChatGPT into a calm, structured learning experience rather than a long chat to scroll through.

## v1
- Rich lesson pages with sanitised HTML.
- Due dates, iCalendar export and browser/in-app reminders.
- Spaced repetition (Again / Hard / Good / Easy).
- Dashboard for due work, completion, reviews and learning time.
- "Ask ChatGPT for the next lesson" prompt generated from actual progress.
- JSON lesson import/export.
- Annotation/review notes.
- Optional owner-only sync through the existing `kk-syllabus` Firebase project.
- Shared Apps identity, App Monitor and Firebase Usage Monitor.
- PWA support and Version Lab.

The app is local-first. Cloud sync uses `families/{OWNER_UID}/learners/sai/progress/next-learning`, which is already covered by the owner-only Kk-syllabus Firestore rules.

Cloudflare/R2 is already used by the shared monitoring stack. Learning content is not copied to R2 in v1 because Firestore is the appropriate structured cross-device store; media/R2 can be added when lesson attachments require it.

## Direct publishing from ChatGPT

Published lessons are source-controlled under `lessons/`. When ChatGPT has authorised GitHub access, it can publish a lesson directly to `main`; Next checks the catalog and imports it automatically while preserving learner progress. See `PUBLISHING.md`.

The initial French lesson is published at `lessons/french-quitter-20260926.json`.

Version: 2026.09.25.2

## French course (independent learner evidence, 23 November 2026)

Open [French inside Next](https://nirav2000.github.io/Next/french.html) or use the Next header link. The course imports the new versioned shared `Apps/french-teaching/v1` module: 26 French letter names, bilingual high-frequency knowledge grid, explicit CUDDLES cues, connectives, controlled translations, novel transfer, repeated retrieval and optional reused Apps pronunciation coaching.

**Important:** Next legacy lessons still belong to Sai and are stored at `families/{OWNER_UID}/learners/sai/progress/next-learning`. French evidence is separate: `families/{OWNER_UID}/learners/{adult|sai}/progress/evidence-next-french-v1-{eventId}`, using the existing owner-only Firestore rules. The active Firebase account must match `OWNER_UID`; never auto-migrate local legacy state. Each evidence event is immutable; cloud sync merges server records into the locally scoped Shared Learning Evidence store, using create-only transactions and a visible sync status. Audio is not saved to the cloud by default. External pronunciation reference generation remains optional. For method documentation and integration tests see `Apps/french-teaching/v1/README.md`.

Cloud saving requires signing into the existing family Firebase account; verify a live signed-in iPhone/iPad round-trip before claiming cross-device production acceptance. Existing Next Firebase sync, login, notes, lessons, review and PWA are deliberately unchanged apart from a header link and additive offline precache.

### French sentence workshop release

A dedicated Sentence workshop tab builds 80 controlled combinations from reusable connectives: reasons, contrasts, consequences, conditions and sequences. A separate unseen task bank measures transfer. Visible model assistance is recorded as a worked-example support level, not independence. The Shared French browser smoke CI covers mobile-width alphabet, grid, workshop, score and adult/Sai isolation; actual iOS/real Firebase acceptance remains a manual check.
