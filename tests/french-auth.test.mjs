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
  assert.match(script,/mountFrenchCourse\(\{target:.*connect,signIn,signInGoogle,linkGoogle,signOut\}\)/);
  assert.doesNotMatch(script,/X-App-Monitor-Session|passkeyLogin|FIREBASE_ADMIN/);
  assert.match(fs.readFileSync('sw.js','utf8'),/next-learning-shared-v4/);
});
