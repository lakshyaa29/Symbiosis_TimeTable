/* Source-preserving faculty reconciliation. Inferred assignments never change timetable data. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./faculty-data.js'));else root.FacultyDirectory=factory(root.SSPUFacultyData);})(typeof globalThis!=='undefined'?globalThis:this,function(data){
  'use strict';
  const normalize=s=>String(s||'').toLowerCase().replace(/\b(dr|prof|mr|ms|ar)\.?\s*/g,'').replace(/[^a-z0-9]/g,'');
  const names=e=>Array.isArray(e.facultyMembers)?e.facultyMembers:String(e.faculty||'').split(';').map(s=>s.trim()).filter(Boolean);
  const people=new Map(data.people.map(p=>[p.id,p]));
  function resolve(label,department){
    const alias=data.aliases.find(a=>a.label===label&&(!a.program||a.program===department));
    if(alias)return {...alias,person:people.get(alias.personId)};
    const exact=data.people.filter(p=>normalize(p.name)===normalize(label));
    if(exact.length===1)return {person:exact[0],status:'name',reason:'Name matches the official faculty directory.'};
    return {person:null,status:'unresolved',reason:/faculty code|^IDSC|new faculty|visiting faculty|TBA/i.test(label)?'The source gives an allocation code or placeholder. An individual teacher has not been identified.':'Named in the timetable; no confident match was found in the current official faculty lists.'};
  }
  function build(entries){
    const records=new Map(data.people.map(p=>[p.id,{...p,official:true,assignments:[]}]));
    for(const entry of entries){
      for(const label of names(entry)){
        if(!label||label==='Not specified'||label==='Faculty TBA')continue;
        const match=resolve(label,entry.department),id=match.person?match.person.id:'source:'+label;
        if(!records.has(id))records.set(id,{id,name:label,official:false,role:'Timetable allocation',programs:[],schoolLabels:[],assignments:[]});
        records.get(id).assignments.push({entry,label,status:match.status,reason:match.reason});
      }
    }
    return [...records.values()].sort((a,b)=>Number(b.official)-Number(a.official)||Number(!!b.assignments.length)-Number(!!a.assignments.length)||a.name.localeCompare(b.name));
  }
  const matchesFilters=(entry,filters={})=>(!filters.semester||filters.semester==='all'||String(entry.semester)===String(filters.semester))&&(!filters.section||filters.section==='all'||entry.className===filters.section)&&(!filters.batch||filters.batch==='all'||!entry.batch||entry.batch===filters.batch);
  const assignmentsFor=(record,program='all',filters={})=>record.assignments.filter(a=>(program==='all'||a.entry.department===program)&&matchesFilters(a.entry,filters));
  const sessionsFor=(record,program='all',filters={})=>[...new Map(assignmentsFor(record,program,filters).map(a=>[a.entry.id,a.entry])).values()];
  const inProgram=(record,program)=>program==='all'||record.programs.includes(program)||record.assignments.some(a=>a.entry.department===program);
  return {data,normalize,resolve,build,assignmentsFor,sessionsFor,inProgram,matchesFilters};
});
