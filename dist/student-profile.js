(function(root){
  'use strict';
  const core=typeof module!=='undefined'&&module.exports?require('./core.js'):root.CampusData;
  const STORAGE_KEY='sspu-student-profile-v1';
  // Only ranges printed in the supplied PDF are used for automatic assignment.
  const BATCH_RULES=Object.freeze([
    {program:'BTECH_AIML',semester:'1',className:'D',batch:'D1',start:'2601132003',end:'2601132077',sourcePage:14},
    {program:'BTECH_AIML',semester:'1',className:'D',batch:'D2',start:'2601132078',end:'2601132156',sourcePage:14},
    {program:'BTECH_CYBER',semester:'1',className:'A',batch:'A1',start:'2601106003',end:'2601106088',sourcePage:15},
    {program:'BTECH_CYBER',semester:'1',className:'A',batch:'A2',start:'2601106090',end:'2601106155',sourcePage:15}
  ].map(Object.freeze));
  function inferPlacement(program,rollNumber){
    const roll=typeof rollNumber==='string'?rollNumber.trim():'';
    if(!/^\d{10}$/.test(roll))return null;
    const rule=BATCH_RULES.find(r=>r.program===program&&roll>=r.start&&roll<=r.end);
    return rule?{program:rule.program,semester:rule.semester,className:rule.className,batch:rule.batch,sourcePage:rule.sourcePage}:null;
  }
  function classesFor(program,semester,entries=core.DATA.sessions){return [...new Set(entries.filter(e=>e.department===program&&e.semester===String(semester)).map(e=>e.className))].sort();}
  function batchesFor(program,semester,className,entries=core.DATA.sessions){return [...new Set(entries.filter(e=>e.department===program&&e.semester===String(semester)&&e.className===className).map(e=>e.batch).filter(Boolean))].sort();}
  function validateProfile(input,entries=core.DATA.sessions){
    const errors=[];
    if(!input||typeof input!=='object'||Array.isArray(input))return ['Enter your student details.'];
    if(!Object.hasOwn(core.DEPARTMENTS,input.program))errors.push('Choose your department / program.');
    if(typeof input.rollNumber!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/.test(input.rollNumber.trim()))errors.push('Enter your roll number or PRN using letters, numbers, dots, hyphens or slashes.');
    if(!/^(?:[1-9]|1[0-2])$/.test(String(input.semester)))errors.push('Choose your semester.');
    if(typeof input.className!=='string'||!input.className.trim()||input.className.trim().length>40)errors.push('Enter your class / section.');
    if(typeof input.batch!=='string'||input.batch.length>30)errors.push('Choose your practical batch.');
    if(!errors.length){const batches=batchesFor(input.program,input.semester,input.className.trim(),entries);if(batches.length&&!batches.includes(input.batch))errors.push('Choose a specific practical batch so your timetable shows the correct labs.');}
    return errors;
  }
  function createProfile(input,entries=core.DATA.sessions){
    const errors=validateProfile(input,entries);if(errors.length)throw Error(errors[0]);
    const result={version:1,program:input.program,rollNumber:input.rollNumber.trim(),semester:String(input.semester),className:input.className.trim(),batch:input.batch.trim(),assignment:'manual',updatedAt:new Date().toISOString()};
    const match=inferPlacement(result.program,result.rollNumber);
    if(match&&['semester','className','batch'].every(k=>result[k]===match[k])){result.assignment='source-range';result.sourcePage=match.sourcePage;}
    return result;
  }
  function validateStoredProfile(value,entries=core.DATA.sessions){
    if(!value||value.version!==1||validateProfile(value,entries).length)return null;
    try{return createProfile(value,entries);}catch{return null;}
  }
  function sessionsForProfile(profile,entries=core.DATA.sessions){return entries.filter(e=>e.department===profile.program&&e.semester===profile.semester&&e.className===profile.className&&(!e.batch||!profile.batch||e.batch===profile.batch));}
  const api={STORAGE_KEY,BATCH_RULES,inferPlacement,classesFor,batchesFor,validateProfile,createProfile,validateStoredProfile,sessionsForProfile};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StudentProfiles=api;
})(typeof globalThis!=='undefined'?globalThis:this);
