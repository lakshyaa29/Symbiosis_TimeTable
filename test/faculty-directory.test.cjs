const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const F=require('../dist/faculty-directory.js');
const D=require('../dist/timetable-data.js');

test('every official profile has a unique identity, school source and local photo',()=>{
  assert.equal(new Set(F.data.people.map(p=>p.id)).size,F.data.people.length);
  assert.equal(F.data.people.length,118);
  for(const p of F.data.people){
    assert.match(p.profileUrl,/^https:\/\/sspu\.ac\.in\/faculty\//);
    assert.ok(p.schools.length&&p.sources.length);
    assert.ok(p.sources.every(s=>s.startsWith('https://sspu.ac.in/school/')));
    assert.ok(fs.existsSync(path.join(__dirname,'../dist',p.photo)));
  }
});
test('exact names and expanded names merge without changing PDF entries',()=>{
  const before=JSON.stringify(D.sessions),records=F.build(D.sessions);
  assert.equal(JSON.stringify(D.sessions),before);
  const p=records.find(p=>p.name.includes('Mahendra Balkrishna'));
  assert.ok(p.assignments.some(a=>a.label==='Dr. Mahendra B. Salunke'));
  assert.ok(p.assignments.every(a=>a.status==='name'));
});
test('initials are marked inferred and constrained to the source program',()=>{
  for(const [label,program,name] of [['RDS','BTECH_AIML','Rudresh'],['ANS','BTECH_CYBER','Ashwini'],['GL','BTECH_DEFENCE','Ganesh'],['VH','BTECH_DEFENCE','Viney'],['SSR','BTECH_AIML','Shwetal']]){
    const r=F.resolve(label+' (faculty code)',program);
    assert.equal(r.status,'inferred');assert.ok(r.person.name.includes(name));assert.ok(r.reason);
    assert.equal(F.resolve(label+' (faculty code)','BDES').status,'unresolved');
  }
});
test('similar names stay distinct and ambiguous placeholders never acquire identities',()=>{
  const a=F.resolve('Ar. Ashish Srivastava','BARCH'),b=F.resolve('Dr Abishek Shrivastava','BBA_RETAIL');
  assert.ok(a.person.name.includes('Ashish Kumar'));assert.ok(b.person.name.includes('Abhishek Kumar'));
  assert.notEqual(a.person.id,b.person.id);
  for(const label of ['AGT (faculty code)','SD (faculty code)','SJ1 (faculty code)','NF1 (faculty code)','New Faculty 1','IDSC','Dr. Prashant']){
    assert.equal(F.resolve(label,'BTECH_DEFENCE').person,null);
  }
});
test('every nonempty source allocation is retained and joint sessions are not duplicated',()=>{
  const records=F.build(D.sessions);
  const count=D.sessions.flatMap(e=>e.facultyMembers).filter(l=>l&&l!=='Not specified'&&l!=='Faculty TBA').length;
  assert.equal(records.flatMap(r=>r.assignments).length,count);
  const person=F.data.people[0];
  const entry={id:'joint',department:'BDES',facultyMembers:[person.name,'Dr. Gauri Shirurkar']};
  const p=F.build([entry]).find(p=>p.id===person.id);
  assert.equal(p.assignments.length,2);assert.equal(F.sessionsFor(p).length,1);
});
test('program scope includes published school membership and actual cross-school schedules',()=>{
  const records=F.build(D.sessions),ashwini=records.find(p=>p.name==='Ashwini Nikhil Shinde');
  assert.equal(F.inProgram(ashwini,'BTECH_CYBER'),true);
  assert.equal(F.inProgram(ashwini,'BARCH'),false);
  assert.equal(F.assignmentsFor(ashwini,'BARCH').length,0);
  const noSchedule=records.find(p=>p.official&&!p.assignments.length);
  assert.equal(F.sessionsFor(noSchedule).length,0);
});
