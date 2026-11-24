const test=require('node:test'),assert=require('node:assert/strict');
const p=require('../dist/student-profile.js'),c=require('../dist/core.js');
const base={program:'BTECH_AIML',rollNumber:'2601132078',semester:'1',className:'D',batch:'D2'};
test('AIML D1 and D2 boundaries match the exact printed ranges',()=>{
  for(const [roll,batch] of [['2601132003','D1'],['2601132077','D1'],['2601132078','D2'],['2601132156','D2']])assert.equal(p.inferPlacement('BTECH_AIML',roll).batch,batch);
  assert.equal(p.inferPlacement('BTECH_AIML','2601132002'),null);assert.equal(p.inferPlacement('BTECH_AIML','2601132157'),null);
});
test('Cyber Security ranges preserve the missing PRN gap',()=>{
  for(const [roll,batch] of [['2601106003','A1'],['2601106088','A1'],['2601106090','A2'],['2601106155','A2']])assert.equal(p.inferPlacement('BTECH_CYBER',roll).batch,batch);
  assert.equal(p.inferPlacement('BTECH_CYBER','2601106089'),null);
});
test('short roll numbers and other departments are never guessed from trailing digits',()=>{
  assert.equal(p.inferPlacement('BTECH_AIML','78'),null);assert.equal(p.inferPlacement('BTECH_MECH','2601132078'),null);assert.equal(p.inferPlacement('BTECH_CYBER','2601132078'),null);assert.equal(p.inferPlacement('BTECH_AIML','2601132078-extra'),null);
});
test('personal D2 timetable includes whole-class entries and excludes D1 labs',()=>{
  const profile=p.createProfile(base),sessions=p.sessionsForProfile(profile);
  assert.ok(sessions.some(e=>e.batch==='D2'));assert.ok(sessions.some(e=>!e.batch));assert.equal(sessions.some(e=>e.batch==='D1'),false);assert.equal(profile.assignment,'source-range');assert.equal(profile.sourcePage,14);
});
test('manual batch selection supports classes without any PRN rule',()=>{
  const profile=p.createProfile({program:'BTECH_MECH',rollNumber:'ME-023',semester:'3',className:'A',batch:'SA2'});
  assert.equal(profile.assignment,'manual');const sessions=p.sessionsForProfile(profile);assert.ok(sessions.some(e=>e.batch==='SA2'));assert.equal(sessions.some(e=>e.batch==='SA1'),false);
});
test('a known split requires a specific batch instead of all batches',()=>{
  assert.ok(p.validateProfile({...base,batch:''}).length);assert.ok(p.validateProfile({...base,batch:'all'}).length);assert.ok(p.validateProfile({...base,batch:'D3'}).length);
});
test('saved profile JSON reloads with its complete class selection',()=>{
  const saved=p.createProfile(base),restored=p.validateStoredProfile(JSON.parse(JSON.stringify(saved)));
  for(const key of ['program','rollNumber','semester','className','batch','assignment','sourcePage'])assert.equal(restored[key],saved[key]);
});
test('corrupted or unsupported saved profiles trigger setup again',()=>{
  assert.equal(p.validateStoredProfile(null),null);assert.equal(p.validateStoredProfile({...base,version:99}),null);assert.equal(p.validateStoredProfile({...base,version:1,program:'unknown'}),null);assert.equal(p.validateStoredProfile({...base,version:1,batch:'all'}),null);
});
test('a program or class without a timetable remains empty rather than falling back',()=>{
  const pending=p.createProfile({program:'MBA_FINTECH',rollNumber:'MBA-100',semester:'1',className:'A',batch:''});assert.equal(p.sessionsForProfile(pending).length,0);
  const missingClass=p.createProfile({...base,semester:'2',className:'B',batch:''});assert.equal(p.sessionsForProfile(missingClass).length,0);
});
test('student-selected overrides are labelled manual instead of source-matched',()=>{
  const override=p.createProfile({...base,batch:'D1'});assert.equal(override.assignment,'manual');assert.equal(Object.hasOwn(override,'sourcePage'),false);
});
test('profile validation preserves roll identifiers and rejects unusable values',()=>{
  assert.equal(p.createProfile({...base,rollNumber:'  00023  '}).rollNumber,'00023');assert.ok(p.validateProfile({...base,rollNumber:''}).length);assert.ok(p.validateProfile({...base,rollNumber:'<script>'}).length);assert.ok(p.validateProfile({...base,semester:'0'}).length);assert.ok(p.validateProfile({...base,className:''}).length);
});
test('cohort and batch options follow uploaded or locally added schedules',()=>{
  assert.deepEqual(p.classesFor('BTECH_AIML','1'),['D']);assert.deepEqual(p.batchesFor('BTECH_AIML','1','D'),['D1','D2']);
  const added=[...c.seed(),{department:'BTECH_AIML',semester:'3',className:'B',batch:'B1'}];assert.deepEqual(p.classesFor('BTECH_AIML','3',added),['B']);assert.deepEqual(p.batchesFor('BTECH_AIML','3','B',added),['B1']);
});
