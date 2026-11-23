# Next Learning publishing protocol

This repository uses **main as the release branch**. Finished work should be written to `main` directly; do not leave the user with a feature branch or pull request to merge.

## Lesson publishing

Reusable lessons live in `lessons/<lesson-id>.json`. The browser reads `lessons/catalog.json` and merges published lessons into local/cloud learning state by stable lesson ID.

This gives ChatGPT/GitHub a simple delivery path:

1. Build the lesson from the current teaching conversation.
2. Give it a stable ID and expected date.
3. Add/update its JSON file.
4. Add/update its entry in `lessons/catalog.json`.
5. Push the release directly to `main`.
6. Next automatically discovers it on refresh/launch. No JSON copy/paste is required.

Progress is **not** stored in lesson files. Completion, reviews, notes and learning history remain learner state in the app/Firebase, so updating lesson content does not erase Sai's work.

## Lesson quality

A published lesson should contain:
- a clear conceptual objective;
- prerequisites where useful;
- explanation from first principles;
- active reconstruction rather than passive reading;
- transfer/change-one-thing exercises;
- 5–12 retrieval cards;
- an expected date and sensible estimated duration.

## Future direct API

The catalog is intentionally provider-neutral. A future authenticated endpoint can write the same lesson schema to Firestore/R2 without changing the learning UI. Repository publishing is the first direct channel because ChatGPT already has authorised GitHub access and it keeps an auditable source-of-truth history.

## French course publishing

The dedicated `french.html` entrypoint uses versioned shared code in `nirav2000/Apps/french-teaching/v1`. Add new curriculum data there without altering existing `Next/lessons/` records or Sai’s legacy `next-learning` Firestore document. Use the owner-scoped, immutable event evidence path described in README. Verify shared module deployment before the Next Pages link becomes visible. Never rewrite existing adult/Sai evidence from a full-document last-write-wins snapshot.


## Google sign-in / identity compatibility

The French route may reuse either the existing Next named Firebase session or the default kk-syllabus parent session. It does not remap any UID or change existing Next login UI. The Google button works only if the provider is linked to the known Firebase owner UID. A different Google UID must never be authorised for evidence. Any future App Monitor passkey-to-Firebase bridge requires a verified server-side adapter and separate test, not a cosmetic sign-in flag or Firestore rules relaxation.


## French phonics/grammar release
The 2026-11-23 phonics extension adds two versioned shared modules, phonics.js and lexicon.js, in Apps/french-teaching/v1, and a Sounds tab plus optional word explorer within the existing Next/French route. Always publish tested Apps code first; then change the French page's asset version suffix, bump the Next SW cache name, and include phonics.js and lexicon.js in the existing Next PWA precache. No new app, Firebase project, profile path, login or passkey system is required.


## French online dictionary module

The shared Apps French module now imports dictionary.js for on-demand Wiktionary/Wiktapi lookups, always secondary to curated grammar explanations. On release, deploy Apps and pass shared/browser tests before bumping the French page's query-string asset version and bumping Next's SW cache name. Precache the new JS for offline graceful fallbacks. Do not introduce a paid API or weaken existing Firebase auth rules. Follow the attribution and privacy notes in Apps/french-teaching/v1/README.md.


## iOS installed-app Google popup guard

Do NOT replace this fix with Firebase signInWithRedirect without first addressing GitHub Pages cross-origin auth helper / third-party storage and device testing. Standalone iPhone Next/French must not open a Google OAuth popup: recognise Apple standalone and offer the existing Firebase owner account's email/password form with password reset. Keep both client and entrypoint guards. Google popup in Safari remains an alternative only, and browser sign-in does not guarantee Home Screen session reuse. Never move tokens via copy/paste, pass OAuth tokens through query parameters or weaken Firestore UID checks. Source details and tests: Apps/french-teaching/v1/README.md, Apps/tests/french-ios-auth-browser.mjs, and Next/tests/french-auth.test.mjs.


### App Monitor passkey → Firebase bridge

The Next French entry point now uses the reusable Apps/apps-passkey-auth.js and the App Monitor Worker route /app-monitor/owner/french/firebase-token. The Worker must validate passkey session, Origin and fixed Firebase project/owner UID before issuing a custom Firebase JWT. The front end verifies projectId and UID after signInWithCustomToken. It can silently restore a valid remembered App Monitor session or accept a fresh passkey without Firebase email/password. Any production issue in the Worker is handled by the existing staged deployment, smoke tests and rollback; never call a direct wrangler deploy. No read/write path changes or migration of other Next lessons.
