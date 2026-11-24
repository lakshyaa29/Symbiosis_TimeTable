(function(root){
  'use strict';
  const DATA=typeof module!=='undefined'&&module.exports?require('./timetable-data.js'):root.SSPUData;
  const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const PROGRAMS=DATA.programs,DEPARTMENTS=Object.fromEntries(PROGRAMS.map(p=>[p.id,p.label])),ROOMS=DATA.rooms;
  const TYPES={lecture:'Lecture',tutorial:'Tutorial',lab:'Practical / lab',skill:'Skill',studio:'Studio',workshop:'Activity',project:'Project',mentoring:'Mentoring',holiday:'Holiday',library:'Library'};
  const toMinutes=t=>{const [h,m]=String(t).split(':').map(Number);return h*60+m;};
  const normal=s=>String(s||'').toLowerCase().replace(/\b(dr|prof|mr|ms|ar)\.?\s*/g,'').replace(/[^a-z0-9]/g,'');
  const known=s=>!!s&&!/not specified|tba|new faculty|visiting faculty|faculty code|^idsc/i.test(s);
  const members=e=>Array.isArray(e.facultyMembers)?e.facultyMembers:String(e.faculty||'').split(';').map(s=>s.trim());
  const localISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const parseDate=s=>{const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);};
  function weekStart(date=new Date()){const d=new Date(date);d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1));return d;}
  function addDays(date,n){const d=new Date(date);d.setDate(d.getDate()+n);return d;}
  function appliesOn(e,date){
    const iso=localISO(date);if((date.getDay()+6)%7!==Number(e.day))return false;
    if(e.date&&e.date!==iso)return false;
    if(e.validFrom&&iso<e.validFrom||e.validTo&&iso>e.validTo)return false;
    if(e.excludeDates?.includes(iso))return false;
    if(e.monthWeeks?.length&&!e.monthWeeks.includes(Math.ceil(date.getDate()/7)))return false;
    return true;
  }
  const visibleInWeek=(e,week)=>appliesOn(e,addDays(week,e.day));
  function occurrence(e,week){const d=e.date?parseDate(e.date):addDays(week,Number(e.day));const [h,m]=e.start.split(':').map(Number);d.setHours(h,m,0,0);return d;}
  function nextSession(entries,now=new Date()){
    const candidates=[];
    for(let offset=0;offset<45;offset++){
      const date=addDays(now,offset);
      for(const e of entries){if(e.type==='holiday'||!appliesOn(e,date))continue;const start=new Date(date),end=new Date(date);const [h,m]=e.start.split(':').map(Number),[eh,em]=e.end.split(':').map(Number);start.setHours(h,m,0,0);end.setHours(eh,em,0,0);if(end>now)candidates.push({entry:e,date:start,current:start<=now&&end>now});}
      if(candidates.length)return candidates.sort((a,b)=>a.date-b.date)[0];
    }
    return null;
  }
  function datesIntersect(a,b){
    if(a.date)return appliesOn(b,parseDate(a.date));
    if(b.date)return appliesOn(a,parseDate(b.date));
    if(a.validTo&&b.validFrom&&a.validTo<b.validFrom||b.validTo&&a.validFrom&&b.validTo<a.validFrom)return false;
    if(a.monthWeeks?.length&&b.monthWeeks?.length&&!a.monthWeeks.some(w=>b.monthWeeks.includes(w)))return false;
    return true;
  }
  function conflictsFor(candidate,entries){
    if(candidate.type==='holiday')return [];
    return entries.filter(e=>e.id!==candidate.id&&e.type!=='holiday'&&Number(e.day)===Number(candidate.day)&&toMinutes(e.start)<toMinutes(candidate.end)&&toMinutes(candidate.start)<toMinutes(e.end)&&datesIntersect(candidate,e)).map(e=>{
      const reasons=[];
      if(candidate.roomConfirmed!==false&&e.roomConfirmed!==false&&known(e.room)&&known(candidate.room)&&normal(e.room)===normal(candidate.room))reasons.push('room');
      if(members(e).filter(known).some(f=>members(candidate).filter(known).some(g=>normal(f)===normal(g))))reasons.push('faculty');
      if(e.department===candidate.department&&String(e.semester)===String(candidate.semester)&&e.className===candidate.className&&(!e.batch||!candidate.batch||e.batch===candidate.batch))reasons.push('class');
      return {entry:e,reasons};
    }).filter(c=>c.reasons.length);
  }
  function allConflicts(entries){const pairs=[];entries.forEach((e,i)=>conflictsFor(e,entries.slice(i+1)).forEach(c=>pairs.push({a:e,b:c.entry,reasons:c.reasons})));return pairs;}
  function validateEntry(e){
    if(!e||typeof e!=='object')return ['Each session must be an object.'];
    const errors=[];
    for(const key of ['id','subject','faculty','room','className'])if(typeof e[key]!=='string'||!e[key].trim()||e[key].length>250)errors.push(`Invalid ${key}.`);
    if(!Object.hasOwn(DEPARTMENTS,e.department))errors.push('Choose a listed program.');
    if(!/^([1-9]|10|11|12)$/.test(String(e.semester)))errors.push('Choose a semester from 1 to 12.');
    if(!Number.isInteger(Number(e.day))||Number(e.day)<0||Number(e.day)>5)errors.push('Choose Monday through Saturday.');
    if(!Object.hasOwn(TYPES,e.type))errors.push('Choose a valid session type.');
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(e.end))errors.push('Enter valid start and end times.');
    else if(toMinutes(e.start)>=toMinutes(e.end))errors.push('End time must be after start time.');
    else if(toMinutes(e.start)<420||toMinutes(e.end)>1320)errors.push('Schedule sessions between 07:00 and 22:00.');
    for(const key of ['date','validFrom','validTo'])if(e[key]&&(!/^\d{4}-\d{2}-\d{2}$/.test(e[key])||Number.isNaN(parseDate(e[key]).getTime())||localISO(parseDate(e[key]))!==e[key]))errors.push(`Invalid ${key}.`);
    if(e.date&&(parseDate(e.date).getDay()+6)%7!==Number(e.day))errors.push('The date must match the selected weekday.');
    if(e.monthWeeks&&(!Array.isArray(e.monthWeeks)||!e.monthWeeks.every(n=>Number.isInteger(n)&&n>=1&&n<=5)))errors.push('Invalid monthly recurrence.');
    if(e.monthWeeks?.length&&Number(e.day)!==5)errors.push('The 2nd/4th Saturday rule requires Saturday.');
    if(e.facultyMembers&&(!Array.isArray(e.facultyMembers)||!e.facultyMembers.every(f=>typeof f==='string')))errors.push('Invalid faculty members.');
    for(const key of ['rooms','excludeDates'])if(e[key]!==undefined&&(!Array.isArray(e[key])||!e[key].every(v=>typeof v==='string'&&v.length<=150)))errors.push(`Invalid ${key}.`);
    if(e.batch!==undefined&&(typeof e.batch!=='string'||e.batch.length>30))errors.push('Invalid batch.');
    if(e.sourcePage!==undefined&&(!Number.isInteger(e.sourcePage)||e.sourcePage<1||e.sourcePage>20))errors.push('Invalid PDF source page.');
    if(e.sourceUrl!==undefined&&(typeof e.sourceUrl!=='string'||e.sourceUrl.length>1000||!/^https:\/\//.test(e.sourceUrl)))errors.push('Invalid source PDF URL.');
    return errors;
  }
  function validateDataset(data){
    if(!Array.isArray(data)||data.length>5000)throw Error('Choose a JSON backup containing up to 5,000 sessions.');
    const ids=new Set();
    return data.map((e,i)=>{const errors=validateEntry(e);if(errors.length)throw Error(`Session ${i+1}: ${errors[0]}`);if(ids.has(e.id))throw Error(`Duplicate session ID at session ${i+1}.`);ids.add(e.id);const allowed=['id','subject','faculty','facultyMembers','room','rooms','roomConfirmed','department','semester','className','batch','day','start','end','type','courseCode','sourcePage','sourceText','sourceUrl','sourceLabel','date','validFrom','validTo','excludeDates','monthWeeks','edited'];const result=Object.fromEntries(allowed.filter(k=>e[k]!==undefined).map(k=>[k,e[k]]));result.semester=String(e.semester);result.day=Number(e.day);return result;});
  }
  const seed=()=>JSON.parse(JSON.stringify(DATA.sessions));
  const api={DATA,DAYS,PROGRAMS,DEPARTMENTS,ROOMS,TYPES,toMinutes,normal,known,members,localISO,parseDate,weekStart,addDays,appliesOn,visibleInWeek,occurrence,nextSession,conflictsFor,allConflicts,validateEntry,validateDataset,seed};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CampusData=api;
})(typeof globalThis!=='undefined'?globalThis:this);
