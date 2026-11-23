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


### French login integration, 23 November 2026

French now reuses the existing owner-verified Firebase Auth UID from **either** the default kk-syllabus app (used by other learning apps) **or** Next's previous named Firebase app, with no Firestore migration or App Monitor Worker changes. The same protected owner UID remains required for cloud sync. When there is no recognised owner session, the course offers a Google sign-in button plus the existing Firebase email/password fallback. Google sign-in must return the existing owner UID; otherwise the browser signs out and does not access family learning records.

For a pre-existing Firebase email/password owner, sign in with that account first and select "Link Google to this account". Provider linking must preserve the original UID; do not create a separate new owner or merge records. Google OAuth must be enabled in the kk-syllabus Firebase Auth providers (and the GitHub Pages domain authorised). A real signed-in Safari test is required. The App Monitor passkey is currently not an equivalent Firebase login for this course; implementation of a secure scoped bridge requires a separate backend deployment and security review.

See Apps/french-teaching/v1/README.md for details of the new shared course UI and browser auth tests. Apps/auth/v1/README.md remains the migration reference for a future unified identity broker; we have NOT migrated the UID, shared Worker or existing Next login.


### French alphabet phonics and optional word exploration — 23 November 2026

The Next French course now also imports the additive shared Apps/french-teaching/v1/phonics.js and lexicon.js. Tapping any alphabet letter immediately plays its French name and updates the card. Learners may group the 26 letter names into sound-similar families, explore sound groups and spelling correspondences (u/ou, é/è, nasal vowels, oi/eau, consonants, liaison), hear paired words and full sentences, and take an 8-item optional listening-recognition check. Results are saved as isolated French phonics evidence through the existing Firebase transport; no old progress or Firestore document path changes.

Underlined French words in the bilingual knowledge grid and sentence workshop are optional tap-to-explore entries. Tapping *veux* reveals *vouloir*, its meaning, irregular conjugations, stem note and examples; regular verbs show their -er endings; past participles, future frames, connectives and common grammar examples are curated. It is **not a comprehensive French dictionary** and does not automatically infer a verb's conjugation from an arbitrary word. The grammar drawer is optional for beginners and can be closed to continue the lesson. CUDDLES now displays annotated spelling examples, distinguishing silent endings, double consonants, accents and liaison.

The course's shared modules are deployed and tested in Apps before Next's cache-bumped PWA link is released. Real French speech synthesis can differ between devices; a physical iOS test is required before claiming identical pronunciation. See Apps/french-teaching/v1/README.md for complete scope and evidence acceptance.


### French Word Explorer online dictionary — November 2026

The Next French course optionally enriches the existing curated word explorer with dictionary entries from Wiktionary via the free read-only Wiktapi JSON API (https://wiktapi.dev/quickstart). Any new ordinary French word in a passage can be tapped; when no existing teacher-authored explanation exists, an online search runs automatically. Existing notes and the verb conjugation table always appear first and remain usable offline. A button under "More from the free dictionary" loads optional English definitions, IPA and limited forms. The app includes explicit attribution and direct Wiktionary links. Dictionary content is escaped and cached for three days locally; it does not alter Firebase learning evidence, logins or learner identity, and only the requested French word (or infinitive) is sent externally. If offline or service access fails, a direct link is still shown. It uses the new Apps/french-teaching/v1/dictionary.js module; no new API key or Cloudflare Worker is necessary. Real-world CORS and iOS compatibility need a live signed-in device check.
