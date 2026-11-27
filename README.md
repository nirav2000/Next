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


### Learning effectiveness dashboard (Next 2026.11.24.5)

The French course uses the shared Apps assessment engine. Today's lesson automatically prioritises due independent checks and error-specific repair, then guides new learning. Baseline and immediate, day 1, 3, 7+ and 28+ observations are kept separate; new combinations are held out from teaching, and unanswered or missed checks do not invent scores. The new dashboard displays actual practice accuracy, independent assessment accuracy, delayed retention, unseen transfer, coverage, response time and structure-level knowledge, plus an optional written-versus-audio exposure pilot. All results use the existing scoped evidence log and Firebase account. Oral retrieval is self-checked; automated marking of written French recognises selected variants, not every possible translation. No causal learning claims or automatic experiment promotion. PWA cache v15 includes all new shared modules. Real longitudinal learning outcomes and signed-in device acceptance remain to be established.


### French answer audit (Next 2026.11.24.6)
The French learning dashboard now has a private Answer history tab that records exact submitted answers, prompts, expected models, original marking decisions and reasons. The separate learner-scoped history synchronises through the existing Firebase account; no shared learning scores are changed. Earlier score-only entries cannot recover historical typed answers. Corrections for an unfinished independent check stay hidden until completion. PWA cache v16 includes the history module.


### French curriculum tracks (Next 2026.11.24.7)
The existing French course offers three selectable tracks: four original Michaela foundations, thirteen school-focused topics for Sai and six original Unlocking French-inspired units. The course preference is local per learner; Sai defaults to the school track, Adult retains foundations until another track is selected. Each new unit has guided practice, full recall checks and distinct application prompts before/after teaching and after 1, 3, 7 and 28 days, with tracked answer history and a track-specific dashboard. Familiar answers in new contexts are not automatically labelled unseen transfer. Existing learner data and evidence IDs are preserved. PWA cache v17 includes the curriculum files. The book is not reproduced. Exact-match alternatives are curated and real learner outcomes remain to be measured.


### Unified French word controls (Next 2026.11.25.1)
Tap a visible French word to pronounce it. Press and hold, or tap the selected word's Explore action, to open Word Explorer. Guided lessons, corrections and Magic 10 share the same interaction as the knowledge grid and workshop. Completed multiple-choice answers support word exploration and whole-answer replay. Unanswered independent checks remain free of dictionary prompts. The existing learner progress and history remain unchanged. PWA cache v18 refreshes the shared course assets.


### Incremental Unlocking French (Next 2026.11.25.2)
Twelve new original chapters build French one component at a time. They include the four earlier May school/sailing themes, an extended sailing unit and school-homework companion. The previous six units are available under Earlier Unlocking lessons & progress. New progress IDs are separate; no old evidence is deleted. PWA cache v19 includes the incremental builder. Oral self-checks are unscored, while independent written and delayed checks use the existing learning dashboard.


### French personal revision signals (Next 2026.11.25.3)
The French course now highlights word-aligned differences, fixes false negation comments, and schedules private word revision from spelling/word-form errors, deliberate word audio requests and relative typing hesitation. The Revision signals page shows signal counts, priority, history and next due practice. A short due-word dictation set can precede the next learning activity without interrupting an unfinished lesson. Word-level typing summaries are recorded only in answer fields; raw keystrokes are not saved. Existing assessment scores and learner scopes are unchanged. A confirmed URL-fragment import can add personal words without committing submissions to public source. PWA cache v20 includes the revision module.


### Continuous adaptive French teaching (Next 2026.11.25.4)
Today's guided lesson now interleaves learner-specific spelling, listening and contextual recall practice, using cumulative signals, recent activity, session and unit context. Positive independent recall reduces revision priority. Adaptive insertions preserve the original curriculum sequence and do not affect formal assessment scores or expose reserved assessment sentences. Plans, outcomes and revision history persist in the existing private learner-scoped answer audit. The Revision signals tab explains individual teaching decisions. Routine Firebase and retry-saving text is hidden; actual save failures remain visible. Cache v21 includes the new adaptive teaching module.


### Timed French practice (Next 2026.11.25.5)
The lesson completion screen requires a five-minute break before further practice in the selected course. The deadline survives refresh and is based on synced teaching evidence. The course flags overdue scheduled checks and word revisions, with optional permission-gated device alerts while running; closed-app background delivery is not installed. The five-minute minimum and overdue grace periods are initial teaching defaults. The PWA v22 cache includes study-timing.js and French reminders link back to the French course.


### Unified Today learning path (Next 2026.11.26.1)
A single Continue learning action recommends due independent checks before revision, targeted corrections, a bounded personal revision batch, guided teaching, the evidence-anchored rest, after-teaching recall and optional oral practice. A finished learning session offers an explicit next session. Explore contains manual chapters and reference tools; dashboard/history and settings remain separate. Existing evidence and authentication remain unchanged. Session preferences are scoped locally per learner and course. PWA cache v23 refreshes the shared interface.


### French overview restoration (Next 2026.11.26.2)
Retain the unified Today recommendation alongside the original course selection, revision, guided lesson library, reference resources, rapid oral practice and account sections. Restore direct menu access and the overdue practice action; manual practice works even with an overdue check, while the five-minute rest lock remains. Only learning effectiveness/mastery is moved off the overview and remains in the dashboard. Cache v24 refreshes the French interface.


### Learning profile chart and targeted repair feedback (Next 2026.11.26.3)
Revision signals now displays the actual private learner's priority bars, signal counts and next planned or due practice. Targeted Repair and Adaptive retrieval practice keep the submitted French and correct model visible for comparison on both successful and unsuccessful attempts. Word and sentence audio remain available. Formal check answers remain hidden until the check is complete. Existing sections and scoring are unchanged. Cache v25 refreshes the shared French module.


### Consistent French learning controls and timed breaks (Next 2026.11.26.4)
French lesson continuation uses explicit default-action attributes and focus restoration, with Enter fallback. Spoken models, reveals and corrections use semantic playback events and wait before advancing. Pause is separated on the right. The five-minute learner-wide French rest deadline is derived from recorded teaching completion, survives reload, shows the analogue countdown, and is enforced across chapter and course navigation. Existing learner records and assessment rules are unchanged. Cache v26 refreshes the shared module.


### Animated audio wait and analogue break card (Next 2026.11.26.5)
Continuation leaves the current question visible and displays a disabled Waiting for audio to finish… control with sequentially pulsing dots until speech and reinforcement end. The existing five-minute evidence-anchored break is displayed with the approved dark card, teal clock ring and hand, digital time and full-width locked button. Cache v27 refreshes the shared French module. Existing learning records and timing rules are preserved.

### French marking and precise feedback — 26 November 2026

Shared written-answer comparison now accepts harmless capitalisation, spacing, quotation and punctuation variations without ignoring French accents, apostrophes, word order, grammar or number punctuation. Personal revision uses the same marker as guided and assessment tasks. Incorrect feedback highlights the differing letters or words and explains the comparison; correct formatting variants remain correct. Revision controls say word, phrase or sentence as appropriate. Earlier false-negative manual revision events caused solely by formatting are reinterpreted for scheduling, without rewriting their immutable answer history or original assessment scores. PWA cache v28 and French asset version 20261126f refresh the shared modules. Existing audio, learning sequence, accounts and stored data are preserved. Live signed-in device acceptance remains separate from source tests.

### Graduated French listening assistance — 26 November 2026

Personal revision and guided listening/dictation now offer normal replay, slower French, audio chunks, context (where available), masked written word lengths, spoken English, written English, and final model reveal in progressive order. English audio uses an exact known bilingual pair rather than an invented translation; unrecognised items skip unavailable English hints. Drafts survive hint activation. Feedback offers chunk replay and complete French playback; personal revision additionally offers a supported rebuild while preserving the first attempt and schedule. Audits distinguish meaning recognition, dictation, assistance and rebuild. Assisted dictation does not advance the unaided review ladder; formal independent assessments remain unchanged. PWA cache v29 and asset version 20261126g. Device-specific speech and full live acceptance remain to be tested.

### Evidence-based French revision and word patterns — 26 November 2026

Personal revision is now derived from completed teaching models or independently demonstrated correct French in the selected learner/course. Baseline errors, unseeded historical revision attempts and cross-course signals cannot create a revision target. The signed-in revision screen shows why a target was selected and a private lookup of recorded teaching, correct independent answers and diagnostic/revision attempts. Historical evidence remains intact. Unlocking French introduces curated English–French word-family patterns alongside relevant new models, with additional examples and optional self-checks; established step IDs and formal assessments are unchanged. PWA cache v30 and asset version 20261126h.

### Recurring language patterns and grammar — 26 November 2026

Unlocking French now distinguishes English -ing cognates from -ant/-ent cognates and teaches gender agreement and adjective position with contrasting examples, highlighted endings and audio. A searchable Patterns & grammar reference includes guided recap, supported questions, and independent rule retrieval due after 10 minutes, then 1, 3, 7 and 28 days following successful due recall, continuing monthly. Existing completed models establish eligibility; a new guided recap must be completed before independent rule recall counts. Pattern records sync through the existing private answer-history store and remain separate from formal translation assessments. Today prioritises formal independent checks and learning breaks before pattern practice. Guided oral transitions no longer replay the old expression when advancing in Unlocking French. Existing lesson step IDs and assessment content are unchanged. PWA cache v31 and asset version 20261126i.

### Meaning-first Unlocking French — 26 November 2026

Twelve revised pattern groups and 73 translation questions clearly label English and French, distinguish direct translation from deliberate French word-building, and put technical grammar in optional explanations. The -ation/-é pattern explicitly preserves noun meaning before teaching a new action word; e.g. decoration/décoration versus decorated/décoré. French accents and changed endings are highlighted separately. A fresh guided recap of pattern content version 2 precedes spaced recall, without deleting history or resetting core lesson progress. All 1,135 existing core step IDs and French assessment targets are preserved; learner-facing descriptions use simpler language. PWA cache v32, asset version 20261126j.

### Simpler Unlocking French — 26 November 2026

Restored the spoken, one-building-block-at-a-time approach. Continue learning no longer routes automatically to separate grammar lessons. Grammar is a collapsed contextual disclosure, with a single short example and optional further details. The searchable reference library uses collapsed rows; optional spaced practice shows one phrase at a time and introduces unfamiliar bilingual examples before recall. All 1,135 core teaching steps and assessment banks remain unchanged. PWA cache v33 and asset version 20261126k.

### Clear review timing and session completion — 26 November 2026

Today identifies the next formal review by chapter, recall stage, purpose and availability time. Completed settling breaks and completed activities have ticks; skipped and partially completed practice is distinguished from completed practice. Older ambiguous session flags are not treated as proof of completion. Formal review intervals, saved progress and assessment banks are unchanged. PWA cache v34; French asset version 20261126l.

### Learning roadmap — 27 November 2026

Added Learning roadmap: My journey, Compare courses, Detailed curriculum and Course analysis. Expand each chapter and numbered teaching step; compare actual tracks and remaining core steps; adjust minutes/day and seconds/step for illustrative forecasts. Adult priorities now focus on conversations with parents and children around sailing weekends, changing and rigging, meals, timings and social plans. There are 57 reference targets in seven proposed situation groups plus short two-way exchanges. Exact curriculum coverage is tracked separately from proposed additions. No core lessons, progress or assessment banks were changed. Precache includes roadmap.js, cache v35, French asset version 20261127a. Direct route: french.html#roadmap.
