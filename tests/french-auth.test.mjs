import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const html=fs.readFileSync('french.html','utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
test('French Firebase auth module parses without changing existing Next app',()=>{
  assert.ok(script,'dedicated auth module must be present');
  const check=spawnSync(process.execPath,['--check','--input-type=module'],{input:script,encoding:'utf8'});
  assert.equal(check.status,0,String(check.stderr));
  assert.ok(fs.readFileSync('app.js','utf8').includes("function firebase()"),'legacy Next Firebase code stays in place');
});
test('reuses both named Next and default family Firebase identities',()=>{
  assert.match(script,/name==='next-learning'/);
  assert.ok(script.includes("name==='[DEFAULT]'"));
  assert.ok(script.includes('currentUser?.uid===OWNER_UID'));
  assert.match(script,/setPersistence\(auth,authSdk\.browserLocalPersistence\)/);
  assert.match(script,/authStateReady\(\)/);
});
test('Google linking retains the original owner UID and cannot silently relabel learner data',()=>{
  assert.match(script,/signInWithPopup\(auth,new authSdk\.GoogleAuthProvider\(\)\)/);
  assert.match(script,/linkWithPopup\(auth\.currentUser,new authSdk\.GoogleAuthProvider\(\)\)/);
  assert.match(script,/credential\.user\.uid!==OWNER_UID/);
  assert.match(script,/credential\.user\.uid!==expected/);
  assert.match(script,/await authSdk\.signOut\(auth\)/);
  assert.doesNotMatch(script,/createUserWithEmailAndPassword/);
  assert.doesNotMatch(script,/signInAnonymously/);
});
test('the course does not receive or emit a raw passkey token or change evidence document paths',()=>{
  assert.match(script,/mountFrenchCourse\(\{target:.*connect,signIn,signInGoogle,linkGoogle,signInPasskey,resetPassword,signOut\}\)/);
  assert.doesNotMatch(script,/X-App-Monitor-Session|FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON|private_key/);
  const sw=fs.readFileSync('sw.js','utf8');
  assert.match(sw,/next-learning-shared-v34/);
  assert.match(sw,/french-teaching\/v1\/auth-context\.js/);
  assert.match(sw,/french-teaching\/v1\/phonics\.js/);
  assert.match(sw,/french-teaching\/v1\/lexicon\.js/);
  assert.match(sw,/french-teaching\/v1\/dictionary\.js/);
  assert.match(sw,/Apps\/apps-passkey-auth\.js/);
});


test('iOS standalone Google popup and linking are both blocked before Firebase OAuth starts',()=>{
  assert.match(script,/function isInstalledIOSApp\(\)/);
  assert.match(script,/nav\.standalone===true/);
  assert.match(script,/display-mode: standalone/);
  assert.match(script,/function requireSafeGooglePopup\(\)/);
  assert.match(script,/error\.code='auth\/unsupported-standalone'/);
  const signIn=script.slice(script.indexOf('function signInGoogle(){'),script.indexOf('function linkGoogle(){'));
  const link=script.slice(script.indexOf('function linkGoogle(){'),script.indexOf('async function resetPassword(email)'));
  assert.match(signIn,/requireSafeGooglePopup\(\)/);
  assert.match(link,/requireSafeGooglePopup\(\)/);
  assert.match(script,/sendPasswordResetEmail\(auth,String\(email\|\|''\)\.trim\(\)\)/);
  assert.match(script,/if\(credential\.user\.uid!==OWNER_UID\)/);
});


test('passkey login preserves the parent UID, authenticates with Firebase custom token and is not a guest bypass',()=>{
  assert.match(script,/app-monitor\.admin-session\.v2/);
  assert.match(script,/async function exchangePasskeyForFirebase/);
  assert.match(script,/checked\.method!=='passkey'/);
  assert.match(script,/\/owner\/french\/firebase-token/);
  assert.match(script,/signInWithCustomToken\(auth,details\.customToken\)/);
  assert.match(script,/credential\.user\.uid!==OWNER_UID/);
  assert.match(script,/await authSdk\.signOut\(auth\)/);
  assert.match(script,/async function restorePasskeyFirebase/);
  assert.match(script,/await restorePasskeyFirebase\(chosen\.auth,authSdk\)/);
  assert.match(script,/await client\.passkeyLogin\(\)/);
  assert.match(script,/browserLocalPersistence/);
  assert.doesNotMatch(script,/signInAnonymously|createUserWithEmailAndPassword/);
});


test('missing Worker route is reported without asking the user to unlock their passkey',()=>{
  const fn=script.slice(script.indexOf('async function signInPasskey(){'),
    script.indexOf('async function resetPassword(email)'));
  const check=fn.indexOf('availability.status!==405');
  const prompt=fn.indexOf('client.passkeyLogin()');
  assert.ok(check>=0 && prompt>check);
  assert.match(fn,/method:'GET'/);
  assert.match(fn,/await fetch\(MONITOR_AUTH\+'\/owner\/french\/firebase-token'/);
});


test('French v2 assets are offline-ready while old Next and Auth stay unmodified',()=>{
  const sw=fs.readFileSync('sw.js','utf8');
  const html=fs.readFileSync('french.html','utf8');
  for(const name of ['magic10.js','guided-lessons.js','guided-ui.js','assessment.js','assessment-ui.js','answer-history.js','revision-signals.js','adaptive-teaching.js','study-timing.js','curriculum-meta.js','sai-curriculum.js','unlocking-curriculum.js','unlocking-builder.js','curriculum-assessments.js']){
    assert.ok(sw.includes('/french-teaching/v1/'+name),'PWA must precache '+name);
  }
  assert.match(html,/style\.css\?v=20261126l/);
  assert.match(html,/index\.js\?v=20261126l/);
  assert.match(sw,/next-learning-shared-v34/);
  assert.doesNotMatch(html,/FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON|-----BEGIN PRIVATE KEY-----/);
});

test('French header has a stable accessible link, flag, rolling French label and reduced motion',()=>{
  const js=fs.readFileSync('app.js','utf8');
  const css=fs.readFileSync('styles.css','utf8');
  const index=fs.readFileSync('index.html','utf8');
  assert.match(js,/href="\.\/french\.html" aria-label="French course — Cours de français"/);
  assert.match(js,/class="french-flag"/);
  assert.match(js,/frenchLabel\("Cours de français","fr"\)/);
  assert.match(css,/french-course-link:visited/);
  assert.match(css,/@keyframes next-french-roll/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(index,/app\.js\?v=2026\.11\.26\.5/);
});

test('French course label cycles continuously with two transition styles',()=>{
 const css=fs.readFileSync('styles.css','utf8');
 assert.match(css,/animation-duration:12s/);
 assert.match(css,/animation-iteration-count:infinite/);
 assert.match(css,/translateY\(-110%\)/);
 assert.match(css,/rotateX\(-90deg\)/);
 assert.match(css,/animation-delay:calc\(var\(--i\)\*25ms\)/);
});

test('learning effectiveness shared assessment utilities are precached',()=>{assert.match(fs.readFileSync('sw.js','utf8'),/learning-evidence\/v1\/assessment\.js/);});


test('French device reminders open the course and the countdown module is offline-ready',()=>{const sw=fs.readFileSync('sw.js','utf8');assert.match(sw,/study-timing\.js/);assert.match(sw,/nextFrench/);assert.match(sw,/\.\/french\.html/);assert.match(script,/serviceWorker\.register\('\.\/sw\.js'\)/);});
