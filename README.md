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

Version: 2026.09.25.1
