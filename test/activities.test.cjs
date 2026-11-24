const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { validateActivity, hashPassword, checkPassword, writeJSON, createActivityStore, createActivitiesHandler } = require('../lib/activities.cjs');

const fixture = { type:'fun', title:'Test game night', organizer:'Test student club', venue:'Test courtyard', description:'A disposable test fixture for the activity publishing flow.', audience:'All students', date:'2026-12-01', start:'17:00', end:'19:00' };
async function setup(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sspu-activity-test-'));
  const configFile = path.join(dir, 'organizer.json');
  await writeJSON(configFile, await hashPassword('test-password-only'));
  const store = createActivityStore(dir, configFile);
  const handler = createActivitiesHandler(store);
  const server = http.createServer(async (req,res) => { if (!(await handler(req,res))) { res.writeHead(404); res.end(); } });
  await new Promise((resolve,reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const url = `http://127.0.0.1:${server.address().port}/api/activities`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    for (const name of ['activities.json','organizer.json']) await fs.unlink(path.join(dir,name)).catch(e => { if(e.code!=='ENOENT') throw e; });
    await fs.rmdir(dir);
  });
  const publish = (activity=fixture,password='test-password-only',headers={}) => fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify({activity,password})});
  return {dir,configFile,store,url,publish};
}
test('activity schema accepts organized events and rejects timetable session types',()=>{
  assert.equal(validateActivity(fixture).type,'fun');
  assert.throws(()=>validateActivity({...fixture,type:'lecture'}),/listed activity type/);
  assert.throws(()=>validateActivity({...fixture,title:'  '}),/activity title/);
  assert.throws(()=>validateActivity({...fixture,date:'2026-02-31'}),/valid activity date/);
  assert.throws(()=>validateActivity({...fixture,end:'16:00'}),/End time/);
  assert.equal(validateActivity({...fixture,end:'',audience:''}).audience,'All students');
});
test('custom activity types require a type description',()=>{
  assert.throws(()=>validateActivity({...fixture,type:'other'}),/activity type/);
  assert.equal(validateActivity({...fixture,type:'other',customType:'Campus clean-up'}).customType,'Campus clean-up');
});
test('password is salted and hashed; correct and incorrect passwords differ',async()=>{
  const a=await hashPassword('test-password-only'),b=await hashPassword('test-password-only');
  assert.notEqual(a.hash,b.hash);assert.equal(await checkPassword('test-password-only',a),true);assert.equal(await checkPassword('wrong-password',a),false);
});
test('everyone can read an empty board without an organizer password',async t=>{
  const {url}=await setup(t);const response=await fetch(url);assert.equal(response.status,200);assert.deepEqual(await response.json(),{activities:[]});
});

test('administrator unlock uses the organizer password and never publishes an event',async t=>{
  const {url,store}=await setup(t);const endpoint=url.replace('/activities','/admin/unlock');
  const unlock=password=>fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
  assert.equal((await unlock('wrong')).status,401);
  assert.equal((await unlock('')).status,401);
  const correct=await unlock('test-password-only');assert.equal(correct.status,200);assert.deepEqual(await correct.json(),{authorized:true});
  assert.equal((await fetch(endpoint)).status,405);
  assert.deepEqual(await store.list(),[]);
  const forged=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:JSON.stringify({password:'test-password-only'})});assert.equal(forged.status,403);
});
test('wrong and missing passwords cannot publish or create records',async t=>{
  const {publish,store}=await setup(t);assert.equal((await publish(fixture,'wrong')).status,401);assert.equal((await publish(fixture,'')).status,401);assert.deepEqual(await store.list(),[]);
});
test('published events are public, persistent, and never contain the password',async t=>{
  const {publish,url,dir,configFile}=await setup(t);const response=await publish();assert.equal(response.status,201);const {activity}=await response.json();assert.ok(activity.id);assert.equal(activity.title,fixture.title);assert.equal(Object.hasOwn(activity,'password'),false);
  const listing=await (await fetch(url)).json();assert.equal(listing.activities[0].id,activity.id);
  const reopened=createActivityStore(dir,configFile);assert.equal((await reopened.list())[0].id,activity.id);
  assert.equal((await fs.readFile(path.join(dir,'activities.json'),'utf8')).includes('test-password-only'),false);
});
test('simultaneous authorized publications retain every event',async t=>{
  const {publish,store}=await setup(t);const responses=await Promise.all(['A','B','C'].map(title=>publish({...fixture,title})));assert.ok(responses.every(r=>r.status===201));assert.equal((await store.list()).length,3);
});
test('forged cross-origin posts and malformed details are rejected',async t=>{
  const {publish,store}=await setup(t);assert.equal((await publish(fixture,'test-password-only',{Origin:'https://unrelated.example'})).status,403);assert.equal((await publish({...fixture,date:'no date'})).status,400);assert.deepEqual(await store.list(),[]);
});
test('unconfigured publishing fails closed without exposing credentials',async t=>{
  const {dir}=await setup(t);const store=createActivityStore(dir,path.join(dir,'missing.json'));await assert.rejects(store.publish(fixture,'anything'),e=>e.status===503);
});
test('unknown fields never become public event fields',async t=>{
  const {publish}=await setup(t);const result=await (await publish({...fixture,faculty:'Not an academic session',semester:1,password:'never-copy-me'})).json();assert.equal(Object.hasOwn(result.activity,'faculty'),false);assert.equal(Object.hasOwn(result.activity,'semester'),false);assert.equal(Object.hasOwn(result.activity,'password'),false);
});
test('repeated incorrect passwords are rate limited',async t=>{
  const {publish,store}=await setup(t);for(let i=0;i<8;i++)assert.equal((await publish(fixture,'incorrect')).status,401);assert.equal((await publish(fixture,'incorrect')).status,429);assert.deepEqual(await store.list(),[]);
});
