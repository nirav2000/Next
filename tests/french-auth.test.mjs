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
  assert.match(script,/mountFrenchCourse\(\{target:.*connect,signIn,signInGoogle,linkGoogle,resetPassword,signOut\}\)/);
  assert.doesNotMatch(script,/X-App-Monitor-Session|passkeyLogin|FIREBASE_ADMIN/);
  const sw=fs.readFileSync('sw.js','utf8');
  assert.match(sw,/next-learning-shared-v7/);
  assert.match(sw,/french-teaching\/v1\/auth-context\.js/);
  assert.match(sw,/french-teaching\/v1\/phonics\.js/);
  assert.match(sw,/french-teaching\/v1\/lexicon\.js/);
  assert.match(sw,/french-teaching\/v1\/dictionary\.js/);
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
