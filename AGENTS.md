# Standing instructions for Next / Schools development

## GitHub and releases
The owner requires main-only development. Read PUBLISHING.md, README.md and nirav2000/Apps/docs/GITHUB-WRITE-RUNBOOK.md before making changes. Work directly on main; no feature branches or PRs unless explicitly requested. Use the connected Git Data API (base tree, candidate commit, verified non-force update_ref with expected SHA) for atomic multi-file changes, or Contents API with current blob SHA for single files. Reconcile concurrent edits; never force-push. If authorization is denied, stop that operation and explain the blocker; do not bypass permissions. Do not introduce new branches as a workaround. Validate changes before promoting the exact candidate; inspect exact-SHA CI and Pages separately. If a required test gate cannot be satisfied, report it rather than declaring completion. Preserve rollback SHAs.

Next French code lives in nirav2000/Apps/french-teaching/v1. Deploy and verify shared code before updating Next French asset versions, app version and PWA cache together; precache new modules. Preserve existing lessons, local storage, adult/Sai evidence, auth, and other shared consumers. Use synthetic browser test fixtures; real iOS passkey and cross-device sync require real-device acceptance.

## Firebase and Cloudflare
Use existing project kk-syllabus (default database) with its original owner UID and explicit adult/sai learner scopes. Read nirav2000/Kk-syllabus/README.md and Apps/french-teaching/v1/README.md. The existing encrypted Actions secret FIREBASE_SERVICE_ACCOUNT_KK_SYLLABUS was successfully used for authenticated read-only Firestore access on 23 November 2026 (Kk-syllabus Actions run 45284405203; workflow verify-french-firebase-token.yml). Existing protected App Monitor owner/passkey routes provide another authenticated path. Reuse existing credentials via authorized execution/session, not new service accounts or relaxed security rules. Never put private keys, tokens or learner records in public GitHub logs, artifacts or source. Do not modify App Monitor Worker, R2 passkeys or unrelated apps to obtain access. GitHub read access does not imply write access, workflow dispatch or Firebase authentication.

French evidence: families/{OWNER_UID}/learners/{adult|sai}/progress/evidence-{appId}-v1-{eventId}. App IDs: next-french, next-french-answers, next-french-journey. Limit reads to the authorized learner/time scope. If direct authenticated reading is unavailable, use the existing Answer history and Session journey exports; report the exact limitation. No historical evidence rewriting.

## Learning design
One coherent learning path. Target weak vocabulary and structures, vary sentences, increase real-world complexity as unaided recall improves. Preserve meaningful delayed retrieval, distinguish supported practice from independent learning and transfer. Never count oral self-report as independently scored success. InClass remains homework-first; Next is deeper learning.

## Reporting
Report actual commit, test and live deployment results separately. Link directly to the relevant app or assessment. Maintain durable process/architecture decisions in Markdown; live tasks in issues. Keep summaries concise and actionable.
