/* Symbiosis College · SSPU Kiwale · student campus portal */
(()=>{
  'use strict';
  const {DATA,PROGRAMS,TYPES,known,members,appliesOn,visibleInWeek,parseDate,localISO,DAYS,DEPARTMENTS,ROOMS,toMinutes,conflictsFor,allConflicts,validateEntry,validateDataset,weekStart,addDays,occurrence,nextSession,seed}=CampusData;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const iconPaths={calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2M8 18h2"/>',building:'<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 7h2M7 11h2M7 15h2M15 11h2M15 15h2M15 19h2"/>',people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v2"/>',sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4M18 4h4M3 18v4M1 20h4"/>',sliders:'<path d="M4 3v8M4 15v6M12 3v3M12 10v11M20 3v11M20 18v3M1 11h6M9 6h6M17 14h6"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',chevrons:'<path d="m8 8 4-4 4 4M8 16l4 4 4-4"/>',chevronLeft:'<path d="m14 6-6 6 6 6"/>',chevronRight:'<path d="m10 6 6 6-6 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6zM18 12h1"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',check:'<path d="m5 12 4 4L19 6"/>',shield:'<path d="M12 3 3 6v6c0 5 9 9 9 9s9-4 9-9V6Z"/><path d="m8 12 3 3 5-6"/>',x:'<path d="m6 6 12 12M6 18 18 6"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',edit:'<path d="m15 5 4 4M4 20l4-1L21 6l-4-4L4 15ZM12 4H4v16h16v-8"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',book:'<path d="M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2ZM12 5v16"/>',monitor:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>',coffee:'<path d="M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM17 9h2a3 3 0 1 1 0 6h-2M7 2v3M11 2v3"/>',code:'<path d="m7 7-5 5 5 5M17 7l5 5-5 5M14 3l-4 18"/>',lightbulb:'<path d="M9 18h6M9 21h6M8 15a7 7 0 1 1 8 0l-1 3H9Z"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',refresh:'<path d="M20 7a9 9 0 1 0 1 9M20 2v6h-6"/>',logout:'<path d="M10 3H4v18h6M14 8l5 4-5 4M8 12h11"/>',alert:'<path d="m12 3 10 18H2ZM12 9v5M12 17v1"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
  const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.calendar}</svg>`;
  function hydrate(){ $$('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon)); }
  const STORAGE_KEY='sspu-sessions-'+DATA.version;
  let entries,storageAvailable=true;
  try{const saved=localStorage.getItem(STORAGE_KEY);entries=saved?validateDataset(JSON.parse(saved)):seed();}catch{entries=seed();storageAvailable=false;}
  const pages={programs:'Programs',timetable:'My timetable',classrooms:'Classrooms',faculty:'Faculty directory',activities:'Campus activities',upcoming:'Upcoming features',admin:'Schedule manager'};
  const state={page:pages[location.hash.slice(1)]?location.hash.slice(1):'timetable',department:'BTECH_AIML',semester:'1',className:'D',batch:'D1',level:'all',faculty:'all',day:'all',week:0,view:'week',query:'',isAdmin:false,building:'all',roomType:'all',facultyDepartment:'all',facultyScope:'all'};
  let detailId=null,deleteId=null,toastTimer;
  const today=()=>new Date();
  const dateLabel=d=>d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
  const month=d=>d.toLocaleDateString('en-IN',{month:'short'}).toUpperCase();
  const formatTime=t=>{const [h,m]=t.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')}`;};
  const timeRange=e=>`${formatTime(e.start)} – ${formatTime(e.end)}`;
  const longTime=e=>`${e.start} – ${e.end}`;
  const initials=name=>/\(faculty code\)/.test(name)?name.split(' ')[0].slice(0,3):name.replace(/^(Dr|Prof|Mr|Ms|Ar)\.?\s*/i,'').split(' ').slice(0,2).map(x=>x[0]).join('');
  const isSameDate=(a,b)=>a.toDateString()===b.toDateString();
  const weekDate=()=>addDays(weekStart(today()),state.week*7);
  const weekLabel=()=>{const a=weekDate(),b=addDays(a,5);return `${dateLabel(a)} – ${dateLabel(b)}, ${b.getFullYear()}`;};
  const selectedCohort=e=>e.department===state.department&&e.semester===state.semester&&e.className===state.className;
  const matchesQuery=e=>!state.query||`${e.subject} ${e.faculty} ${e.room} ${DEPARTMENTS[e.department]} ${e.className} ${e.batch||''}`.toLowerCase().includes(state.query.toLowerCase());
  const filtered=()=>cohortEntries().filter(e=>visibleInWeek(e,weekDate())&&(state.faculty==='all'||members(e).includes(state.faculty))&&(state.day==='all'||e.day===Number(state.day))&&matchesQuery(e)).sort((a,b)=>a.day-b.day||a.start.localeCompare(b.start));
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
  async function persist(){
    if(cloudMode!==false){
      if(cloudSaving||!cloudOnline||cloudRevision===null){if(cloudSnapshot)entries=JSON.parse(cloudSnapshot);toast('Shared data is not ready. Wait for connection before saving.');return false;}
      cloudSaving=true;
      try{const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessions:entries,revision:cloudRevision})});const result=await response.json();if(!response.ok)throw Error(result.error||'Could not save the shared timetable.');entries=validateDataset(result.sessions);cloudRevision=result.revision;cloudSnapshot=JSON.stringify(entries);try{localStorage.setItem(STORAGE_KEY,cloudSnapshot);}catch{}return true;}
      catch(error){if(cloudSnapshot)entries=JSON.parse(cloudSnapshot);toast(error.message);return false;}
      finally{cloudSaving=false;}
    }
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(entries));storageAvailable=true;return true;}catch{storageAvailable=false;toast('Browser storage unavailable. Export a backup.');return false;}
  }
  function go(page){if(!pages[page])return;state.page=page;state.query='';$('#search').value='';location.hash=page;$('#sidebar').classList.remove('open');render();window.scrollTo({top:0,behavior:'smooth'});}
  const option=(value,label,selected)=>`<option value="${esc(value)}" ${String(value)===String(selected)?'selected':''}>${esc(label)}</option>`;
  const selectField=(label,id,options)=>`<label class="filter-select"><span>${label}</span><select id="${id}" aria-label="${label}">${options}</select></label>`;
  function heading(eyebrow,title,subtitle,actions=''){return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${subtitle}</p></div><div><div class="heading-actions">${actions}</div></div></div>`;}
  function empty(title='A little breathing room.',description='No sessions match these filters. Try a different class or clear your search.',action=true){return `<div class="empty-state">${icon('calendar')}<h3>${title}</h3><p>${description}</p>${action?'<button class="button secondary" data-action="clear-filters">Clear filters</button>':''}</div>`;}
  function render(){
    $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===state.page));
    $('#breadcrumbTitle').textContent=pages[state.page];
    $('#roleLabel').textContent=state.isAdmin?'Administrator':studentProfile?`Sem ${studentProfile.semester} · ${studentProfile.batch||studentProfile.className}`:'Set up your timetable';
    $('#studentIdentity').textContent=studentProfile?'Roll '+studentProfile.rollNumber:'Student workspace';
    $('#studentAvatar').textContent=studentProfile?studentProfile.rollNumber.slice(-2).toUpperCase():'SS';
    $('#roleButton').textContent=state.isAdmin?'AD':studentProfile?studentProfile.rollNumber.slice(-2).toUpperCase():'SS';
    $('.nav-pill').textContent=String((studentProfile?StudentProfiles.sessionsForProfile(studentProfile,entries):cohortEntries()).filter(e=>appliesOn(e,today())&&e.type!=='holiday').length).padStart(2,'0');
    document.title=`${pages[state.page]} · Symbiosis College · SSPU Pune`;
    $('#search').placeholder=state.page==='upcoming'?'Search upcoming features…':state.page==='activities'?'Search activities…':'Search your campus…';
    $('#search').setAttribute('aria-label',state.page==='upcoming'?'Search upcoming features':state.page==='activities'?'Search published activities':'Search subjects, faculty or rooms');
    $('#main').innerHTML=({programs:renderPrograms,timetable:renderTimetable,classrooms:renderClassrooms,faculty:renderFaculty,activities:renderActivities,upcoming:renderUpcoming,admin:renderAdmin}[state.page])();
    hydrate();bindPage();upgradeUI();
  }
  function hero(){
    const now=today(),up=nextSession(cohortEntries(),now),date=now.getDate();
    let next=`<div class="next-card"><div class="next-top"><span>YOUR NEXT CLASS</span><span class="next-tag">NO UPCOMING SESSION</span></div><h3>Room for what comes next.</h3><p class="next-time">${entries.some(selectedCohort)?'This source schedule has no upcoming class.':'Upload a timetable for this program to see its classes.'}</p></div>`;
    if(up){const e=up.entry;const when=up.current?'IN SESSION':isSameDate(up.date,now)?'TODAY':isSameDate(up.date,addDays(now,1))?'TOMORROW':dateLabel(up.date).toUpperCase();next=`<div class="next-card"><div class="next-top"><span>${up.current?'HAPPENING NOW':'YOUR NEXT CLASS'}</span><span class="next-tag">${when}</span></div><h3>${esc(e.subject)}</h3><div class="next-time">${icon('clock')}${longTime(e)} · ${DAYS[e.day].slice(0,3)}</div><div class="next-bottom"><span class="next-room">${icon('pin')}${esc(e.room)}</span><button class="next-detail" data-detail="${esc(e.id)}">View details</button></div></div>`;}
    return `<div class="hero-grid"><section class="welcome-card"><div class="welcome-text"><span class="eyebrow">YOUR UNIVERSITY. YOUR SCHEDULE.</span><h2>Your week,<br><span>beautifully in sync.</span></h2><p>Real timetables. Every program.<br>Your campus day, all in one place.</p></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="orbit three"></div><i class="orbit-dot"></i><div class="art-calendar"><div class="art-cal-top"><span>${month(now)}</span><span>${now.getFullYear()}</span></div><div class="art-cal-body">${date}</div></div><span class="art-star">✳</span><span class="art-check">${icon('check')}</span></div></section>${next}</div>`;
  }
  function renderTimetable(){
    const cohort=cohortEntries(),sessions=filtered(),allCohort=entries.filter(e=>e.department===state.department);
    const faculties=[...new Set(cohort.flatMap(members))].sort();
    const semesters=[...new Set(allCohort.map(e=>e.semester))].sort((a,b)=>a-b);if(!semesters.includes(state.semester))semesters.push(state.semester);
    const sections=[...new Set(allCohort.filter(e=>e.semester===state.semester).map(e=>e.className))];if(!sections.includes(state.className))sections.push(state.className);
    const batches=[...new Set(allCohort.filter(selectedCohort).map(e=>e.batch).filter(Boolean))].sort();
    return `${heading('A CLEARER CAMPUS DAY','A good day starts here.',today().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),`<button class="button secondary print-button" data-action="print">${icon('print')}<span>Print timetable</span></button>${state.isAdmin?`<button class="button primary" data-action="add">${icon('plus')}Add session</button>`:''}`)}${studentTimetableBanner()}${hero()}${sourceNotice()}<div class="content-grid"><section class="main-panel"><div class="schedule-top"><div class="section-title"><h2>Your timetable</h2><span class="count-badge">${sessions.length} sessions</span></div><div class="view-switch" role="group" aria-label="Timetable view"><button data-view="week" class="${state.view==='week'?'active':''}" aria-pressed="${state.view==='week'}">Week</button><button data-view="list" class="${state.view==='list'?'active':''}" aria-pressed="${state.view==='list'}">List</button></div></div><div class="filter-bar real-filters">${selectField('Program','departmentFilter',programOptions(state.department))}${selectField('Semester','semesterFilter',semesters.map(v=>option(v,'Semester '+v,state.semester)).join(''))}${selectField('Class / section','classFilter',sections.map(v=>option(v,v==='General'?'Whole class':'Section '+v,state.className)).join(''))}${selectField('Practical batch','batchFilter',option('all',batches.length?'All batches':'Whole class',state.batch)+batches.map(v=>option(v,v,state.batch)).join(''))}${selectField('Faculty','facultyFilter',option('all','All faculty',state.faculty)+faculties.map(v=>option(v,v,state.faculty)).join(''))}</div><div class="schedule-controls"><div class="week-nav"><button class="icon-button" data-action="prev-week" aria-label="Previous week">${icon('chevronLeft')}</button><strong class="week-label">${weekLabel()}</strong><button class="icon-button" data-action="next-week" aria-label="Next week">${icon('chevronRight')}</button><button class="today-button" data-action="today">Today</button>${allCohort.some(e=>e.date)?'<button class="today-button" data-action="source-week">Source week</button>':''}</div><label class="sr-day"><select id="dayFilter" aria-label="Filter by weekday">${option('all','All days',state.day)+DAYS.map((d,i)=>option(i,d,state.day)).join('')}</select></label></div>${sessions.length?(state.view==='week'?calendar(sessions):listView(sessions)):emptyTimetableView()}<div class="schedule-foot"><span>${icon(storageAvailable?'check':'alert')}${cloudMode===true?(cloudOnline?'Shared timetable · connected':'Shared timetable · reconnecting'):storageAvailable?'Saved on this device':'Export a backup to keep changes'}</span><span>Exact source times · Monday–Saturday</span></div></section><aside class="side-stack">${glance(cohort)}${roomsOverview()}${eventOverview()}</aside></div><p class="print-only">Symbiosis Skills and Professional University · Kiwale, Pune | ${esc(DEPARTMENTS[state.department])} · Semester ${state.semester} · ${esc(state.className)} · ${esc(state.batch)} | Imported PDF timetable; confirm changes with the university.</p>`;
  }
  function calendar(sessions){
    const days=state.day==='all'?[0,1,2,3,4,5]:[Number(state.day)],start=weekDate();
    const programBreaks=DATA.breaks[state.department]||[];
    const boundaries=[...new Set([...sessions.flatMap(e=>[toMinutes(e.start),toMinutes(e.end)]),...programBreaks.flatMap(e=>[toMinutes(e.start),toMinutes(e.end)])])].sort((a,b)=>a-b);
    const covered=new Set(),toClock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
    let html=`<div class="calendar-scroll"><div class="calendar exact-calendar" style="--calendar-days:${days.length};grid-template-columns:51px repeat(${days.length},minmax(${days.length===1?'250':'110'}px,1fr));${days.length===1?'min-width:0;':''}"><div class="calendar-head"></div>${days.map(d=>{const date=addDays(start,d);return `<div class="calendar-head ${isSameDate(date,today())?'is-today':''}"><span>${DAYS[d].slice(0,3).toUpperCase()}</span><strong>${date.getDate()}</strong></div>`;}).join('')}`;
    boundaries.slice(0,-1).forEach((minute,row)=>{
      const next=boundaries[row+1],br=programBreaks.find(b=>toMinutes(b.start)<=minute&&toMinutes(b.end)>=next);
      const height=br?30:Math.max(72,(next-minute)*1.65);
      html+=`<div class="calendar-time ${br?'break-time':''}" style="grid-column:1;grid-row:${row+2};min-height:${height}px">${toClock(minute)}</div>`;
      days.forEach(d=>{
        const key=d+'-'+row;if(covered.has(key))return;
        const found=sessions.filter(e=>e.day===d&&toMinutes(e.start)===minute);
        let span=1;
        if(found.length){const end=Math.max(...found.map(e=>toMinutes(e.end)));const later=sessions.some(e=>e.day===d&&toMinutes(e.start)>minute&&toMinutes(e.start)<end);if(!later){span=Math.max(1,boundaries.indexOf(end)-row);for(let i=1;i<span;i++)covered.add(d+'-'+(row+i));}}
        html+=`<div class="calendar-cell ${isSameDate(addDays(start,d),today())?'is-today':''} ${br?'break-cell':''}" style="grid-column:${days.indexOf(d)+2};grid-row:${row+2} / span ${span};min-height:${height}px">${found.length?found.map(sessionCard).join(''):br?`<span>${esc(br.label)}</span>`:'<span class="calendar-empty">·</span>'}</div>`;
      });
    });
    return html+'</div></div>';
  }
  function sessionCard(e){const date=occurrence(e,weekDate()),now=today();const current=isSameDate(date,now)&&appliesOn(e,now)&&toMinutes(e.start)<=now.getHours()*60+now.getMinutes()&&toMinutes(e.end)>now.getHours()*60+now.getMinutes();return `<button class="session-card ${esc(e.type)} ${current?'current':''}" data-detail="${esc(e.id)}" aria-label="${esc(e.subject)}, ${DAYS[e.day]}, ${longTime(e)}, ${esc(e.faculty)}, room ${esc(e.room)}"><span class="session-time">${longTime(e)}${e.batch?' · '+esc(e.batch):''}</span><strong>${esc(e.subject)}</strong><span class="session-faculty">${esc(e.faculty)}</span><span class="session-room">${icon('pin')}${esc(e.room)}</span><span class="session-modality">${TYPES[e.type]}</span>${current?'<span class="now-tag">NOW</span>':''}</button>`;}
  function listView(sessions){return `<div class="day-list">${DAYS.map((day,d)=>{const es=sessions.filter(e=>e.day===d);if(!es.length)return '';const date=addDays(weekDate(),d);return `<section class="day-group"><h3>${day}, ${dateLabel(date)} ${isSameDate(date,today())?'<span>Today</span>':''}</h3>${es.map(e=>`<button class="list-session" data-detail="${esc(e.id)}"><span class="time">${longTime(e)}</span><span class="subject-type">${icon(e.type==='lecture'?'book':'code')}</span><span><strong>${esc(e.subject)}</strong><small>${esc(e.faculty)} · ${TYPES[e.type]}${e.batch?' · '+esc(e.batch):''}</small></span><span class="list-room">${esc(e.room)}</span></button>`).join('')}</section>`;}).join('')}</div>`;}
  function glance(cohort){const active=cohort.filter(e=>visibleInWeek(e,weekDate())&&e.type!=='holiday'),d=(today().getDay()+6)%7,dayEntries=active.filter(e=>appliesOn(e,today())),hours=active.reduce((n,e)=>n+(toMinutes(e.end)-toMinutes(e.start))/60,0),labs=active.filter(e=>['lab','skill','studio'].includes(e.type)).length;return `<section class="side-panel"><div class="section-title"><h2>Your week at a glance</h2>${icon('target')}</div><div class="glance-stats"><div class="glance-stat"><strong>${String(dayEntries.length).padStart(2,'0')}</strong><small>Today’s sessions</small></div><div class="glance-stat"><strong>${Number(hours.toFixed(1))}<small class="hour-unit">hrs</small></strong><small>${state.batch==='all'?'All batches':'This week'}</small></div><div class="glance-stat"><strong>${String(labs).padStart(2,'0')}</strong><small>Practical & skill</small></div></div><div class="week-activity" aria-label="Sessions per weekday">${DAYS.map((day,i)=>`<div class="activity-bar ${d===i?'today':''}" title="${day}: ${active.filter(e=>e.day===i).length} sessions"><i style="height:${Math.max(5,Math.min(100,active.filter(e=>e.day===i).length*14))}%"></i></div>`).join('')}</div><div class="activity-days">${DAYS.map(day=>`<span>${day.slice(0,3)}</span>`).join('')}</div><p class="glance-caption">${icon('info')}${state.batch==='all'?'Parallel batches can overlap in this total.':'Includes shared whole-class sessions.'}</p></section>`;}
  function isRoomBusy(room){const now=today(),minute=now.getHours()*60+now.getMinutes();return entries.find(e=>e.roomConfirmed!==false&&e.room===room&&e.type!=='holiday'&&appliesOn(e,now)&&toMinutes(e.start)<=minute&&toMinutes(e.end)>minute);}
  function miniMap(){return `<div class="mini-map" aria-label="Illustrative campus map"><div class="map-road"></div><div class="map-road second"></div><span class="map-block one"></span><span class="map-block two"></span><span class="map-block three"></span><span class="map-block four"></span><span class="map-pin">${icon('pin')}</span><span class="map-label">ACADEMIC BLOCKS · ILLUSTRATION</span></div>`;}
  function roomsOverview(){const relevant=ROOMS.filter(r=>cohortEntries().some(e=>e.rooms?.includes(r.id))).slice(0,3);return `<section class="side-panel"><div class="section-title"><h2>Your teaching spaces</h2><button class="section-link" data-page="classrooms">View all</button></div>${miniMap()}<div class="room-overview">${relevant.length?relevant.map(r=>`<button class="room-item" data-room="${esc(r.id)}" style="width:100%;text-align:left"><span class="room-icon">${icon('building')}</span><span><strong>${esc(r.id)}</strong><small>${esc(r.building)}</small></span><span class="room-status ${isRoomBusy(r.id)?'busy':''}">${isRoomBusy(r.id)?'In use':'View'}</span></button>`).join(''):'<p class="text-muted" style="margin-top:15px">Room allocation is not specified in this timetable.</p>'}</div></section>`;}
  function eventOverview(){const p=PROGRAMS.find(p=>p.id===state.department);return `<section class="side-panel upcoming-panel"><div class="section-title"><h2>From the source</h2>${icon('book')}</div><p class="text-muted">${p.sourcePages.length?'Open the original timetable to check faculty codes, elective options and notes.':'Your program is listed. Its timetable has not been supplied yet.'}</p><div class="event-bottom">${p.sourcePages.length?sourceLink(p.sourcePages[0]):'<span>Awaiting upload</span>'}<button class="section-link" data-page="programs">All programs</button></div></section>`;}
  function renderClassrooms(){const rooms=ROOMS.filter(r=>(state.building==='all'||r.building===state.building)&&(!state.query||`${r.name} ${r.building}`.toLowerCase().includes(state.query.toLowerCase())));return `${heading('THE SPACES IN YOUR SCHEDULE','Find your classroom.','Room references extracted from the uploaded PDF, with uncertain allocations kept visible.')}<div class="directory-toolbar"><div class="inline-filters">${selectField('Academic block','buildingFilter',option('all','All blocks',state.building)+[...new Set(ROOMS.map(r=>r.building))].map(v=>option(v,v,state.building)).join(''))}</div><p class="text-muted">${rooms.length} referenced spaces · Capacity was not supplied</p></div><div class="room-grid">${rooms.map(r=>{const busy=isRoomBusy(r.id),possible=entries.some(e=>e.roomConfirmed===false&&e.rooms?.includes(r.id)&&appliesOn(e,today())&&toMinutes(e.start)<=today().getHours()*60+today().getMinutes()&&toMinutes(e.end)>today().getHours()*60+today().getMinutes());return `<article class="room-card"><div class="room-card-head"><span class="room-big-icon">${icon('building')}</span><span class="room-status ${busy?'busy':''}">${busy?'Scheduled now':possible?'Allocation unclear':'No known booking now'}</span></div><h3>${esc(r.id)}</h3><p>${esc(r.building)}</p><div class="room-features"><span>${icon('info')}Capacity not supplied</span><span>${esc(r.floor)}</span></div><button class="button secondary" data-room="${esc(r.id)}">${icon('calendar')}View source bookings</button></article>`;}).join('')}</div>${rooms.length?'':empty('No spaces found.','Try another block or search.',false)}<p class="text-muted" style="margin-top:24px">Availability covers only uploaded timetables. Multiple room alternatives do not establish a confirmed booking.</p>`;}
  function facultyPortrait(f){return `<span class="faculty-portrait">${f.photo?`<img src="${esc(f.photo)}" alt="" loading="lazy" width="76" height="90">`:`<span>${esc(initials(f.name))}</span>`}</span>`;}
  function facultyStatus(f,as){return !f.official?'Timetable name only':as.some(a=>a.status==='inferred')?'Assignment inferred':'Official SSPU profile';}
  function renderUpcoming(){
    const features=[
      {title:'Lost & Found',icon:'search',category:'LOOK OUT FOR EACH OTHER',description:'Left your bottle in a classroom? Found someone’s ID card? A campus board to help belongings find their way home.',detail:'Report an item · Browse discoveries · Reconnect with its owner',color:'rose'},
      {title:'Campus Clubs',icon:'sparkles',category:'FIND YOUR PEOPLE',description:'Discover the clubs that match your interests, explore what they do, and find your next campus community.',detail:'Club profiles · Membership interest · Club updates',color:'violet'},
      {title:'Study Groups',icon:'people',category:'BETTER TOGETHER',description:'Find classmates for a revision session, a tricky assignment, or a shared goal. Make room for learning together.',detail:'Subject-based groups · Study meetups · Peer support',color:'blue'},
      {title:'Assignment & Exam Reminders',icon:'bell',category:'A LITTLE LESS LAST-MINUTE',description:'Keep important deadlines and exam dates close, with a personal view of what needs your attention next.',detail:'Due dates · Exam reminders · Personal planning',color:'amber'},
      {title:'Campus Map',icon:'pin',category:'KNOW YOUR WAY AROUND',description:'From your next classroom to your favourite campus spot, find buildings and spaces with a visual campus guide.',detail:'Building locations · Classroom lookup · Campus landmarks',color:'teal'},
      {title:'Event RSVPs',icon:'check',category:'COUNT YOURSELF IN',description:'Let organisers know you’re coming, keep track of events you’re interested in, and make more of campus life.',detail:'Interested & going · Your event list · Organiser headcounts',color:'pink'}
    ];
    const shown=features.filter(f=>!state.query||(f.title+' '+f.category+' '+f.description+' '+f.detail).toLowerCase().includes(state.query.toLowerCase()));
    return `<section class="upcoming-hero"><div><span class="eyebrow">THE NEXT CHAPTER OF CAMPUS LIFE</span><h1>More campus.<br><span>More possibilities.</span></h1><p>Your timetable is just the beginning. Here’s what we’re planning to bring to your campus workspace next.</p><span class="upcoming-hero-note">${icon('sparkles')}Shaped around student life</span></div><div class="upcoming-art" aria-hidden="true"><div class="upcoming-orbit"></div><div class="upcoming-orbit inner"></div><span class="upcoming-art-center">${icon('sparkles')}</span><span class="upcoming-art-bubble one">${icon('people')}</span><span class="upcoming-art-bubble two">${icon('pin')}</span><span class="upcoming-art-bubble three">${icon('book')}</span></div></section><div class="upcoming-section-heading"><div><span class="eyebrow">ON THE HORIZON</span><h2>Small ideas. A better campus day.</h2></div><span class="upcoming-count">${shown.length} planned feature${shown.length===1?'':'s'}</span></div><div class="upcoming-grid">${shown.map(f=>`<article class="upcoming-card ${f.color}"><div class="upcoming-card-top"><span class="upcoming-feature-icon">${icon(f.icon)}</span><span class="upcoming-status">Planned</span></div><span class="upcoming-category">${esc(f.category)}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p><div class="upcoming-feature-detail">${esc(f.detail)}</div></article>`).join('')}</div>${shown.length?'':empty('No planned features match your search.','Try a feature name such as Lost & Found or Campus Map.',false)}<div class="upcoming-footnote">${icon('info')}<p>These features are planned and are not available yet. Explore your timetable, faculty directory and campus activities while the next chapter takes shape.</p></div>`;
  }

  function renderFaculty(){
    const all=FacultyDirectory.build(entries),scoped=all.filter(f=>FacultyDirectory.inProgram(f,state.facultyDepartment));
    const visible=scoped.filter(f=>state.facultyScope==='scheduled'?FacultyDirectory.sessionsFor(f,state.facultyDepartment).length:state.facultyScope==='unresolved'?!f.official||FacultyDirectory.assignmentsFor(f,state.facultyDepartment).some(a=>a.status==='inferred'):true).filter(f=>!state.query||[f.name,f.role,...f.schoolLabels,...f.assignments.flatMap(a=>[a.label,a.entry.subject,DEPARTMENTS[a.entry.department]])].join(' ').toLowerCase().includes(state.query.toLowerCase()));
    const inferred=all.filter(f=>f.assignments.some(a=>a.status==='inferred')).length;
    return `<div class="page-heading faculty-heading"><div><span class="eyebrow">THE PEOPLE BEHIND YOUR PROGRESS</span><h1>Meet your faculty.</h1><p>Familiar faces. Full names. Your connection to the classroom.</p></div><a class="button secondary" href="${esc(FacultyDirectory.data.sourceUrl)}" target="_blank" rel="noopener noreferrer">${icon('people')}Official SSPU directory</a></div>
    <div class="faculty-summary"><div><strong>${all.filter(f=>f.official).length}</strong><span>official faculty profiles</span></div><div><strong>${all.filter(f=>f.official&&f.assignments.length).length}</strong><span>linked to uploaded timetables</span></div><div><strong>${inferred}</strong><span>assignments inferred from short names</span></div><p>Names, photos &amp; roles from SSPU.<br><span>Checked ${esc(FacultyDirectory.data.checkedOn)}</span></p></div>
    <div class="directory-toolbar faculty-toolbar"><div class="inline-filters">${selectField('Program','facultyDepartmentFilter',programOptions(state.facultyDepartment,true))}${selectField('Show','facultyScopeFilter',option('all','All faculty',state.facultyScope)+option('scheduled','With uploaded timetable',state.facultyScope)+option('unresolved','Needs confirmation',state.facultyScope))}</div><p class="text-muted">${visible.length} result${visible.length===1?'':'s'}</p></div>
    <div class="faculty-grid official-faculty-grid">${visible.map(f=>{
      const as=FacultyDirectory.assignmentsFor(f,state.facultyDepartment),es=FacultyDirectory.sessionsFor(f,state.facultyDepartment),inferred=as.some(a=>a.status==='inferred'),subjects=[...new Set(es.map(e=>e.subject))];
      return `<article class="faculty-card official-faculty-card"><div class="faculty-card-head">${facultyPortrait(f)}<div><span class="faculty-verification ${inferred||!f.official?'needs-review':''}">${facultyStatus(f,as)}</span><h3>${esc(f.name)}</h3><p>${esc(f.role)}</p></div></div><div class="faculty-school">${esc(f.schoolLabels.join(' · ')||[...new Set(as.map(a=>DEPARTMENTS[a.entry.department]))].join(' · '))}</div><div class="faculty-subjects">${subjects.length?`<span class="faculty-caption">IN YOUR TIMETABLES</span>${esc(subjects.slice(0,3).join(' · '))}${subjects.length>3?` <span class="text-muted">+${subjects.length-3} more</span>`:''}`:'<span class="text-muted">No teaching schedule for this selection in the uploaded PDF.</span>'}</div>${inferred?`<div class="faculty-inference">${esc([...new Set(as.filter(a=>a.status==='inferred').map(a=>a.label.replace(' (faculty code)','')))].join(', '))} · likely match, needs confirmation</div>`:''}<div class="faculty-footer"><span>${es.length?`${es.length} source entries`:'Official directory'}</span><div>${f.profileUrl?`<a class="faculty-profile-link" href="${esc(f.profileUrl)}" target="_blank" rel="noopener noreferrer">Profile</a>`:''}${es.length?`<button class="button secondary small" data-faculty="${esc(f.id)}">View schedule</button>`:''}</div></div></article>`;
    }).join('')}</div>${visible.length?'':empty('No faculty found.','Try another program, change the view or search for a different name.',false)}<p class="faculty-source-note">Official profiles confirm names and school membership. Timetable assignments come from your PDF; inferred matches are labelled and do not change the original schedule. Names absent from the website stay under “Needs confirmation”.</p>`;
  }
  function renderAdmin(){
    const conflicts=allConflicts(entries),es=entries.filter(matchesQuery).sort((a,b)=>a.department.localeCompare(b.department)||a.semester.localeCompare(b.semester)||a.className.localeCompare(b.className)||a.day-b.day||a.start.localeCompare(b.start));
    return `${heading('A LITTLE ORDER BEHIND THE SCENES','Keep campus in sync.','One schedule. Every room, faculty member and class accounted for.',`<button class="button primary" data-action="add">${icon('plus')}Add session</button>${state.isAdmin?'<button class="button secondary" data-student-view>Student view</button>':''}`)}<div class="admin-banner">${icon('shield')}<div><strong>${state.isAdmin?'Administrator mode is active.':'Explore the schedule manager.'}</strong><p>${state.isAdmin?'Review potential overlaps before updating shared schedules.':'Enter the organizer password to add, edit, import or delete sessions.'}</p></div>${!state.isAdmin?'<button class="button secondary small" data-action="enable-admin" style="margin-left:auto">Unlock administrator</button>':''}</div><div class="admin-stats"><div class="admin-stat"><div><strong>${entries.length}</strong><span>Scheduled sessions</span></div>${icon('calendar')}</div><div class="admin-stat"><div><strong>${new Set(entries.flatMap(e=>e.rooms||[])).size}</strong><span>Referenced spaces</span></div>${icon('building')}</div><div class="admin-stat ${conflicts.length?'conflict':''}"><div><strong>${String(conflicts.length).padStart(2,'0')}</strong><span>Potential overlaps</span></div>${icon(conflicts.length?'alert':'shield')}</div></div>${conflicts.length?`<section class="conflict-panel"><h3>${conflicts.length} potential overlap${conflicts.length===1?' needs':'s need'} review</h3>${conflicts.slice(0,100).map(c=>`<p>${esc(DAYS[c.a.day])} · ${esc(c.a.subject)} (${longTime(c.a)}) and ${esc(c.b.subject)} (${longTime(c.b)}) share ${c.reasons.join(', ')}. <button class="section-link" data-edit="${esc(c.a.id)}">Edit session</button></p>`).join('')}</section>`:''}<section class="surface"><div class="admin-toolbar"><h2>All timetable entries <span class="count-badge">${es.length}</span></h2><div class="admin-toolbar-actions"><button class="button secondary small" data-action="export-csv">${icon('download')}Export CSV</button><button class="button secondary small" data-action="export-json">${icon('download')}Backup JSON</button><button class="button secondary small" data-action="import">${icon('upload')}Import JSON</button><button class="button secondary small" data-action="scan">${icon('shield')}Check conflicts</button></div></div><div class="table-scroll"><table class="data-table"><thead><tr><th>SUBJECT & FACULTY</th><th>CLASS</th><th>DAY</th><th>TIME</th><th>ROOM</th><th>ACTIONS</th></tr></thead><tbody>${es.map(e=>`<tr><td><strong>${esc(e.subject)}</strong><small>${esc(e.faculty)}</small></td><td>${esc(DEPARTMENTS[e.department])} · ${cohortLabel(e)}</td><td>${DAYS[e.day]}</td><td>${longTime(e)}</td><td>${esc(e.room)}</td><td><button class="icon-button" data-edit="${esc(e.id)}" aria-label="Edit ${esc(e.subject)}">${icon('edit')}</button><button class="icon-button" data-delete="${esc(e.id)}" aria-label="Delete ${esc(e.subject)}">${icon('trash')}</button></td></tr>`).join('')}</tbody></table></div>${es.length?'':empty('No matching sessions.','Try another search.',false)}<p class="admin-table-note">PDF allocations may contain shared classes or unresolved assignments. Potential overlaps require verification; additions and edits are checked before saving.</p></section>`;
  }
  function bindPage(){
    const map={departmentFilter:'department',semesterFilter:'semester',classFilter:'className',batchFilter:'batch',facultyFilter:'faculty',dayFilter:'day',buildingFilter:'building',facultyDepartmentFilter:'facultyDepartment',facultyScopeFilter:'facultyScope',levelFilter:'level'};
    Object.entries(map).forEach(([id,key])=>{const el=$('#'+id);if(el)el.addEventListener('change',()=>{state[key]=el.value;if(key==='department')chooseProgram(el.value,false);if(['semester','className','batch'].includes(key)){state.faculty='all';if(key!=='batch')state.batch='all';}render();});});
  }
  function showDetails(id){const e=entries.find(e=>e.id===id);if(!e)return;detailId=id;const room=ROOMS.find(r=>r.id===e.room);$('#detailContent').innerHTML=`<span class="detail-type">${icon(e.type==='lecture'?'book':'code')}${TYPES[e.type]}${e.batch?' · '+esc(e.batch):''}</span><h2>${esc(e.subject)}</h2><div class="detail-meta"><div>${icon('calendar')}<span><small>WHEN</small><strong>${DAYS[e.day]}, ${dateLabel(e.date?parseDate(e.date):addDays(weekDate(),e.day))}</strong></span></div><div>${icon('clock')}<span><small>TIME</small><strong>${longTime(e)}</strong></span></div><div>${icon('people')}<span><small>FACULTY</small><strong>${esc(e.faculty)}</strong></span></div><div>${icon('pin')}<span><small>CLASSROOM</small><strong>${esc(e.room)}${e.roomConfirmed===false?' · allocation not confirmed':''}</strong></span></div><div>${icon('book')}<span><small>PROGRAM</small><strong>${esc(DEPARTMENTS[e.department])}</strong></span></div><div>${icon('grid')}<span><small>CLASS</small><strong>${cohortLabel(e)}</strong></span></div></div><div class="detail-note">${e.date?'Dated session: '+esc(e.date):e.monthWeeks?.length?'Repeats on 2nd and 4th Saturdays only.':'Recurring weekday schedule as supplied.'}${e.validFrom?'<br>Effective from '+esc(e.validFrom):''}${e.edited?'<br>Updated by an administrator.':''}${e.sourcePage?`<br>${sourceLink(e.sourcePage)}<details style="margin-top:12px"><summary>Original timetable cell</summary><p style="margin-top:9px;white-space:pre-wrap">${esc(e.sourceText)}</p></details>`:(e.sourceUrl?'<br><a target="_blank" rel="noopener noreferrer" href="'+esc(e.sourceUrl)+'">Open uploaded source PDF</a>':'<br>No PDF source page.')}</div><div class="dialog-actions">${state.isAdmin?`<button class="button secondary" data-edit="${esc(e.id)}">${icon('edit')}Edit session</button>`:''}<button class="button primary" data-close="detailDialog">Got it</button></div>`;$('#detailDialog').showModal();hydrate();}
  function showRoom(id){const room=ROOMS.find(r=>r.id===id);if(!room)return;const es=entries.filter(e=>e.rooms?.includes(id)||e.room===id).sort((a,b)=>a.day-b.day||a.start.localeCompare(b.start));$('#detailContent').innerHTML=`<span class="detail-type">${icon('building')}Source room reference</span><h2>${esc(room.name)}</h2><p class="text-muted" style="margin-top:9px">${esc(room.building)} · ${esc(room.floor)} · Capacity not provided</p><div class="detail-note">${isRoomBusy(id)?'Known timetable entry active now.':'No confirmed active entry in the uploaded schedules.'}<br>Alternative rooms and possible shared classes need verification.</div><h3 style="font-size:14px;margin-top:24px;margin-bottom:15px">Bookings from uploaded schedules</h3><div style="max-height:310px;overflow:auto">${es.map(e=>`<button class="list-session" data-room-session="${esc(e.id)}"><span><strong>${DAYS[e.day]} · ${longTime(e)}</strong><small>${esc(e.subject)}</small><small>${esc(DEPARTMENTS[e.department])} · ${cohortLabel(e)}${e.roomConfirmed===false?' · alternative room':''}${e.date?' · '+esc(e.date):''}</small></span></button>`).join('')}</div>`;$('#detailDialog').showModal();hydrate();}
  function showFaculty(id){
    const f=FacultyDirectory.build(entries).find(f=>f.id===id);if(!f)return;
    const es=FacultyDirectory.sessionsFor(f).sort((a,b)=>a.day-b.day||a.start.localeCompare(b.start)),as=f.assignments,inferred=as.filter(a=>a.status==='inferred');
    $('#detailContent').innerHTML=`<span class="detail-type">${icon('people')}Faculty schedule</span><div class="faculty-detail-head">${facultyPortrait(f)}<div><h2>${esc(f.name)}</h2><p class="text-muted">${esc(f.role)}${f.schoolLabels.length?' · '+esc(f.schoolLabels.join(' · ')):''}</p></div></div><div class="faculty-detail-links">${f.profileUrl?`<a class="button secondary small" href="${esc(f.profileUrl)}" target="_blank" rel="noopener noreferrer">Official faculty profile</a>`:''}<span class="text-muted">${es.length} timetable entries</span></div>${inferred.length?`<div class="detail-note faculty-inference"><strong>Teaching assignment needs confirmation</strong>${[...new Map(inferred.map(a=>[a.label,a])).values()].map(a=>`<p>${esc(a.label)}: ${esc(a.reason)}</p>`).join('')}</div>`:!f.official?'<div class="detail-note">This name or allocation appears in your PDF. No confident match was found in the current SSPU faculty lists.</div>':''}<p class="faculty-source-label">Original PDF label${new Set(as.map(a=>a.label)).size>1?'s':''}: ${esc([...new Set(as.map(a=>a.label))].join(' · '))}</p><div class="faculty-schedule-list">${es.map(e=>`<button class="list-session" data-room-session="${esc(e.id)}"><span><strong>${DAYS[e.day]} · ${longTime(e)}</strong><small>${esc(e.subject)}</small><small>${esc(e.room)} · ${esc(DEPARTMENTS[e.department])} · ${cohortLabel(e)}${e.date?' · '+esc(e.date):''}</small><small>PDF: ${esc(as.filter(a=>a.entry.id===e.id).map(a=>a.label).join('; '))}${e.sourcePage?' · p. '+e.sourcePage:''}</small></span></button>`).join('')}</div>`;
    $('#detailDialog').showModal();hydrate();
  }
  function requireAdmin(){if(cloudMode!==false&&(!cloudOnline||cloudRevision===null)){toast('Wait for the shared timetable connection before editing.');return false;}if(state.isAdmin)return true;openAdminLogin();return false;}
  function openEditor(id){
    if(!requireAdmin())return;$('#detailDialog').close();const form=$('#sessionForm');form.reset();const e=entries.find(e=>e.id===id);$('#editorTitle').textContent=e?'Edit session':'Add a session';form.elements.department.innerHTML=programOptions(e?.department||state.department);form.elements.semester.innerHTML=Array.from({length:12},(_,i)=>option(i+1,'Semester '+(i+1),e?.semester||state.semester)).join('');form.elements.type.innerHTML=Object.entries(TYPES).map(([v,l])=>option(v,l,e?.type||'lecture')).join('');form.elements.room.innerHTML=option('Not specified','Not specified',e?.room)+ROOMS.map(r=>option(r.id,r.id,e?.room)).join('');if(e?.room&&!ROOMS.some(r=>r.id===e.room)&&e.room!=='Not specified')form.elements.room.innerHTML+=option(e.room,e.room,e.room);$('#facultyOptions').innerHTML=[...new Set(entries.flatMap(members))].sort().map(f=>`<option value="${esc(f)}"></option>`).join('');if(e)form.elements.monthWeeksChoice.value=e.monthWeeks?.length?'second-fourth':'weekly';const values=e||{id:'',department:state.department,semester:state.semester,className:state.className,batch:state.batch==='all'?'':state.batch,day:state.day==='all'?Math.min((today().getDay()+6)%7,5):state.day};Object.entries(values).forEach(([k,v])=>{if(form.elements[k])form.elements[k].value=v;});$('#formMessage').classList.remove('visible');$('#formMessage').textContent='';$('#editDialog').showModal();
  }
  function deleteSession(id){if(!requireAdmin())return;const e=entries.find(e=>e.id===id);if(!e)return;deleteId=id;$('#confirmText').textContent=`This will remove ${e.subject} on ${DAYS[e.day]} (${longTime(e)}) from the recurring timetable.`;$('#confirmDialog').showModal();}
  function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportCSV(){const rows=[['Subject','Faculty','Program','Semester','Class','Batch','Day','Start','End','Room','Type','Date','Source page'],...entries.map(e=>[e.subject,e.faculty,DEPARTMENTS[e.department],e.semester,e.className,e.batch||'',DAYS[e.day],e.start,e.end,e.room,e.type,e.date||'',e.sourcePage||''])];const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/^[=+@-]/,"'$&").replace(/"/g,'""')}"`).join(',')).join('\r\n');download('symbiosis-timetable.csv','\uFEFF'+csv,'text/csv;charset=utf-8');toast('Timetable CSV downloaded.');}
  const actions={
    print:()=>window.print(),add:()=>openEditor(),
    'source-week':()=>{const first=entries.find(e=>e.department===state.department&&e.date);if(first){state.week=Math.round((weekStart(parseDate(first.date))-weekStart(today()))/604800000);render();}},
    'prev-week':()=>{state.week--;render();},'next-week':()=>{state.week++;render();},today:()=>{state.week=0;state.day='all';render();},
    'clear-filters':()=>{state.faculty='all';state.day='all';state.query='';$('#search').value='';render();},
    'enable-admin':openAdminLogin,
    'export-json':()=>{download('symbiosis-backup.json',JSON.stringify({version:2,dataVersion:DATA.version,university:'Symbiosis Skills and Professional University, Kiwale, Pune',exportedAt:new Date().toISOString(),sessions:entries},null,2),'application/json');toast('JSON backup downloaded.');},
    'export-csv':exportCSV,import:()=>{if(requireAdmin())$('#importFile').click();},
    scan:()=>{const c=allConflicts(entries);toast(c.length?`${c.length} potential overlaps found. Review the highlighted overlaps.`:'All clear. No known room, faculty or class overlaps found.');render();}
  };
  document.addEventListener('click',event=>{
    const b=event.target.closest('button,a');if(!b)return;
    if(b.dataset.program)chooseProgram(b.dataset.program);
    if(b.dataset.page){event.preventDefault();if(b.dataset.page==='timetable'&&studentProfile)applyStudentProfile();go(b.dataset.page);}
    if(b.dataset.action)actions[b.dataset.action]?.();
    if(b.dataset.view){state.view=b.dataset.view;render();}
    if(b.dataset.close)$(`#${b.dataset.close}`).close();
    if(b.dataset.detail)showDetails(b.dataset.detail);
    if(b.dataset.edit)openEditor(b.dataset.edit);
    if(b.dataset.delete)deleteSession(b.dataset.delete);
    if(b.dataset.room)showRoom(b.dataset.room);
    if(b.dataset.faculty)showFaculty(b.dataset.faculty);
    if(b.dataset.roomSession){$('#detailDialog').close();showDetails(b.dataset.roomSession);}
  });
  $('#sessionForm').addEventListener('submit',async event=>{
    event.preventDefault();if(!requireAdmin())return;
    let data=Object.fromEntries(new FormData(event.target));const wasEdit=!!data.id;const previous=entries.find(e=>e.id===data.id);data={...previous,...data,edited:true};data.id=data.id||`session-${crypto.randomUUID()}`;data.day=Number(data.day);data.subject=data.subject.trim();data.faculty=data.faculty.trim();data.facultyMembers=data.faculty.split(';').map(s=>s.trim()).filter(Boolean);data.rooms=data.room==='Not specified'?[]:data.room.split(' / ');data.roomConfirmed=data.rooms.length===1;data.className=data.className.trim()||'General';data.batch=data.batch.trim();if(!data.date)delete data.date;if(data.monthWeeksChoice==='second-fourth')data.monthWeeks=[2,4];else delete data.monthWeeks;delete data.monthWeeksChoice;
    const errors=validateEntry(data);const conflicts=errors.length?[]:conflictsFor(data,entries);
    if(conflicts.length)conflicts.forEach(({entry:e,reasons})=>{const labels=reasons.map(r=>r==='room'?`Room ${e.room}`:r==='faculty'?e.faculty:`${DEPARTMENTS[e.department]}, semester ${e.semester}, class ${e.className}`).join(', ');errors.push(`${labels} already booked for “${e.subject}” (${longTime(e)}) on ${DAYS[e.day]}.`);});
    if(errors.length){$('#formMessage').textContent=errors.join(' ');$('#formMessage').classList.add('visible');return;}
    if(wasEdit)entries=entries.map(e=>e.id===data.id?data:e);else entries.push(data);
    const saved=await persist();if(!saved){render();return;}$('#editDialog').close();render();if(saved)toast(wasEdit?'Session updated. Everyone’s week is in sync.':'Session added. No scheduling conflicts.');
  });
  $('#confirmDelete').addEventListener('click',async()=>{if(!requireAdmin())return;entries=entries.filter(e=>e.id!==deleteId);const saved=await persist();$('#confirmDialog').close();render();if(saved)toast('Session removed from the timetable.');});
  $('#importFile').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;if(!requireAdmin()){event.target.value='';return;}
    try{if(file.size>3_000_000)throw Error('Choose a backup smaller than 3 MB.');const raw=JSON.parse(await file.text()),incoming=validateDataset(Array.isArray(raw)?raw:raw.sessions);const clashes=allConflicts(incoming);entries=incoming;const saved=await persist();render();if(saved)toast(`${entries.length} sessions imported.${clashes.length?' '+clashes.length+' potential overlaps need review.':''}`);}catch(error){toast(`Could not import: ${error.message}`);}event.target.value='';
  });
  const toggleRole=()=>{if(state.isAdmin){state.isAdmin=false;fetch('/api/admin/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).catch(()=>{});render();}else openAdminLogin();};
  function openAdminLogin(){
    if(state.isAdmin)return;
    $('#adminLoginForm').reset();$('#adminLoginError').textContent='';
    $('#adminLoginDialog').showModal();$('#adminPassword').focus();
  }
  $('#adminLoginDialog').addEventListener('close',()=>$('#adminLoginForm').reset());
  $('#adminLoginForm').addEventListener('submit',async event=>{
    event.preventDefault();const button=$('#adminLoginSubmit');button.disabled=true;
    $('#adminLoginError').textContent='';
    try{
      if(location.protocol==='file:')throw Error('Open the localhost app to unlock administrator access.');
      const password=$('#adminPassword').value;
      const response=await fetch('/api/admin/unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
      const result=await response.json();
      if(!response.ok||result.authorized!==true)throw Error(result.error||'Administrator access could not be verified.');
      if(!$('#adminLoginDialog').open)return;
      state.isAdmin=true;$('#adminLoginDialog').close();render();toast('Administrator access unlocked for this visit.');
    }catch(error){$('#adminLoginError').textContent=error.message||'Cannot connect to the local server.';$('#adminPassword').value='';}
    finally{button.disabled=false;}
  });
  $('#profileButton').addEventListener('click',()=>openStudentSetup(true));$('#roleButton').addEventListener('click',()=>openStudentSetup(true));
  $('#notificationButton').addEventListener('click',()=>$('#noticesDialog').showModal());
  $('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#search').addEventListener('input',event=>{state.query=event.target.value.trim();render();});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('#search').focus();}if(event.key==='Escape')$('#sidebar').classList.remove('open');});
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(pages[page]&&page!==state.page){state.page=page;render();}});
  $$('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d){if(d.id==='studentDialog'&&!studentProfile)return;const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}}));
  window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY&&event.newValue){try{entries=validateDataset(JSON.parse(event.newValue));render();toast('Schedule synced from another tab.');}catch{}}});
  function programOptions(selected,all=false){return (all?option('all','All programs',selected):'')+[...new Set(PROGRAMS.map(p=>p.level))].map(level=>`<optgroup label="${esc(level)}">${PROGRAMS.filter(p=>p.level===level).map(p=>option(p.id,p.label+(p.sourcePages.length?'':' · awaiting timetable'),selected)).join('')}</optgroup>`).join('');}
  function cohortLabel(e){return `Sem ${e.semester} · ${e.className==='General'?'Whole class':'Section '+esc(e.className)}${e.batch?' · '+esc(e.batch):''}`;}
  function sourceLink(page,label='View source PDF'){return `<a class="section-link" href="${DATA.sourceUrl}${page?'#page='+Number(page):''}" target="_blank" rel="noopener">${label}${page?' · p.'+Number(page):''}</a>`;}
  function cohortEntries(){return entries.filter(selectedCohort).filter(e=>state.batch==='all'||!e.batch||e.batch===state.batch);}
  function sourceNotice(){const p=PROGRAMS.find(p=>p.id===state.department);return `<div class="source-notice"><div>${icon('book')}<span><strong>${p.sourcePages.length?'Imported timetable':'Timetable not uploaded yet'}</strong><small>${esc(p.notes||(p.sourcePages.length?'Taken from your uploaded timetable PDF. Open the source for the original page and notes.':'Program catalog provided by you. No timetable for this program was included in the uploaded PDF.'))}</small></span></div>${p.sourcePages.length?sourceLink(p.sourcePages[0]):''}</div>`;}

  function renderPrograms(){const ps=PROGRAMS.filter(p=>(state.level==='all'||p.level===state.level)&&(!state.query||`${p.label} ${p.category}`.toLowerCase().includes(state.query.toLowerCase())));return `${heading('ONE UNIVERSITY. EVERY POSSIBILITY.','Find your program.','Explore your complete program catalog and the timetables supplied so far.')}<div class="catalog-summary"><span><strong>20</strong> Programs with a PDF timetable</span><span><strong>14</strong> Catalog options awaiting schedules</span><span><strong>${DATA.sessions.length}</strong> Source entries imported</span></div><div class="directory-toolbar"><div class="inline-filters">${selectField('Study level','levelFilter',option('all','All levels',state.level)+[...new Set(PROGRAMS.map(p=>p.level))].map(v=>option(v,v,state.level)).join(''))}</div><p class="text-muted">${ps.length} catalog entries · Includes diploma and certificate categories</p></div><div class="program-grid">${ps.map(p=>`<article class="program-card"><div class="program-card-top"><span class="program-symbol">${icon(p.level==='Undergraduate'?'book':'target')}</span><span class="program-state ${p.sourcePages.length?'uploaded':'pending'}">${p.sourcePages.length?'Timetable uploaded':'Awaiting timetable'}</span></div><small>${esc(p.level)} · ${esc(p.category)}</small><h3>${esc(p.label)}</h3><p>${p.sourcePages.length?`Semester ${p.semester} · ${p.section==='General'?'Whole class':'Section '+p.section} · PDF page ${p.sourcePages[0]}`:'No class schedule supplied yet.'}</p><button class="button ${p.sourcePages.length?'primary':'secondary'}" data-program="${esc(p.id)}">${p.sourcePages.length?'Open timetable':'View program'}</button></article>`).join('')}</div>${ps.length?'':empty('No matching programs.','Try another name or study level.',false)}`;}
  function chooseProgram(id,navigate=true){const p=PROGRAMS.find(p=>p.id===id);if(!p)return;state.department=id;const es=entries.filter(e=>e.department===id);state.semester=es[0]?.semester||p.semester;state.className=es[0]?.className||p.section;state.batch=[...new Set(es.map(e=>e.batch).filter(Boolean))].sort()[0]||'all';state.faculty='all';state.day='all';state.week=0;if(navigate)go('timetable');}
  const EVENT_TYPES={fun:{label:'Fun & games',icon:'sparkles',description:'Games, social events and good times.'},cultural:{label:'Cultural',icon:'sparkles',description:'Music, art, dance and celebrations.'},sports:{label:'Sports & fitness',icon:'target',description:'Matches, tournaments and team spirit.'},workshop:{label:'Workshop',icon:'code',description:'Hands-on sessions organised by a club.'},club:{label:'Club meetup',icon:'people',description:'Bring your community together.'},seminar:{label:'Talk / seminar',icon:'book',description:'Conversations and invited speakers.'},competition:{label:'Competition',icon:'target',description:'A challenge worth showing up for.'},other:{label:'Other activity',icon:'calendar',description:'Something a little different.'}};
  let organizedEvents=[],eventBoardLoading=false,eventBoardLoaded=false,eventBoardError='',eventCategory='all',eventPeriod='upcoming',activityStep=1,activityDraft={},activityPublishing=false;
  async function loadOrganizedEvents(quiet=false){
    if(eventBoardLoading)return;
    eventBoardLoading=true;
    try{
      if(location.protocol==='file:')throw Error('Open http://localhost:4173 to see and publish organised activities.');
      const response=await fetch('/api/activities',{cache:'no-store'});
      const result=await response.json();
      if(!response.ok||!Array.isArray(result.activities))throw Error(result.error||'The activity board could not be loaded.');
      const changed=JSON.stringify(organizedEvents)!==JSON.stringify(result.activities)||!!eventBoardError||!eventBoardLoaded;
      organizedEvents=result.activities;eventBoardError='';eventBoardLoaded=true;eventBoardLoading=false;
      if(state.page==='activities'&&(changed||!quiet))render();
    }catch(error){eventBoardLoading=false;eventBoardLoaded=true;eventBoardError=error.message||'Could not connect to the local activity board.';if(state.page==='activities'&&!quiet)render();}
  }
  function eventEnd(event){return new Date(event.date+'T'+(event.end||'23:59'));}
  function eventDateLabel(event){return parseDate(event.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});}
  function eventTypeLabel(event){return event.type==='other'?event.customType:EVENT_TYPES[event.type]?.label||'Organised activity';}
  function renderActivities(){
    if(!eventBoardLoaded&&!eventBoardLoading)queueMicrotask(()=>loadOrganizedEvents());
    const now=new Date();
    const events=organizedEvents.filter(e=>(eventCategory==='all'||e.type===eventCategory)&&(eventPeriod==='all'||(eventPeriod==='upcoming'?eventEnd(e)>=now:eventEnd(e)<now))&&(!state.query||[e.title,e.description,e.organizer,e.venue,e.audience,eventTypeLabel(e)].join(' ').toLowerCase().includes(state.query.toLowerCase()))).sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)*(eventPeriod==='past'?-1:1));
    const upcoming=organizedEvents.filter(e=>eventEnd(e)>=now).length;
    const actions=`<button class="button primary" data-organize>${icon('plus')}Organise an activity</button>`;
    return `<div class="page-heading"><div><span class="eyebrow">GOOD PEOPLE. GREAT PLANS.</span><h1>Campus, after class.</h1><p>Discover what’s happening. Bring people together. Make a little campus history.</p></div><div class="heading-actions">${actions}</div></div><section class="event-board-hero"><div><span class="eyebrow">THE CAMPUS COMMUNITY BOARD</span><h2>A little more campus.<br><span>A lot more connection.</span></h2><p>Fun, culture, sport, conversations — find your kind of campus moment.</p><div class="event-board-count"><strong>${upcoming}</strong><span>upcoming organised ${upcoming===1?'activity':'activities'}</span></div></div><div class="event-ticket" aria-hidden="true"><span>YOU’RE INVITED</span>${icon('sparkles')}<strong>Make it<br>memorable.</strong><div class="ticket-perforation"></div><small>SYMBIOSIS · KIWALE</small></div></section><div class="directory-toolbar event-board-toolbar"><div class="inline-filters">${selectField('Activity type','eventCategoryFilter',option('all','All activities',eventCategory)+Object.entries(EVENT_TYPES).map(([id,t])=>option(id,t.label,eventCategory)).join(''))}${selectField('When','eventPeriodFilter',option('upcoming','Upcoming & happening now',eventPeriod)+option('past','Past activities',eventPeriod)+option('all','All published activities',eventPeriod))}</div><p class="text-muted">${events.length} ${events.length===1?'activity':'activities'}${state.query?' matching your search':''}</p></div>${eventBoardError?`<div class="event-board-error" role="alert">${icon('info')}<div><strong>The activity board is unavailable.</strong><p>${esc(eventBoardError)}</p></div><button class="button secondary small" data-reload-events>Try again</button></div>`:!eventBoardLoaded?'<div class="event-loading" role="status">Loading the campus activity board…</div>':events.length?`<div class="activity-grid organized-event-grid">${events.map(e=>`<article class="activity-card organized-event"><div class="activity-art ${e.type==='sports'||e.type==='club'?'purple':''}"><span class="category">${esc(eventTypeLabel(e))}</span>${icon(EVENT_TYPES[e.type]?.icon||'calendar')}<span class="event-card-date"><strong>${parseDate(e.date).getDate()}</strong><small>${month(parseDate(e.date))}</small></span></div><div class="activity-body"><small>${esc(eventDateLabel(e))} · ${esc(e.start)}${e.end?' – '+esc(e.end):''}</small><h3>${esc(e.title)}</h3><p class="event-excerpt">${esc(e.description)}</p><div class="activity-meta"><span>${icon('pin')}${esc(e.venue)}</span><span>${icon('people')}Organised by ${esc(e.organizer)}</span></div><button class="button secondary" data-event-detail="${esc(e.id)}">View activity</button></div></article>`).join('')}</div>`:`<div class="empty-state event-empty">${icon('sparkles')}<h3>${organizedEvents.length?'Nothing planned in this view.':'Your next campus memory starts here.'}</h3><p>${organizedEvents.length?'Try a different activity type or date filter.':'Be the first to organise something worth showing up for.'}</p><button class="button primary" data-organize>${icon('plus')}Organise an activity</button></div>`}<div class="event-board-note">${icon('shield')}<span>Everyone can browse published activities. The organiser password is required to publish.</span></div>`;
  }
  function showOrganizedEvent(id){
    const e=organizedEvents.find(e=>e.id===id);if(!e)return;
    $('#detailContent').innerHTML=`<span class="detail-type">${icon(EVENT_TYPES[e.type]?.icon||'sparkles')}${esc(eventTypeLabel(e))}</span><h2>${esc(e.title)}</h2><p class="organized-event-description">${esc(e.description)}</p><div class="detail-meta"><div>${icon('calendar')}<span><small>DATE</small><strong>${esc(eventDateLabel(e))}</strong></span></div><div>${icon('clock')}<span><small>TIME</small><strong>${esc(e.start)}${e.end?' – '+esc(e.end):''}</strong></span></div><div>${icon('pin')}<span><small>VENUE</small><strong>${esc(e.venue)}</strong></span></div><div>${icon('people')}<span><small>ORGANISED BY</small><strong>${esc(e.organizer)}</strong></span></div></div><div class="detail-note"><strong>Who can join?</strong><br>${esc(e.audience)}</div><div class="dialog-actions"><button class="button primary" data-close="detailDialog">Got it</button></div>`;
    $('#detailDialog').showModal();hydrate();
  }
  function collectActivityDraft(){const form=$('#activityForm');if(!form)return;const values=Object.fromEntries(new FormData(form));delete values.password;activityDraft={...activityDraft,...values};}
  function activityField(name,label,type='text',options=''){
    return `<label class="${name==='description'?'full':''}">${label}${name==='description'?`<textarea name="description" required maxlength="2000" rows="4" placeholder="What’s the plan? What should people look forward to?">${esc(activityDraft.description||'')}</textarea>`:`<input name="${name}" type="${type}" value="${esc(activityDraft[name]||'')}" ${options}>`}</label>`;
  }
  function openActivityOrganizer(){
    if(location.protocol==='file:'){toast('Open localhost:4173 to organise and publish activities.');return;}
    activityDraft={type:'fun',audience:'All students'};activityStep=1;activityPublishing=false;renderActivityWizard();$('#activityDialog').showModal();
  }
  function renderActivityWizard(){
    const labels=['Choose a type','Add the details','Review & publish'];
    const progress=labels.map((label,i)=>`<span class="${i+1===activityStep?'current':i+1<activityStep?'complete':''}"><i>${i+1<activityStep?'✓':i+1}</i>${label}</span>`).join('');
    let content='';
    if(activityStep===1)content=`<div class="organizer-intro"><h3>What are you planning?</h3><p>Pick the kind of activity you’d like to organise.</p></div><div class="activity-type-grid">${Object.entries(EVENT_TYPES).map(([id,t])=>`<label class="activity-type-choice"><input type="radio" name="type" value="${id}" ${activityDraft.type===id?'checked':''}><span class="choice-icon">${icon(t.icon)}</span><span><strong>${t.label}</strong><small>${t.description}</small></span></label>`).join('')}</div>`;
    if(activityStep===2)content=`<div class="organizer-intro"><h3>Make the plan real.</h3><p>A few details help everyone know what to expect.</p></div><input type="hidden" name="type" value="${esc(activityDraft.type)}"><div class="form-grid activity-details-form">${activityDraft.type==='other'?activityField('customType','What type of activity?','text','required maxlength="60" placeholder="e.g. Campus clean-up"'):''}${activityField('title','Activity name','text','required maxlength="100" placeholder="e.g. Friday games & good vibes"')}${activityField('organizer','Organiser / club','text','required maxlength="100" placeholder="e.g. Student Cultural Club"')}${activityField('date','Date','date','required')}${activityField('start','Starts at','time','required')}${activityField('end','Ends at (optional)','time')}${activityField('venue','Venue','text','required maxlength="160" placeholder="e.g. Open amphitheatre"')}${activityField('audience','Who can join?','text','maxlength="120" placeholder="All students"')}${activityField('description','Tell everyone about it')}</div>`;
    if(activityStep===3)content=`<div class="organizer-intro"><h3>Ready to make it happen?</h3><p>Check your activity, then enter the organiser password to publish it.</p></div><article class="activity-review"><span class="detail-type">${icon(EVENT_TYPES[activityDraft.type]?.icon||'sparkles')}${esc(activityDraft.type==='other'?activityDraft.customType:EVENT_TYPES[activityDraft.type]?.label)}</span><h3>${esc(activityDraft.title)}</h3><p>${esc(activityDraft.description)}</p><dl><div><dt>Date & time</dt><dd>${esc(eventDateLabel(activityDraft))} · ${esc(activityDraft.start)}${activityDraft.end?' – '+esc(activityDraft.end):''}</dd></div><div><dt>Venue</dt><dd>${esc(activityDraft.venue)}</dd></div><div><dt>Organiser</dt><dd>${esc(activityDraft.organizer)}</dd></div><div><dt>Who can join</dt><dd>${esc(activityDraft.audience||'All students')}</dd></div></dl></article><label class="organizer-password-label">${icon('shield')}<span>Organiser password</span><input name="password" type="password" required maxlength="128" autocomplete="off" placeholder="Enter the password to publish"></label><p class="activity-publish-note">Your activity becomes visible to everyone on this portal after publishing.</p>`;
    $('#activityWizardContent').innerHTML=`<div class="organizer-progress" aria-label="Step ${activityStep} of 3">${progress}</div><form id="activityForm" novalidate>${content}<div id="activityFormError" class="form-message" role="alert"></div><div class="dialog-actions">${activityStep>1?'<button type="button" class="button secondary" data-activity-back>Back</button>':'<button type="button" class="button secondary" data-close="activityDialog">Cancel</button>'}<button type="submit" class="button primary" id="activityContinue">${activityStep===3?icon('check')+'Publish activity':activityStep===2?'Review activity':'Continue'}</button></div></form>`;
    $('#activityForm').addEventListener('submit',submitActivityStep);hydrate();
  }
  function activityError(message){const box=$('#activityFormError');box.textContent=message;box.classList.add('visible');}
  async function submitActivityStep(event){
    event.preventDefault();if(activityPublishing)return;
    const form=event.target;
    if(activityStep<3){
      for(const input of form.querySelectorAll('input,textarea'))if(!input.reportValidity())return;
      collectActivityDraft();
      if(activityStep===2&&activityDraft.end&&activityDraft.end<=activityDraft.start){activityError('End time must be after the start time on the same day.');return;}
      activityStep++;renderActivityWizard();return;
    }
    const password=form.elements.password;
    if(!password.reportValidity())return;
    activityPublishing=true;$('#activityContinue').disabled=true;$('#activityContinue').textContent='Publishing…';
    try{
      const response=await fetch('/api/activities',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({activity:activityDraft,password:password.value})});
      password.value='';
      const result=await response.json();
      if(!response.ok)throw Error(result.error||'The activity could not be published.');
      organizedEvents=[result.activity,...organizedEvents.filter(e=>e.id!==result.activity.id)];eventBoardLoaded=true;eventBoardError='';eventCategory='all';eventPeriod=eventEnd(result.activity)<new Date()?'all':'upcoming';state.query='';$('#search').value='';
      $('#activityDialog').close();activityDraft={};render();toast('Activity published. Everyone can see it on the campus board.');
    }catch(error){password.value='';activityError(error.message||'Could not connect to the server. Your activity has not been published.');}
    finally{activityPublishing=false;const button=$('#activityContinue');if(button){button.disabled=false;button.innerHTML=icon('check')+'Publish activity';}}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-organize'))openActivityOrganizer();
    if(button.hasAttribute('data-reload-events')){eventBoardLoaded=false;eventBoardError='';loadOrganizedEvents();render();}
    if(button.hasAttribute('data-activity-back')&&!activityPublishing){collectActivityDraft();activityStep=Math.max(1,activityStep-1);renderActivityWizard();}
    if(button.dataset.eventDetail)showOrganizedEvent(button.dataset.eventDetail);
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='eventCategoryFilter'){eventCategory=event.target.value;render();}
    if(event.target.id==='eventPeriodFilter'){eventPeriod=event.target.value;render();}
  });
  $('#activityDialog').addEventListener('close',()=>{const input=$('#activityForm [name="password"]');if(input)input.value='';});
  setInterval(()=>{if(state.page==='activities'&&!document.hidden&&!activityPublishing)loadOrganizedEvents(true);},10000);

  const STUDENT_KEY=StudentProfiles.STORAGE_KEY;
  let studentProfile=null,studentSetupStep=1,studentDraft={},studentSetupEditing=false;
  try{studentProfile=StudentProfiles.validateStoredProfile(JSON.parse(localStorage.getItem(STUDENT_KEY)||'null'),entries);}catch{}
  function applyStudentProfile(){
    if(!studentProfile)return;
    state.department=studentProfile.program;state.semester=studentProfile.semester;state.className=studentProfile.className;state.batch=studentProfile.batch||'all';state.faculty='all';state.day='all';state.week=0;state.query='';
    $('#search').value='';
  }
  function viewingStudentClass(){return !!studentProfile&&state.department===studentProfile.program&&state.semester===studentProfile.semester&&state.className===studentProfile.className&&state.batch===(studentProfile.batch||'all');}
  function studentTimetableBanner(){
    if(!studentProfile)return '';
    const mine=viewingStudentClass();
    return `<section class="student-timetable-banner"><span class="student-badge">${icon('people')}</span><div><strong>${mine?'Your personal timetable':'Exploring another timetable'}</strong><p>${mine?`Roll / PRN ${esc(studentProfile.rollNumber)} · Semester ${esc(studentProfile.semester)} · ${studentProfile.className==='General'?'Whole class':'Section '+esc(studentProfile.className)}${studentProfile.batch?' · Batch '+esc(studentProfile.batch):''}`:'You can explore any schedule. Your own class and batch are saved.'}</p></div><button class="button secondary small" ${mine?'data-edit-student':'data-my-timetable'}>${mine?'Change my details':'Back to my timetable'}</button></section>`;
  }
  function openStudentSetup(editing=false){
    if($('#activityDialog').open)$('#activityDialog').close();
    if($('#editDialog').open)$('#editDialog').close();
    if($('#detailDialog').open)$('#detailDialog').close();
    studentSetupEditing=editing&&!!studentProfile;studentSetupStep=1;studentDraft=studentSetupEditing?{...studentProfile}:{};
    renderStudentSetup();$('#studentDialog').showModal();
  }
  function studentMatchNote(){
    const match=StudentProfiles.inferPlacement(studentDraft.program,studentDraft.rollNumber||'');
    if(match)return `<div class="student-placement-note matched">${icon('check')}<span><strong>We found your batch.</strong><small>Semester ${match.semester} · Section ${match.className} · ${match.batch}. Matched to the PRN range on PDF page ${match.sourcePage}.</small></span></div>`;
    if(!studentDraft.rollNumber)return '';
    return `<div class="student-placement-note">${icon('info')}<span><strong>We’ll confirm your class next.</strong><small>No matching PRN range is available for this number and program. Choose your semester, section and batch in the next step.</small></span></div>`;
  }
  function readStudentSetup(){
    const form=$('#studentSetupForm');if(!form)return;
    const data=Object.fromEntries(new FormData(form));
    if(data.sectionChoice!==undefined){data.className=data.sectionChoice==='__other'?data.customSection:data.sectionChoice;delete data.sectionChoice;delete data.customSection;}
    studentDraft={...studentDraft,...data};
  }
  function renderStudentSetup(){
    const progress=['Your program','Your roll number','Your timetable'].map((label,i)=>`<span class="${studentSetupStep===i+1?'current':studentSetupStep>i+1?'complete':''}"><i>${studentSetupStep>i+1?'✓':i+1}</i>${label}</span>`).join('');
    const program=PROGRAMS.find(p=>p.id===studentDraft.program);
    let fields='';
    if(studentSetupStep===1){
      fields=`<span class="eyebrow">LET’S MAKE THIS YOURS</span><h2>${studentSetupEditing?'Update your student details.':'Welcome to your campus day.'}</h2><p class="student-intro">Start with your department or program. We’ll help you find the timetable that belongs to you.</p><label class="student-field">Department / program<select name="program" id="studentProgram" aria-label="Department / program" required><option value="" disabled ${!studentDraft.program?'selected':''}>Choose your department / program</option>${programOptions(studentDraft.program||'')}</select></label><div class="student-privacy">${icon('shield')}<span>Your roll number and class preferences are remembered only in this browser.</span></div>`;
    }
    if(studentSetupStep===2){
      fields=`<span class="eyebrow">YOUR STUDENT DETAILS</span><h2>What’s your roll number?</h2><p class="student-intro">${esc(program?.label||'')}<br>Enter your full PRN for automatic batch matching, or your usual roll number to choose your batch manually.</p><label class="student-field">Roll number / PRN<input id="studentRoll" name="rollNumber" type="text" required maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(studentDraft.rollNumber||'')}" placeholder="Enter your roll number or full PRN"></label><div id="studentPlacementNote">${studentMatchNote()}</div><div class="student-privacy">${icon('info')}<span>Automatic matching uses only the PRN ranges printed in your timetable PDF.</span></div>`;
    }
    if(studentSetupStep===3){
      const sections=StudentProfiles.classesFor(studentDraft.program,studentDraft.semester,entries);
      const custom=studentDraft.customSection||(studentDraft.className&&!sections.includes(studentDraft.className)&&studentDraft.className!=='General');
      if(!sections.length)sections.push('General');
      const batches=StudentProfiles.batchesFor(studentDraft.program,studentDraft.semester,studentDraft.className,entries);
      const match=StudentProfiles.inferPlacement(studentDraft.program,studentDraft.rollNumber||'');
      fields=`<span class="eyebrow">A SCHEDULE THAT FITS YOU</span><h2>Confirm your class & batch.</h2><p class="student-intro">${esc(program?.label||'')}<br>Roll / PRN: ${esc(studentDraft.rollNumber)}</p><div class="form-grid student-class-form"><label>Semester<select name="semester" id="studentSemester" aria-label="Semester" required>${Array.from({length:12},(_,i)=>option(i+1,'Semester '+(i+1),studentDraft.semester)).join('')}</select></label><label>Class / section<select name="sectionChoice" id="studentSection" aria-label="Class / section" required>${sections.map(s=>option(s,s==='General'?'Whole class (no section specified)':'Section '+s,custom?'__other':studentDraft.className)).join('')}${option('__other','My class / section is not listed',custom?'__other':studentDraft.className)}</select></label>${custom?`<label class="full">Your class / section<input name="customSection" id="studentCustomSection" required maxlength="40" value="${esc(studentDraft.className)}" placeholder="e.g. B or FY B"></label>`:''}<label class="full">Practical batch${batches.length?`<select name="batch" id="studentBatch" aria-label="Practical batch" required><option value="" disabled ${!batches.includes(studentDraft.batch)?'selected':''}>Choose your practical batch</option>${batches.map(b=>option(b,b,studentDraft.batch)).join('')}</select>`:'<input type="hidden" name="batch" value=""><span class="student-whole-class">Whole-class timetable · No practical split is supplied for this class.</span>'}</label></div>${match?`<div class="student-placement-note matched">${icon('check')}<span><strong>Suggested from the uploaded PRN range</strong><small>${match.className} · ${match.batch}, PDF page ${match.sourcePage}. Check the selections above before saving.</small></span></div>`:''}<div class="student-schedule-preview" id="studentSchedulePreview">${studentSchedulePreview()}</div><div class="student-privacy">${icon('shield')}<span>These are timetable preferences, not a university login. You can change them from your profile.</span></div>`;
    }
    $('#studentSetupContent').innerHTML=`<div class="student-setup-progress">${progress}</div><form id="studentSetupForm" novalidate>${fields}<div id="studentSetupError" class="form-message" role="alert"></div><div class="student-setup-actions"><span>${studentSetupStep>1?'<button type="button" class="button secondary" data-student-back>Back</button>':studentSetupEditing?'<button type="button" class="button secondary" data-student-cancel>Cancel</button>':''}</span><button class="button primary" type="submit">${studentSetupStep===3?icon('check')+(studentSetupEditing?'Save my details':'Open my timetable'):'Continue'}</button></div>${studentSetupEditing&&studentSetupStep>1?'<button type="button" class="student-cancel-link" data-student-cancel>Cancel changes</button>':''}</form>`;
    $('#studentSetupForm').addEventListener('submit',submitStudentSetup);
    if($('#studentRoll'))$('#studentRoll').addEventListener('input',event=>{studentDraft.rollNumber=event.target.value;$('#studentPlacementNote').innerHTML=studentMatchNote();});
    if($('#studentSemester'))$('#studentSemester').addEventListener('change',event=>{readStudentSetup();studentDraft.semester=event.target.value;const sections=StudentProfiles.classesFor(studentDraft.program,studentDraft.semester,entries);studentDraft.className=sections[0]||'General';studentDraft.batch='';delete studentDraft.customSection;renderStudentSetup();});
    if($('#studentSection'))$('#studentSection').addEventListener('change',event=>{const section=event.target.value;readStudentSetup();studentDraft.className=section==='__other'?'':section;studentDraft.batch='';if(section==='__other')studentDraft.customSection=true;else delete studentDraft.customSection;renderStudentSetup();if(section==='__other')$('#studentCustomSection')?.focus();});
    if($('#studentBatch'))$('#studentBatch').addEventListener('change',event=>{studentDraft.batch=event.target.value;$('#studentSchedulePreview').innerHTML=studentSchedulePreview();});
    if($('#studentCustomSection'))$('#studentCustomSection').addEventListener('input',event=>{studentDraft.className=event.target.value;$('#studentSchedulePreview').innerHTML=studentSchedulePreview();});
    hydrate();
  }
  function studentSchedulePreview(){
    const profile={program:studentDraft.program,semester:String(studentDraft.semester),className:studentDraft.className,batch:studentDraft.batch||''};
    const batches=StudentProfiles.batchesFor(profile.program,profile.semester,profile.className,entries);
    if(batches.length&&!batches.includes(profile.batch))return '<strong>Choose your practical batch.</strong><p>We’ll include shared lectures and only the labs assigned to your selected batch.</p>';
    const sessions=StudentProfiles.sessionsForProfile(profile,entries);
    return sessions.length?`<strong>${sessions.length} timetable entries for your class${profile.batch?' and '+esc(profile.batch):''}.</strong><p>Shared whole-class sessions are included. Your timetable will open with these preferences.</p>`:'<strong>Your profile can be saved.</strong><p>No timetable has been uploaded for this program, semester and class yet. We’ll show a clear “not uploaded” message.</p>';
  }
  function submitStudentSetup(event){
    event.preventDefault();
    for(const field of event.target.querySelectorAll('input,select'))if(!field.reportValidity())return;
    const previousProgram=studentDraft.program;readStudentSetup();
    if(studentSetupStep===1){if(previousProgram!==studentDraft.program){delete studentDraft.semester;delete studentDraft.className;delete studentDraft.batch;delete studentDraft.customSection;}studentSetupStep=2;renderStudentSetup();$('#studentRoll').focus();return;}
    if(studentSetupStep===2){
      const roll=String(studentDraft.rollNumber||'').trim();
      if(!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/.test(roll)){studentSetupError('Enter your roll number or PRN without spaces.');return;}
      studentDraft.rollNumber=roll;
      const match=StudentProfiles.inferPlacement(studentDraft.program,roll),p=PROGRAMS.find(p=>p.id===studentDraft.program);
      const keepManual=studentSetupEditing&&studentProfile.assignment==='manual'&&studentProfile.program===studentDraft.program&&studentProfile.rollNumber===roll;
      if(match&&!keepManual){Object.assign(studentDraft,match);delete studentDraft.customSection;}
      else{studentDraft.semester=studentDraft.semester||p.semester;studentDraft.className=studentDraft.className||p.section;const batches=StudentProfiles.batchesFor(studentDraft.program,studentDraft.semester,studentDraft.className,entries);if(!batches.includes(studentDraft.batch))studentDraft.batch='';}
      studentSetupStep=3;renderStudentSetup();return;
    }
    try{
      const profile=StudentProfiles.createProfile(studentDraft,entries);
      let remembered=true;try{localStorage.setItem(STUDENT_KEY,JSON.stringify(profile));}catch{remembered=false;}
      studentProfile=profile;applyStudentProfile();$('#studentDialog').close();go('timetable');toast(remembered?'Your details are saved. This is your timetable.':'Your timetable is ready. This browser cannot remember the details after you leave.');
    }catch(error){studentSetupError(error.message);}
  }
  function studentSetupError(message){$('#studentSetupError').textContent=message;$('#studentSetupError').classList.add('visible');}
  function emptyTimetableView(){
    const cohort=entries.filter(selectedCohort);
    if(!cohort.length)return empty('Timetable not uploaded for this class.',`No schedule is available for semester ${esc(state.semester)}, ${state.className==='General'?'this class':'section '+esc(state.className)} yet. Your saved student details have been kept.`,false);
    if(cohort.some(e=>e.date))return empty('No classes in this week.','This PDF timetable is dated 2–7 November 2026. Choose “Source week” to view it.',false);
    return empty('No classes in this view.','Change your filters or choose a different week.');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-edit-student'))openStudentSetup(true);
    if(button.hasAttribute('data-my-timetable')){applyStudentProfile();go('timetable');}
    if(button.hasAttribute('data-student-back')){readStudentSetup();studentSetupStep=Math.max(1,studentSetupStep-1);renderStudentSetup();}
    if(button.hasAttribute('data-student-cancel')&&studentSetupEditing)$('#studentDialog').close();
    if(button.hasAttribute('data-student-view')){state.isAdmin=false;fetch('/api/admin/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).catch(()=>{});render();}
  });
  $('#studentDialog').addEventListener('cancel',event=>{if(!studentProfile)event.preventDefault();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#studentDialog').open&&!studentProfile){event.preventDefault();event.stopImmediatePropagation();}},true);
  $('#studentDialog').addEventListener('close',()=>{if(!studentProfile)queueMicrotask(()=>{if(!$('#studentDialog').open)$('#studentDialog').showModal();});});
  window.addEventListener('storage',event=>{if(event.key!==STUDENT_KEY||$('#studentDialog').open)return;try{const profile=StudentProfiles.validateStoredProfile(JSON.parse(event.newValue),entries);if(profile){studentProfile=profile;applyStudentProfile();render();}}catch{}});
  if(studentProfile)applyStudentProfile();

  let appearance={theme:'crimson',colors:{}};
  try{const saved=JSON.parse(localStorage.getItem('sspu-appearance-v1'));if(saved){appearance.theme=StudentExtras.themes.includes(saved.theme)?saved.theme:'crimson';appearance.colors=Object.fromEntries(Object.entries(saved.colors||{}).filter(([k,v])=>/^#[0-9a-f]{6}$/i.test(v)));}}catch{}
  function saveAppearance(){try{localStorage.setItem('sspu-appearance-v1',JSON.stringify(appearance));}catch{toast('Appearance cannot be saved in this browser.');}}
  function upgradeUI(){
    document.documentElement.dataset.theme=appearance.theme;
    if(state.page!=='timetable')return;
    const bar=document.createElement('div');bar.className='student-tools';bar.innerHTML='<span id="cloudStatus">Connecting to shared timetable…</span><button class="button secondary small" data-extra="style">Themes & subject colours</button><button class="button secondary small" data-extra="upload">Upload timetable</button>';
    $('#main .page-heading').after(bar);
    $$('[data-detail]').forEach(el=>{const e=entries.find(e=>e.id===el.dataset.detail),c=appearance.colors[e?.subject];if(c&&el.classList.contains('session-card')){el.style.backgroundColor=c+'22';el.style.borderLeft='4px solid '+c;el.style.color='var(--ink, #333)';}});
    cloudLabel(cloudMode===false?'Local mode · this browser':cloudOnline?'Shared timetable · connected':'Connecting to shared timetable…');
    const host=$('.next-card');if(host){host.insertAdjacentHTML('beforeend','<div class="live-countdown"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18"/><circle class="countdown-progress" cx="22" cy="22" r="18"/></svg><span id="liveCountdown" role="timer"></span></div>');tickCountdown();}
    if(!entries.some(selectedCohort))$('.empty-state')?.insertAdjacentHTML('beforeend','<button class="button primary" data-extra="upload">Upload this class timetable</button>');
  }
  function tickCountdown(){const node=$('#liveCountdown');if(!node)return;const info=StudentExtras.countdown(nextSession(cohortEntries(),today()),today());node.textContent=info.label;node.closest('.live-countdown').classList.toggle('happening',!!info.current);$('.countdown-progress').style.strokeDashoffset=113.1*(1-info.fraction);}
  setInterval(tickCountdown,1000);
  function openAppearance(){
    $('#extraContent').innerHTML=`<span class="eyebrow">MAKE IT YOURS</span><h2>Themes & subject colours</h2><p>Saved on this browser. Your university identity stays with you.</p><div class="theme-options">${StudentExtras.themes.map(t=>`<button class="theme-swatch ${appearance.theme===t?'selected':''}" data-theme-choice="${t}" aria-pressed="${appearance.theme===t}">${esc(t[0].toUpperCase()+t.slice(1))}</button>`).join('')}</div><div class="subject-colors">${[...new Set(cohortEntries().map(e=>e.subject))].sort().map(s=>`<label>${esc(s)}<input type="color" aria-label="Colour for ${esc(s)}" data-subject-color="${esc(s)}" value="${esc(appearance.colors[s]||'#e31e24')}"></label>`).join('')||'<p>No subjects yet. Upload your class timetable first.</p>'}</div><button class="button secondary" data-extra="reset-colors">Reset subject colours</button>`;
    if(!$('#extraDialog').open)$('#extraDialog').showModal();
  }
  let pendingTimetableFile=null;
  function openUpload(){pendingTimetableFile=null;if(!requireAdmin())return;
    $('#extraContent').innerHTML=`<span class="eyebrow">BRING YOUR CLASS INTO SYNC</span><h2>Upload a timetable</h2><p>${esc(DEPARTMENTS[state.department])} · Semester ${esc(state.semester)} · ${esc(state.className)} · ${esc(state.batch)}</p><p>Upload a text-based PDF grid, CSV or JSON. Review and correct the extracted rows below before adding them. Scanned PDFs need a CSV transcription.</p><input id="scheduleUpload" type="file" accept=".pdf,.csv,.json"><button class="button secondary small" data-extra="template">Download CSV template</button><p id="uploadStatus" role="status"></p><label class="upload-review">Review entries (CSV)<textarea id="uploadReview" rows="10" spellcheck="false" placeholder="day,start,end,subject,faculty,room,type,batch"></textarea></label><div id="uploadError" role="alert"></div><p>Only new entries are added. Existing classes are kept. Blank batch means the whole class; use the batch column for practical splits. Check faculty names, rooms and times against the original.</p><button class="button primary" data-extra="save-upload">Add reviewed timetable</button>`;
    $('#extraDialog').showModal();$('#scheduleUpload').addEventListener('change',readTimetableUpload);
  }
  async function readTimetableUpload(event){const file=event.target.files[0];if(!file)return;pendingTimetableFile=file;$('#uploadError').textContent='';$('#uploadStatus').textContent='Reading '+file.name+'…';try{
    if(cloudMode===true&&/\.pdf$/i.test(file.name)&&file.size>2000000)throw Error('Compress shared PDF files to less than 2 MB.');if(file.size>15e6)throw Error('Choose a file smaller than 15 MB.');let rows;
    if(/\.pdf$/i.test(file.name)){
      if(location.protocol==='file:')throw Error('Open localhost to extract PDF timetables.');
      const pdfjs=await import('./assets/pdfjs/pdf.mjs');pdfjs.GlobalWorkerOptions.workerSrc='./assets/pdfjs/pdf.worker.mjs';
      const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;rows=[];
      try{if(pdf.numPages>25)throw Error('Upload at most 25 pages at a time.');for(let n=1;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n),content=await page.getTextContent();const items=content.items.filter(x=>x.str?.trim()).map(x=>({text:x.str.trim(),x:x.transform[4],y:x.transform[5]}));
        const days=items.filter(x=>/^(mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?)$/i.test(x.text)).sort((a,b)=>a.x-b.x);
        if(days.length<2)continue;
        const lines=[];for(const item of items){let l=lines.find(l=>Math.abs(l.y-item.y)<4);if(!l){l={y:item.y,items:[]};lines.push(l);}l.items.push(item);}lines.sort((a,b)=>b.y-a.y);
        const times=lines.map(l=>{const text=l.items.sort((a,b)=>a.x-b.x).map(x=>x.text).join(' ');const m=text.match(/(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/);return m?{y:l.y,start:m[1].padStart(2,'0')+':'+m[2],end:m[3].padStart(2,'0')+':'+m[4]}:null;}).filter(Boolean);
        times.forEach((t,i)=>days.forEach((day,j)=>{const left=j?(days[j-1].x+day.x)/2:day.x-30,right=j<days.length-1?(day.x+days[j+1].x)/2:Infinity;const text=items.filter(x=>x.x>=left&&x.x<right&&x.y<=t.y+5&&x.y>(times[i+1]?.y??t.y-45)+5).sort((a,b)=>b.y-a.y||a.x-b.x).map(x=>x.text).join(' ');if(text&&!/^(lunch|break|tea|recess)$/i.test(text))rows.push({day:day.text,start:t.start,end:t.end,subject:text,faculty:'Not specified',room:'Not specified',type:'lecture',batch:state.batch==='all'?'':state.batch});}));
      }}finally{await pdf.destroy();}
      if(!rows.length)throw Error('This PDF layout could not be read reliably. Download the CSV template and fill its rows from the PDF. No classes were added.');
      $('#uploadReview').value=StudentExtras.csv(rows);$('#uploadStatus').textContent=rows.length+' candidate entries extracted. PDF cells are combined as subject text; correct subject, faculty, room, batch and times before saving.';
    }else{const text=await file.text();if(/\.json$/i.test(file.name)){const obj=JSON.parse(text);rows=Array.isArray(obj)?obj:obj.sessions;if(!Array.isArray(rows))throw Error('JSON must contain a sessions array.');$('#uploadReview').value=StudentExtras.csv(rows);}else{$('#uploadReview').value=text;StudentExtras.parse(text);}$('#uploadStatus').textContent='File ready. Review the rows, then add the timetable.';}
    $('#uploadReview').dataset.source=file.name;
    }catch(error){$('#uploadStatus').textContent='';$('#uploadError').textContent=error.message;}}
  async function saveUploadedTimetable(){if(!requireAdmin())return;try{const rows=StudentExtras.parse($('#uploadReview').value);if(!rows.length||rows.length>1000)throw Error('Provide between 1 and 1000 entries.');const incoming=rows.map(r=>({...r,id:'upload-'+crypto.randomUUID(),department:state.department,semester:state.semester,className:state.className,batch:r.batch||'',faculty:r.faculty||'Not specified',facultyMembers:(r.faculty||'Not specified').split(';').map(s=>s.trim()),room:r.room||'Not specified',rooms:r.room&&r.room!=='Not specified'?[r.room]:[],roomConfirmed:!!r.room&&r.room!=='Not specified',type:r.type||'lecture',sourceText:'Uploaded file: '+($('#uploadReview').dataset.source||'reviewed CSV'),edited:true}));for(const e of incoming){const errors=validateEntry(e);if(errors.length)throw Error(e.subject+': '+errors.join(' '));}const keys=new Set(entries.map(e=>JSON.stringify([e.department,e.semester,e.className,e.batch,e.day,e.start,e.end,e.subject])));const added=incoming.filter(e=>{const k=JSON.stringify([e.department,e.semester,e.className,e.batch,e.day,e.start,e.end,e.subject]);if(keys.has(k))return false;keys.add(k);return true;});const previous=entries;const uploadedSource=added.length?await uploadSourcePDF():null;if(uploadedSource)added.forEach(e=>e.sourceUrl=uploadedSource);entries=[...entries,...added];if(!await persist()){render();return;}$('#extraDialog').close();state.faculty='all';state.day='all';state.week=0;render();toast(added.length+' timetable entries '+(cloudMode?'shared with this class.':'saved on this browser.')+' Review overlaps in Schedule manager.');}catch(error){$('#uploadError').textContent=error.message;}}
  document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;const action=b.dataset.extra;if(action==='style')openAppearance();if(action==='upload')openUpload();if(action==='save-upload')saveUploadedTimetable();if(action==='template')download('timetable-template.csv',StudentExtras.csv([{day:'Monday',start:'09:30',end:'10:30',subject:'Subject name',faculty:'Faculty name',room:'E-101',type:'lecture',batch:''}]),'text/csv');if(action==='reset-colors'){appearance.colors={};saveAppearance();render();openAppearance();}if(b.dataset.themeChoice){appearance.theme=b.dataset.themeChoice;saveAppearance();render();openAppearance();}});
  document.addEventListener('input',event=>{const s=event.target.dataset.subjectColor;if(s&&/^#[0-9a-f]{6}$/i.test(event.target.value)){appearance.colors[s]=event.target.value;saveAppearance();render();}});

  let cloudMode=null,cloudRevision=null,cloudSnapshot=null,cloudSaving=false,cloudLoading=false,cloudOnline=false;
  function cloudLabel(text){const node=$('#cloudStatus');if(node)node.textContent=text;}
  async function refreshCloud(){
    if(cloudMode!==true||cloudLoading||cloudSaving||document.hidden)return;
    cloudLoading=true;
    try{const response=await fetch('/api/state?since='+(cloudRevision??''),{cache:'no-store'});const result=await response.json();if(!response.ok)throw Error(result.error||'Shared schedules unavailable.');
      if(!result.unchanged){const next=validateDataset(result.sessions);entries=next;cloudSnapshot=JSON.stringify(next);cloudRevision=result.revision;try{localStorage.setItem(STORAGE_KEY,cloudSnapshot);}catch{}render();}
      cloudOnline=true;cloudLabel('Shared timetable · connected');
    }catch(error){cloudOnline=false;cloudLabel('Offline · shared changes are paused');}
    finally{cloudLoading=false;}
  }
  async function startCloud(){
    try{const response=await fetch('/api/config',{cache:'no-store'});if(!response.ok)throw Error('Configuration unavailable');const config=await response.json();cloudMode=config.shared===true;
      if(!cloudMode){cloudLabel('Local mode · this browser');return;}
      await refreshCloud();
      if(window.supabase&&config.url&&config.publishableKey){const client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
        client.channel('portal-updates').on('postgres_changes',{event:'*',schema:'public',table:'portal_signal'},()=>{refreshCloud();loadOrganizedEvents(true);}).subscribe(status=>{if(status==='SUBSCRIBED'){refreshCloud();loadOrganizedEvents(true);}});
      }
    }catch{cloudMode=true;cloudOnline=false;cloudLabel('Cloud setup unavailable · editing locked');}
  }
  setInterval(()=>{if(cloudMode===true&&!document.hidden)refreshCloud();},15000);
  window.addEventListener('online',()=>{refreshCloud();loadOrganizedEvents(true);});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshCloud();if(cloudMode)loadOrganizedEvents(true);}});
  async function uploadSourcePDF(){
    if(cloudMode!==true||!pendingTimetableFile||!/\.pdf$/i.test(pendingTimetableFile.name))return null;
    const file=pendingTimetableFile;if(file.size>2000000)throw Error('Shared PDF uploads must be smaller than 2 MB. Compress this PDF first.');
    const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const response=await fetch('/api/uploads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base64:btoa(binary)})});const result=await response.json();if(!response.ok)throw Error(result.error||'Could not store the source PDF.');return result.sourceUrl;
  }

  render();
  startCloud();
  if(!studentProfile)openStudentSetup();
})();
