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


### iOS Google sign-in freeze mitigation, 23 Nov 2026

In the user's 26-second iPhone screen recording, the standalone Next/French app opens an accounts.google.com Firebase signInWithPopup auth sheet. Tapping the iOS saved Google passkey/password selection makes that sheet unresponsive and requires force-closing the app. This is evidence of a popup/WebKit authentication interaction; the precise underlying Apple/Google cause is not verified.

**Fix:** On iOS installed Home Screen/standalone PWAs, the French course no longer offers or attempts signInWithPopup or linkWithPopup. The French module checks iOS standalone mode and the Next entrypoint has the same guard, preserving the protected Firebase owner UID. Show the existing email/password form expanded by default; allow a Firebase password-reset email, and a copy-link control for opening the course in Safari. Browser Safari still offers Google OAuth, but its session may not carry into the standalone app. There is no Firebase data migration, worker update or sign-in scope expansion. A seamless App Monitor passkey-to-Firebase bridge remains a separate future security architecture.

Verification: Apps tests/french-ios-auth-browser.mjs tests this mode with iPhone UA and standalone browser emulation, including avoidance of the Google button, password reset and owner sign-in. Next tests/french-auth.test.mjs asserts the entrypoint's independent guard and the new PWA cache. Testing actual Apple password/passkey UI requires the user to retest the installed Next app after reopening it.


### Cross-device development without repeated passwords — 23 November 2026

The French course now checks an existing authorised Firebase parent session, then optionally restores a valid App Monitor passkey session from the same origin. A secure Cloudflare Worker route exchanges this verified passkey session for a short-lived custom Firebase token restricted to the existing kk-syllabus parent UID. Firebase's existing browser-local persistence and Learning Evidence sync then work normally, allowing your progress to reappear when you sign in on iPhone, iPad or Mac.

On a device without a usable Firebase/App Monitor session, choose **Continue with App Monitor passkey** once. This is a real, server-verified authentication, not a public development backdoor. The original Firebase email/password and Google in Safari remain as fallbacks. No new database, Firestore rule, account or learner path is created, and existing Next lessons are untouched.

If the bridge returns a 503 error, its Cloudflare signing service account is not yet configured for the kk-syllabus project; this should be resolved server-side without embedding credentials in GitHub Pages. All admin passkey sessions remain revocable through App Monitor. The Worker's deployment is independently gated by App Monitor's existing passkey, R2, credential and rollback tests.


**Release gate:** A fresh passkey ceremony is not launched when the Worker route has not yet been deployed. The course first checks the existence of its fixed endpoint using GET (which must return 405 without any private token), then starts the passkey authentication. While Cloudflare's Firebase service-account secret remains unavailable, the email/password and Safari Google alternatives still work. No unauthenticated development login is ever introduced.


### Magic 10 guided French lessons — November 2026

French v2 reuses the existing French course under /Next/french.html, not a new PWA or new Firebase account. It adds an original Magic 10 reference for eight carefully checked French verb+complement examples (present, completed past, near future, opinion, negation, ability, necessity, conditional wish), four guided lessons with repeated listening/translation, phonics cues embedded in phrases, dictation French-to-English and French transcription, scaffolded English-to-French construction, independent checks and genuinely novel sentences. Explanation tables remain optional in Word Explorer; common irregular verbs offer individually vetted past/future examples. It draws on public descriptions of Jessica Lund/Michaela's teaching and general Paul Noble repeat/build principles, without copying proprietary course content.

Progress uses the same existing kk-syllabus parent UID, adult/Sai scopes, immutable Learning Evidence records and automatic Firebase syncing, with separate source refs for original v1 lessons and new guided v2 teaching markers. First-attempt results are saved separately from later hints; rehearsed answers cannot become falsely independent. Review reminders after 1, 3 and 7 days do not count as retention unless an actual unaided response occurs. The existing alphabet, Sounds, knowledge organiser, sentence workshop, pronunciation, authentication and Word Explorer remain available.

Shared implementation and tests are documented in Apps/french-teaching/v1/README.md. The PWA version bump to next-learning-shared-v10 and asset URLs ending 20261123h ensure a Home Screen app refresh fetches the new shared code. Speech quality and passkey UX on real iOS devices still require on-device testing; automated Chrome tests cannot measure real learning gains.


### Audio-first French UX — 24 November 2026 (Next 2026.11.24.1)

The Next header uses its green/neutral palette, a tricolour flag, and a short upward English-to-French label transition (respecting reduced motion). The shared Apps French course automatically speaks visible teaching models, deliberate listening prompts, newly revealed French and oral repetition before advancing. Short recurring French classroom phrases surround some models. Choice answers provide in-row green ticks/red crosses and remain available to hear after completing the question; correct French-choice models are no longer duplicated. Workshop changes and typed model reveals also speak. No audio discloses hidden unaided assessment answers; first attempts are immutable, and replays after marking do not create evidence. Existing Firebase learner data, authentication, course IDs and old lessons remain untouched. PWA cache next-learning-shared-v11 refreshes the course. Physical iOS audio playback and real learning gains require user acceptance.


### French UX refinement (Next 2026.11.24.2)
French course header continuously alternates English and French, with readable holds, staggered upward rolling letters and a split-flap-style return. Reduced-motion users see a static French label. Shared course updates wait for speech completion before advancing, show English/French on a single responsive row, and replace generic starters with contextual, progressive hints that preserve draft text and track assistance. PWA cache v12. Device speech completion events still require physical iPad acceptance.


### Answer comparison and keyboard flow (Next 2026.11.24.3)
Incorrect written French submissions are retained verbatim next to the correct answer in a red feedback row; correct submissions are green and voluntary reveals neutral. The incorrect first attempt is recorded before the correction appears. After marking, Next receives focus and Enter advances only after speech has finished. New writing prompts focus the input. PWA cache v13.


### French exact input, word audio and voice settings (Next 2026.11.24.4)
French answer fields opt out of supported keyboard corrections and mark the exact input value. The visible words in guided models and corrections speak individually, as do Magic 10 words and existing word explorer links. French settings allow previewing and choosing a device-provided voice, saved locally. The 63 core lesson steps and all added corrections remain counted at completion; delayed reviews retain a separate count. Existing learning evidence is preserved. PWA cache v14.
