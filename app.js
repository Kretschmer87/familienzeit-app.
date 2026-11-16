/* Familienzeit 0.7 – gemeinsame Termine via Supabase. Die Solo-Demo bleibt als separate HTML-Datei erhalten. */
import {connect,api,auth,fetchAll,createEvent,respond,nudge,editEvent,addComment,addAlternative,markRead,watchChanges} from './backend.js';
const PEOPLE = [
  {id:'martin',name:'Martin',account:true,colors:['#8cbef1','#4787d0']},
  {id:'stephanie',name:'Stephanie',account:true,colors:['#e8adc8','#b678a9']},
  {id:'fynn',name:'Fynn',account:false,colors:['#b1d4af','#6caa91']},
  {id:'sonja',name:'Sonja',account:true,colors:['#e9b09e','#d48786']},
  {id:'mirco',name:'Mirco',account:true,colors:['#92b0d8','#7a8fc5']},
  {id:'bela',name:'Bela',account:false,colors:['#e7ca91','#cda66c']},
  {id:'ella',name:'Ella',account:false,colors:['#c4b5ea','#9d8dd2']},
  {id:'holger',name:'Holger',account:true,colors:['#9ec2d5','#7196b1']},
  {id:'ivonne',name:'Ivonne',account:true,colors:['#a9d9cb','#79b8ae']},
  {id:'susanne',name:'Susanne',account:true,colors:['#eab8cf','#ba8caf']}
];
const ACCOUNT_IDS=['martin','stephanie','sonja','mirco','holger','ivonne','susanne'];
const ALL_PEOPLE=[...PEOPLE].sort((a,b)=>a.name.localeCompare(b.name,'de'));
// Kategorien sind explizite Nutzereingaben. Für alte lokale Termine gibt es einen lesenden Fallback.
const CATEGORIES=[
 {id:'coffee',label:'Kaffee & Kuchen',icon:'coffee'},
 {id:'birthday',label:'Geburtstag',icon:'gift'},
 {id:'dining',label:'Gemeinsam essen',icon:'utensils'},
 {id:'gathering',label:'Familientreffen',icon:'users'},
 {id:'party',label:'Feier',icon:'party'},
 {id:'trip',label:'Ausflug',icon:'car'},
 {id:'holiday',label:'Feiertage',icon:'tree'},
 {id:'other',label:'Sonstiges',icon:'calendar'}
];
const KEY='familienzeit.demo.0.1';
const deepCopy=o=>JSON.parse(JSON.stringify(o));
const E=(id,title,date,time,host,place,description,due,responses={})=>({
 id,title,date,time,host,place,description,due,
 category:({e1:'dining',e2:'holiday',e3:'coffee'})[id]||'other',
 teaser:({e1:'Sonja lädt zum gemeinsamen Abendessen ein.',e2:'Holger und Ivonne freuen sich auf einen schönen Abend.',e3:'Martin lädt zu Kaffee und Kuchen ein.'})[id]||'',
 invitees:PEOPLE.map(p=>p.id),responses,comments:[{id:'c'+id,author:host,text:'Wir freuen uns auf euch!',created:'2026-11-15T17:20:00'}],proposals:[],history:[],nudges:{},cancelled:false,created:'2026-11-16T06:40:00'
});
function demoSeed(){return {version:1,events:[
  E('e1','Familienessen','2026-11-28','18:00','sonja','Bei Sonja','Gemeinsam essen und den Abend verbringen.','2026-11-23',{
    sonja:{status:'yes',people:['sonja','mirco','bela','ella']},holger:{status:'yes',people:['holger','ivonne']}
  }),
  E('e2','Weihnachtsessen','2026-12-12','17:00','holger','Bei Holger und Ivonne','Adventlicher Abend mit der ganzen Familie.','2026-11-30',{
    holger:{status:'yes',people:['holger','ivonne']},martin:{status:'yes',people:['martin','stephanie','fynn']}
  }),
  E('e3','Adventskaffee','2026-12-20','15:30','martin','Bei Martin','Kaffee, Kuchen und Zeit für die Familie.','2026-12-10',{
    martin:{status:'yes',people:['martin','stephanie','fynn']}
  })],notifications:[]};}
let data={version:2,events:[],notifications:[]};
let activeId='';
let loginState='loading',authUser=null,personIdByLocal={},localIdByPerson={},userIdByLocal={},localIdByUser={};
let refreshTimer=null,unwatch=null,changing=false;
let page='home',modal=null,detailId=null,daySelected=today(),monthCursor=new Date(new Date().getFullYear(),new Date().getMonth(),1),statusFilter='all';
const $=q=>document.querySelector(q), app=$('#app'), overlay=$('#overlay-root');
function save(){/* Kein lokaler Schreibzugriff im Echtbetrieb. */}
const person=id=>PEOPLE.find(p=>p.id===id)||{id,name:id,colors:['#a7b6c7','#60758c']};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(date,opts={day:'numeric',month:'long',year:'numeric'})=>new Date(`${date}T12:00:00`).toLocaleDateString('de-DE',opts);
const dayNum=date=>new Date(`${date}T12:00:00`).toLocaleDateString('de-DE',{day:'2-digit'});
const shortMonth=date=>new Date(`${date}T12:00:00`).toLocaleDateString('de-DE',{month:'short'}).replace('.','').toUpperCase();
const weekday=date=>new Date(`${date}T12:00:00`).toLocaleDateString('de-DE',{weekday:'short'}).replace('.','');
const stamp=()=>new Date().toISOString();
function icon(name,size=20){const paths={
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.2 8.1a1 1 0 0 0 1.4 0l8.1-8.1a5.5 5.5 0 0 0 0-7.8Z"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.5a4 4 0 0 1 0 7.9M22 21v-2a4 4 0 0 0-3-3.9"/><circle cx="9" cy="7" r="4"/>',
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  map:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  send:'<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
  edit:'<path d="M12 20h9M16 4l4 4-12 12H4v-4L16 4Z"/>',
  refresh:'<path d="M20 11a8 8 0 1 1-2-5.5L20 8M20 3v5h-5"/>',
  alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
  message:'<path d="M20 11.5a7.9 7.9 0 0 1-8 8.5 9 9 0 0 1-4-.9L3 21l1.7-5A8.4 8.4 0 0 1 4 12a8 8 0 0 1 8-8c4.4 0 8 3.2 8 7.5Z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  trash:'<path d="M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 19v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M21 19v-2a5 5 0 0 0-3-4.6"/>',
  spark:'<path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2ZM20 18v4M18 20h4"/>',
  logout:'<path d="M10 17l5-5-5-5M15 12H3M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 13h4"/>',
  gift:'<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M12 10v11M3 14h18M2 7h20v4H2zM12 7C6 7 6 2 9 2c2.5 0 3 5 3 5Zm0 0c6 0 6-5 3-5-2.5 0-3 5-3 5Z"/>',
  coffee:'<path d="M4 9h13v5a6.5 6.5 0 0 1-13 0V9Zm13 1h2a3 3 0 1 1 0 6h-2M2 21h18M8 3v3M13 3v3"/>',
  utensils:'<path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M20 3c-3 0-4 4-4 8v3h4V3Zm0 11v7"/>',
  party:'<path d="m5 21 3.6-14.3L18 17l-13 4Z M10 6l2-3M17 5l3-2M19 11l3 1M14 2h.01M20 20h.01"/>',
  car:'<path d="M5 17h14l1-6-2-5H6l-2 5 1 6Zm0 0v3M19 17v3M5 12h14M7.5 14.5h.01M16.5 14.5h.01"/>',
  tree:'<path d="m12 2 7 9h-4l5 7H4l5-7H5l7-9ZM12 18v4"/>'
};return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.info}</svg>`;}
function avatar(id,cls=''){const p=person(id);return `<span class="avatar ${cls}" aria-hidden="true" style="--avatar-1:${p.colors[0]};--avatar-2:${p.colors[1]}">${safe(p.name.slice(0,2).toUpperCase())}</span>`;}
const sorted=()=>[...data.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
const counts=ev=>({total:new Set(Object.values(ev.responses).filter(r=>r.status==='yes').flatMap(r=>r.people||[])).size,accepted:Object.values(ev.responses).filter(r=>r.status==='yes').length,pending:ACCOUNT_IDS.filter(id=>ev.invitees.includes(id)&&!ev.responses[id]).length});
const response=ev=>ev.responses[activeId]?.status||'pending';
const statusLabel=s=>({yes:'Zugesagt',no:'Abgesagt',maybe:'Vielleicht',pending:'Antwort offen',cancelled:'Abgesagt'})[s]||s;
function notification(to,title,body,ev){data.notifications.unshift({id:'n'+Math.random().toString(36).slice(2),to,title,body,ev,created:stamp(),read:false});}
function notifyAll(ev,title,body){for(const id of ACCOUNT_IDS){if(id!==activeId&&ev.invitees.includes(id))notification(id,title,body,ev.id);}}
function toast(t){const n=$('#toast-root');n.innerHTML=`<div class="toast">${safe(t)}</div>`;setTimeout(()=>{if(n)n.innerHTML=''},3600);}
function categoryFor(ev){
 const selected=CATEGORIES.find(c=>c.id===ev.category);if(selected)return selected;
 const title=String(ev.title||'').toLowerCase();
 const fallback=/weihnacht|ostern|feiertag/.test(title)?'holiday':/geburtstag|geschenk/.test(title)?'birthday':/kaffee|kuchen|tee/.test(title)?'coffee':/essen|frühstück|brunch|grillen/.test(title)?'dining':/ausflug|wander|fahrt/.test(title)?'trip':'gathering';
 return CATEGORIES.find(c=>c.id===fallback);
}
function eventIcon(ev){return categoryFor(ev).icon;}
function categoryPicker(selected='gathering'){
 return `<fieldset class="category-field"><legend>Was für ein Treffen?</legend><div class="category-grid">${CATEGORIES.map(c=>`<label class="category-option"><input type="radio" name="category" value="${c.id}" ${selected===c.id?'checked':''} required><span class="category-face"><span class="category-icon">${icon(c.icon,32)}</span><span class="category-label">${safe(c.label)}</span></span></label>`).join('')}</div></fieldset>`;
}
function statusHTML(ev){const s=ev.cancelled?'cancelled':response(ev);return `<span class="status ${s}">${icon(s==='yes'?'check':s==='cancelled'?'x':s==='pending'?'clock':'info',18)} ${statusLabel(s)}${s==='yes'?` · ${(ev.responses[activeId]?.people||[]).length} Pers.`:''}</span>`;}
function eventCard(ev){const c=counts(ev),cat=categoryFor(ev);return `<button class="event-card ${ev.cancelled?'cancelled':''}" type="button" data-action="detail" data-id="${safe(ev.id)}" aria-label="${safe(ev.title)}, ${safe(fmt(ev.date))}, ${safe(ev.time)} Uhr, Einladung von ${safe(person(ev.host).name)}"><div class="event-primary"><div class="date-tile"><span class="month">${shortMonth(ev.date)}</span><span class="day">${dayNum(ev.date)}</span><span class="weekday">${weekday(ev.date)}</span><span class="event-symbol" aria-label="${safe(cat.label)}" title="${safe(cat.label)}">${icon(eventIcon(ev),29)}</span></div><div class="event-content"><div class="event-meta">${icon('clock',20)} ${safe(ev.time)} Uhr</div><div class="event-title-line"><div class="event-title">${safe(ev.title)}</div></div><div class="host-line">${avatar(ev.host,'sm')} ${safe(person(ev.host).name)} lädt ein</div>${statusHTML(ev)}</div></div>${ev.teaser?`<p class="event-teaser">${safe(ev.teaser)}</p>`:''}<div class="card-footer"><span class="footer-left"><span class="detail-piece">${icon('people',21)} ${c.total} Personen</span><span class="detail-piece">${icon('message',21)} ${ev.comments.length}</span></span><span class="chevron-bubble">${icon('chevron',23)}</span></div></button>`;}
function header(){let newNotifs=data.notifications.filter(n=>n.to===activeId&&!n.read).length;return `<header class="app-header"><div class="brand"><div class="brand-mark">${icon('heart',27)}</div><div><div class="brand-name">Familienzeit</div></div></div><div class="header-right"><button class="icon-btn" data-action="notifications" aria-label="Mitteilungen anzeigen">${icon('bell',28)}${newNotifs?'<span class="dot"></span>':''}</button><button class="avatar-button" data-action="accounts" aria-label="Mein Konto">${avatar(activeId)}</button></div></header>`;}
function nav(){return `<nav class="bottom-nav" aria-label="Hauptnavigation"><button class="nav-item ${page==='home'?'active':''}" data-action="page" data-page="home">${icon('home',30)}<span>Start</span></button><button class="nav-item ${page==='calendar'?'active':''}" data-action="page" data-page="calendar">${icon('calendar',30)}<span>Kalender</span></button><button class="nav-item create" data-action="create">${icon('plus',32)}<span>Neu</span></button><button class="nav-item ${page==='family'?'active':''}" data-action="page" data-page="family">${icon('users',30)}<span>Familie</span></button></nav>`;}
function home(){const upcoming=sorted().filter(e=>e.date>=today()&&!e.cancelled);const pending=upcoming.filter(e=>e.invitees.includes(activeId)&&response(e)==='pending');const visible=statusFilter==='pending'?pending:statusFilter==='mine'?upcoming.filter(e=>e.invitees.includes(activeId)):upcoming;return `<section class="hero"><h1 class="hero-title">Zeit <em>füreinander.</em></h1><p class="hero-desc">Hallo ${safe(person(activeId).name)}! Hier siehst du eure nächsten Termine.</p><span class="hero-art" aria-hidden="true">${icon('heart',39)}</span></section><button class="callout glass" style="width:100%;text-align:left;border:1px solid white" data-action="pending"><span class="callout-icon">${icon('bell',25)}</span><span style="flex:1"><h3>${pending.length?`${pending.length} ${pending.length===1?'Rückmeldung':'Rückmeldungen'} offen`:'Alles beantwortet!'}</h3><p>${pending.length?'Hier wird noch deine Antwort benötigt.':'Du hast auf alle Einladungen geantwortet.'}</p></span><span class="callout-arrow">${icon('chevron',21)}</span></button><div class="section-heading"><h2>Nächste Termine</h2><button class="text-btn" data-action="filter">${statusFilter==='all'?'Alle anzeigen':statusFilter==='pending'?'Nur offene':'Meine Termine'} ${icon('down',13)}</button></div><section class="event-list">${visible.length?visible.map(eventCard).join(''):'<div class="empty">Keine passenden Termine vorhanden.</div>'}</section>`;}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function monthString(){return monthCursor.toLocaleDateString('de-DE',{month:'long',year:'numeric'});}
function calendar(){let year=monthCursor.getFullYear(),month=monthCursor.getMonth(),first=(new Date(year,month,1).getDay()+6)%7,days=new Date(year,month+1,0).getDate();let cells='';for(let i=0;i<first;i++)cells+='<div class="date-button blank"></div>';for(let d=1;d<=days;d++){const iso=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,has=data.events.some(e=>e.date===iso);cells+=`<button class="date-button ${iso===daySelected?'selected':''} ${iso===today()?'today':''}" data-action="day" data-date="${iso}" aria-label="${fmt(iso)}${has?', Termine vorhanden':''}">${d}${has?'<span class="date-dot"></span>':'<span style="height:5px"></span>'}</button>`;}const dayEvents=sorted().filter(e=>e.date===daySelected);return `<div class="page-intro"><p class="eyebrow">ALLE TERMINE</p><h1>Kalender</h1><p>Tippe auf einen Tag, um zu sehen, was geplant ist.</p></div><section class="calendar-box glass"><div class="month-head"><h2>${safe(monthString())}</h2><div class="month-arrows"><button class="round-btn" aria-label="Vorheriger Monat" data-action="prev-month">${icon('left')}</button><button class="round-btn" aria-label="Nächster Monat" data-action="next-month">${icon('chevron')}</button></div></div><div class="week-grid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(s=>`<div class="weekday-head">${s}</div>`).join('')}</div><div class="dates-grid">${cells}</div></section><section class="day-events"><div class="section-heading"><h2>${safe(fmt(daySelected,{weekday:'long',day:'numeric',month:'long'}))}</h2></div><div class="event-list">${dayEvents.length?dayEvents.map(eventCard).join(''):'<div class="empty">Für diesen Tag ist noch nichts geplant.</div>'}</div></section>`;}
function family(){return `<div class="page-intro"><h1>Alle Personen</h1><p>${ACCOUNT_IDS.length} App-Nutzer · ${PEOPLE.length-ACCOUNT_IDS.length} Personen ohne eigenes Login.</p></div><section class="family-card glass"><div class="family-heading"><h2>${icon('users',27)} Personen</h2><span class="count-chip">${PEOPLE.length} insgesamt</span></div>${ALL_PEOPLE.map(p=>`<div class="family-member">${avatar(p.id,'lg')}<div class="person-info"><div class="member-name">${safe(p.name)}${p.id===activeId?' <span class="you-marker">(Du)</span>':''}</div>${p.account?`<div class="member-sub">${icon('check',17)} App-Nutzer</div>`:''}</div></div>`).join('')}</section><div class="demo-ribbon">${icon('info',22)} Profilbilder können wir später für jede Person ergänzen.</div>`;}
function render(){
 if(loginState!=='ready'){app.innerHTML=loginScreen();overlay.innerHTML='';return;}
 app.innerHTML=`<div class="app-shell">${header()}<main>${page==='home'?home():page==='calendar'?calendar():family()}</main></div>${nav()}`;
 if(modal)renderModal();
}
function openModal(type,id){modal=type;detailId=id||null;overlay.innerHTML='';renderModal();document.body.style.overflow='hidden';}
function closeModal(){modal=null;overlay.innerHTML='';document.body.style.overflow='';render();}
const sheet=(title,body)=>`<div class="overlay" data-action="close-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-label="${safe(title)}"><div class="sheet-handle"></div><div class="sheet-head"><h2>${safe(title)}</h2><button class="sheet-close" type="button" aria-label="Schließen" data-action="close">${icon('x',21)}</button></div>${body}</section></div>`;
function groupChecks(selected,field='invitees'){return `<div class="panel selection-panel"><div class="panel-title">${icon('users',25)} Personen auswählen</div>${ALL_PEOPLE.map(p=>`<label class="person-check"><span class="person-label">${avatar(p.id,'sm')}<span>${safe(p.name)}${p.id===activeId&&field==='invitees'?' (Du)':''}</span></span><input class="check" type="checkbox" name="${field}" value="${safe(p.id)}" ${selected.includes(p.id)?'checked':''} ${p.id===activeId&&field==='invitees'?'disabled':''} aria-label="${safe(p.name)} auswählen"></label>`).join('')}</div>`;}
function minTomorrow(){const d=new Date();d.setDate(d.getDate()+1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function createForm(){const due=minTomorrow(),suggestDate=new Date();suggestDate.setDate(suggestDate.getDate()+14);const future=`${suggestDate.getFullYear()}-${String(suggestDate.getMonth()+1).padStart(2,'0')}-${String(suggestDate.getDate()).padStart(2,'0')}`;return `<form id="create-form"><p class="small-desc">Die Einladung wird mit allen Familienmitgliedern synchronisiert.</p>${categoryPicker()}<div class="field"><label for="new-title">Was ist geplant?</label><input id="new-title" class="input" name="title" placeholder="z. B. Familienfrühstück" required maxlength="100" autofocus></div><div class="field-row"><div class="field"><label for="new-date">Datum</label><input id="new-date" class="input" type="date" name="date" min="${today()}" value="${future}" required></div><div class="field"><label for="new-time">Uhrzeit</label><input id="new-time" class="input" type="time" name="time" value="15:00" required></div></div><div class="field"><label for="new-teaser">Kurzer Einladungssatz (optional)</label><input id="new-teaser" class="input" name="teaser" maxlength="90" placeholder="z. B. Martin lädt zu Kaffee und Kuchen ein."><p class="input-hint">Bis zu 90 Zeichen · erscheint auf der Startseite</p></div><div class="field"><label for="new-location">Ort / Adresse</label><input id="new-location" class="input" name="place" placeholder="z. B. Bei Martin" maxlength="160"></div><div class="field"><label for="new-description">Beschreibung (optional)</label><textarea id="new-description" class="input" name="description" placeholder="Gibt es etwas Wichtiges zu wissen?" maxlength="1200"></textarea></div><h3>Wer ist eingeladen?</h3><p class="small-desc">Du wirst automatisch eingeladen. Weitere Personen lassen sich einzeln auswählen.</p>${groupChecks(PEOPLE.map(p=>p.id))}<h3>Antwortfrist</h3><div class="field"><label for="new-due">Bitte antworten bis</label><input id="new-due" class="input" type="date" name="due" value="${due}" required></div><button class="solid-btn" type="submit" style="width:100%">${icon('plus',20)} Termin erstellen</button></form>`;}
function attendResponseLabels(ev){return ACCOUNT_IDS.filter(p=>ev.invitees.includes(p)).map(id=>{const r=ev.responses[id]||{status:'pending',people:[]};return `<div class="family-member">${avatar(id,'sm')}<div><div class="member-name">${safe(person(id).name)}</div><div class="member-sub">${safe(statusLabel(r.status))}${r.status==='yes'?` · ${(r.people||[]).map(p=>person(p).name).join(', ')}`:''}</div></div>${r.status==='pending'&&ev.host===activeId&&id!==activeId?`<button class="pill-btn right" data-action="nudge" data-id="${safe(ev.id)}" data-to="${id}">Stupser</button>`:''}</div>`;}).join('')}
function RSVPPanel(ev){const invited=ev.invitees.includes(activeId),r=ev.responses[activeId],s=r?.status||'pending';if(!invited)return '<p class="small-desc">Du bist nicht persönlich eingeladen.</p>';if(ev.cancelled)return '<p class="small-desc">Der Termin wurde abgesagt. Eine Rückmeldung ist nicht mehr möglich.</p>';const companionIds=ALL_PEOPLE.filter(p=>p.id!==activeId).map(p=>p.id);const selected=r?.people||[activeId];return `<div class="panel"><div class="panel-title">Deine Rückmeldung</div>${!r?'<p class="small-desc">Du hast auf diesen Termin noch nicht geantwortet.</p>':`<p class="small-desc">Aktueller Status: <b>${statusLabel(s)}</b>. Du kannst ihn jederzeit ändern.</p>`}<div class="rsvp-buttons"><button type="button" data-action="rsvp" data-id="${ev.id}" data-response="yes" class="${s==='yes'?'active':''}">${icon('check',28)} Zusagen</button><button type="button" data-action="rsvp" data-id="${ev.id}" data-response="maybe" class="${s==='maybe'?'active':''}">${icon('info',28)} Vielleicht</button><button type="button" data-action="rsvp" data-id="${ev.id}" data-response="no" class="${s==='no'?'active':''}">${icon('x',28)} Absagen</button></div>${s==='yes'?`<h3>Wer kommt mit?</h3><p class="small-desc">Du bist automatisch dabei. Weitere Personen kannst du auswählen. App-Nutzer können zusätzlich selbst auf Einladungen antworten. Jede Person wird höchstens einmal gezählt.</p>${companionIds.map(id=>`<label class="person-check"><span>${avatar(id,'sm')} <span style="font-weight:700">${safe(person(id).name)}</span></span><input type="checkbox" class="check" data-action="companion" data-event="${ev.id}" data-person="${id}" ${selected.includes(id)?'checked':''}></label>`).join('')}<div class="sub-panel" style="margin-top:12px"><strong>${new Set(selected).size} Personen</strong> in deiner Zusage erfasst.</div>`:''}</div>`;}
function detail(ev){const total=counts(ev),hasPlace=!!ev.place;const maps=hasPlace?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.place)}`:'';return `<div class="detail-header"><span class="detail-category">${icon(eventIcon(ev),24)} ${safe(categoryFor(ev).label)}</span><span class="overline">${safe(fmt(ev.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase())}</span><h2>${safe(ev.title)}</h2>${ev.cancelled?'<span class="status cancelled">Termin abgesagt</span>':`<span class="status ${response(ev)}">${statusLabel(response(ev))}</span>`}</div>${ev.teaser?`<p class="detail-teaser">${safe(ev.teaser)}</p>`:''}<div class="detail-info"><div class="info-line">${icon('clock',20)} ${safe(ev.time)} Uhr · ${safe(fmt(ev.date))}</div><div class="info-line">${icon('people',20)} Gastgeber: ${safe(person(ev.host).name)}</div>${hasPlace?`<div class="info-line">${icon('map',20)} <span>${safe(ev.place)}<div style="margin-top:3px"><a class="link-button" href="${maps}" target="_blank" rel="noopener noreferrer">In Google Maps öffnen ↗</a></div></span></div>`:''}${ev.description?`<div class="info-line">${icon('info',20)} ${safe(ev.description)}</div>`:''}<div class="info-line">${icon('calendar',20)} Antwortfrist: ${safe(fmt(ev.due))}</div></div>${RSVPPanel(ev)}<div class="panel"><div class="panel-title">Teilnehmer · ${total.total} Personen zugesagt</div>${attendResponseLabels(ev)}</div>${ev.proposals?.length?`<div class="panel"><div class="panel-title">Alternativvorschläge</div>${ev.proposals.map((p,i)=>`<div class="family-member" style="align-items:flex-start"><div>${avatar(p.author,'sm')}</div><div style="flex:1"><div class="member-name">${safe(fmt(p.date))}, ${safe(p.time)} Uhr</div><div class="member-sub">Vorgeschlagen von ${safe(person(p.author).name)}</div></div>${ev.host===activeId&&!ev.cancelled?`<button class="pill-btn" data-action="accept-proposal" data-id="${ev.id}" data-index="${i}">Übernehmen</button>`:''}</div>`).join('')}</div>`:''}<div class="action-row">${!ev.cancelled?`<button class="outline-btn" data-action="propose" data-id="${ev.id}">${icon('calendar',18)} Alternativtermin</button>`:''}</div>${ev.host===activeId&&!ev.cancelled?`<div class="panel"><div class="panel-title">Gastgeber-Aktionen</div><button class="outline-btn" style="width:100%" data-action="edit" data-id="${ev.id}">${icon('edit',17)} Termindetails bearbeiten</button><div class="action-row"><button class="outline-btn" data-action="reschedule" data-id="${ev.id}">${icon('calendar',17)} Verschieben</button><button class="outline-btn danger-btn" data-action="cancel" data-id="${ev.id}">${icon('x',17)} Absagen</button></div><p class="small-desc">Beim Verschieben müssen alle erneut zusagen. Alle erhalten eine Mitteilung in der App. Push-Benachrichtigungen folgen später.</p></div>`:''}<div class="panel"><div class="panel-title">Kommentare · ${ev.comments.length}</div>${ev.comments.map(c=>`<div class="comment">${avatar(c.author,'sm')}<div class="comment-body"><span class="comment-name">${safe(person(c.author).name)}</span><span class="comment-date">${fmt(c.created.slice(0,10),{day:'numeric',month:'short'})}</span><div class="comment-text">${safe(c.text)}</div></div></div>`).join('')||'<p class="entry-empty">Noch keine Kommentare.</p>'}${!ev.cancelled?`<form data-form="comment" data-id="${ev.id}" class="field" style="margin-top:13px"><label for="comment-text">Kommentar hinzufügen</label><textarea id="comment-text" class="input" name="text" required maxlength="1000" placeholder="Schreibe einen Kommentar ..."></textarea><button class="solid-btn" type="submit">${icon('send',17)} Kommentar senden</button></form>`:''}</div>${ev.history?.length?`<div class="panel"><div class="panel-title">Änderungsverlauf</div>${ev.history.map(h=>`<div class="history">${safe(h)}</div>`).join('')}</div>`:''}`;}
function accountOptions(){return `<div class="account-option current">${avatar(activeId)}<span>${safe(person(activeId).name)} · angemeldet</span>${icon('check',19)}</div><p class="small-desc">Dein Konto wird automatisch erkannt. Alle sieben Erwachsenen können ihre eigenen Termine verwalten.</p><button class="outline-btn" data-action="logout" style="width:100%">${icon('x',18)} Abmelden</button>`;}
function notificationList(){const visible=data.notifications.filter(n=>n.to===activeId);data.notifications.forEach(n=>{if(n.to===activeId)n.read=true});save();return `${visible.length?visible.map(n=>`<div class="notification-item"><strong>${safe(n.title)}</strong><p>${safe(n.body)}</p><time>${new Date(n.created).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}</time>${n.ev?`<div style="margin-top:8px"><button class="link-button" data-action="detail" data-id="${n.ev}">Termin ansehen</button></div>`:''}</div>`).join(''):'<div class="empty">Noch keine Mitteilungen. Hier erscheinen Einladungen und Änderungen aus deiner Familien-App.</div>'}<div class="demo-ribbon" style="margin-top:18px">${icon('info',16)} Mitteilungen sind bereits in der App sichtbar. System-Push folgt in der nächsten Ausbaustufe.</div>`;}
function renderModal(){if(!modal){overlay.innerHTML='';return}const scroll=overlay.querySelector('.sheet')?.scrollTop||0;let title='',body='';if(modal==='create'){title='Neuen Termin';body=createForm();}else if(modal==='detail'){const e=data.events.find(ev=>ev.id===detailId);if(!e){closeModal();return}title='Termindetails';body=detail(e);}else if(modal==='accounts'){title='Mein Konto';body=accountOptions();}else if(modal==='notifications'){title='Mitteilungen';body=notificationList();}else if(modal==='propose'){title='Alternative vorschlagen';const ev=data.events.find(e=>e.id===detailId);body=`<p class="small-desc">Der ursprüngliche Termin bleibt unverändert, bis ${safe(person(ev.host).name)} den Vorschlag übernimmt.</p><form id="propose-form" data-id="${ev.id}"><div class="field-row"><div class="field"><label for="proposal-date">Neues Datum</label><input class="input" id="proposal-date" type="date" name="date" value="${ev.date}" required></div><div class="field"><label for="proposal-time">Neue Uhrzeit</label><input class="input" id="proposal-time" type="time" name="time" value="${ev.time}" required></div></div><button class="solid-btn" style="width:100%" type="submit">${icon('send',18)} Vorschlag einreichen</button></form>`;}else if(modal==='edit'){title='Details bearbeiten';const ev=data.events.find(e=>e.id===detailId);body=`<p class="small-desc">Änderungen an Ort, Beschreibung oder Antwortfrist werden den Eingeladenen als Mitteilung in der App angezeigt. Für Datum und Uhrzeit nutze bitte „Verschieben“.</p><form id="edit-form" data-id="${ev.id}">${categoryPicker(categoryFor(ev).id)}<div class="field"><label for="edit-title">Titel</label><input id="edit-title" class="input" name="title" required maxlength="100" value="${safe(ev.title)}"></div><div class="field"><label for="edit-teaser">Kurzer Einladungssatz (optional)</label><input id="edit-teaser" class="input" name="teaser" maxlength="90" value="${safe(ev.teaser||'')}" placeholder="Ein Satz für die Startseite"><p class="input-hint">Maximal 90 Zeichen</p></div><div class="field"><label for="edit-place">Ort / Adresse</label><input id="edit-place" class="input" name="place" maxlength="160" value="${safe(ev.place)}"></div><div class="field"><label for="edit-description">Beschreibung</label><textarea id="edit-description" class="input" name="description" maxlength="1200">${safe(ev.description)}</textarea></div><div class="field"><label for="edit-due">Antwortfrist</label><input id="edit-due" class="input" type="date" name="due" value="${ev.due}" required></div><button class="solid-btn" style="width:100%" type="submit">${icon('check',18)} Änderungen speichern</button></form>`;}else if(modal==='reschedule'){title='Termin verschieben';const ev=data.events.find(e=>e.id===detailId);body=`<p class="small-desc">Alle bisherigen Rückmeldungen werden zurückgesetzt. Alle eingeladenen App-Nutzer müssen erneut antworten.</p><form id="reschedule-form" data-id="${ev.id}"><div class="field-row"><div class="field"><label for="move-date">Neues Datum</label><input id="move-date" class="input" type="date" name="date" value="${ev.date}" required></div><div class="field"><label for="move-time">Neue Uhrzeit</label><input id="move-time" class="input" type="time" name="time" value="${ev.time}" required></div></div><div class="field"><label for="move-due">Neue Antwortfrist</label><input id="move-due" class="input" type="date" name="due" value="${ev.due}" required></div><button class="solid-btn" style="width:100%" type="submit">${icon('refresh',18)} Termin verschieben</button></form>`;}
  overlay.innerHTML=sheet(title,body);const current=overlay.querySelector('.sheet');if(current)current.scrollTop=scroll;
}
function transitionPage(dest){page=dest;statusFilter='all';window.scrollTo({top:0,behavior:'instant'});render();}
function updateResponse(ev,status){if(ev.cancelled)return;if(!ev.invitees.includes(activeId)){toast('Du bist nicht eingeladen.');return;}const existing=ev.responses[activeId];const saved=(existing?.people||[]).filter(id=>PEOPLE.some(p=>p.id===id));ev.responses[activeId]={status,people:status==='yes'?(saved.length?saved:[activeId]).includes(activeId)?(saved.length?saved:[activeId]):[activeId,...saved]:[]};ev.history.unshift(`${person(activeId).name}: ${statusLabel(status)} (${new Date().toLocaleDateString('de-DE')})`);save();render();toast(`Antwort gespeichert: ${statusLabel(status)}`);}
function handlerClick(ev){const target=ev.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;const id=target.dataset.id;if(action==='close-backdrop'){if(ev.target===target)closeModal();return;}if(action==='close'){closeModal();return;}if(action==='page'){transitionPage(target.dataset.page);return;}if(action==='create'){openModal('create');return;}if(action==='detail'){openModal('detail',id);return;}if(action==='notifications'){openModal('notifications');render();return;}if(action==='accounts'){openModal('accounts');return;}if(action==='switch'){activeId=id;try{sessionStorage.setItem('familienzeit.demo.user',activeId);}catch{}closeModal();toast(`Testprofil: ${person(activeId).name}`);return;}if(action==='pending'){statusFilter='pending';render();setTimeout(()=>document.querySelector('.section-heading')?.scrollIntoView({block:'start',behavior:'smooth'}),30);return;}if(action==='filter'){statusFilter=statusFilter==='all'?'pending':statusFilter==='pending'?'mine':'all';render();return;}if(action==='prev-month'||action==='next-month'){monthCursor.setMonth(monthCursor.getMonth()+(action==='next-month'?1:-1));const y=monthCursor.getFullYear(),m=monthCursor.getMonth();daySelected=`${y}-${String(m+1).padStart(2,'0')}-01`;render();return;}if(action==='day'){daySelected=target.dataset.date;render();return;}if(action==='rsvp'){const e=data.events.find(e=>e.id===id);if(e)updateResponse(e,target.dataset.response);return;}if(action==='propose'||action==='reschedule'||action==='edit'){openModal(action,id);return;}if(action==='nudge'){const e=data.events.find(e=>e.id===id),to=target.dataset.to;if(!e||e.host!==activeId||e.cancelled||e.responses[to])return;let last=e.nudges[to]||0;if(Date.now()-last<86400000){toast('Dieser Stupser wurde bereits gesendet (24-Stunden-Sperre).');return;}e.nudges[to]=Date.now();notification(to,`${person(activeId).name} erinnert dich`, `Bitte antworte auf „${e.title}“. (Demo-Mitteilung)`,e.id);save();render();toast(`Demo-Stupser für ${person(to).name} gespeichert`);return;}if(action==='cancel'){const e=data.events.find(e=>e.id===id);if(!e||e.host!==activeId)return;if(!confirm(`„${e.title}“ wirklich absagen? Alle eingeladenen Nutzer werden benachrichtigt (Demo).`))return;e.cancelled=true;e.history.unshift(`Abgesagt von ${person(activeId).name} am ${new Date().toLocaleDateString('de-DE')}`);notifyAll(e,'Termin abgesagt',`„${e.title}“ findet nicht statt. (Demo-Mitteilung)`);save();render();toast('Termin abgesagt. Demo-Mitteilungen gespeichert.');return;}if(action==='accept-proposal'){const e=data.events.find(e=>e.id===id),p=e?.proposals?.[Number(target.dataset.index)];if(!p||e.host!==activeId)return;if(!confirm('Alternativtermin übernehmen? Alle müssen erneut zusagen.'))return;rescheduleEvent(e,p.date,p.time,e.due);return;}if(action==='reset'){if(!confirm('Alle lokalen Teständerungen löschen und Beispieldaten wiederherstellen?'))return;data=demoSeed();save();transitionPage('home');toast('Demo zurückgesetzt.');return;}}
function rescheduleEvent(e,date,time,due){if(!date||!time||!due||due>date){toast('Bitte gültige Daten angeben (Antwortfrist nicht nach Termin).');return;}if(e.date===date&&e.time===time){toast('Datum und Uhrzeit sind unverändert.');return;}const prev=`${fmt(e.date)} ${e.time}`;e.date=date;e.time=time;e.due=due;e.responses={};e.nudges={};e.history.unshift(`Verschoben von ${prev} auf ${fmt(date)} ${time}. Alle Zusagen erneut erforderlich.`);notifyAll(e,'Termin verschoben',`„${e.title}“ ist jetzt am ${fmt(date)} um ${time} Uhr. Bitte erneut antworten. (Demo-Mitteilung)`);save();openModal('detail',e.id);render();toast('Termin verschoben. Zusagen zurückgesetzt.');}
function handlerSubmit(ev){const form=ev.target;ev.preventDefault();const fd=new FormData(form);if(form.id==='create-form'){let date=String(fd.get('date')),due=String(fd.get('due'));if(due>date){toast('Die Antwortfrist muss spätestens am Termintag liegen.');return;}const invited=Array.from(form.querySelectorAll('input[name="invitees"]:checked')).map(n=>n.value);invited.push(activeId);const evt={id:'e'+Math.random().toString(36).slice(2),title:String(fd.get('title')).trim(),date,time:String(fd.get('time')),category:String(fd.get('category')),teaser:String(fd.get('teaser')||'').trim(),place:String(fd.get('place')).trim(),description:String(fd.get('description')).trim(),due,host:activeId,invitees:[...new Set(invited)],responses:{},comments:[],proposals:[],nudges:{},history:[],cancelled:false,created:stamp()};if(!evt.title||!CATEGORIES.some(c=>c.id===evt.category)||evt.teaser.length>90){toast('Bitte Titel, Terminart und Kurzinfo prüfen.');return;}data.events.push(evt);notifyAll(evt,'Neuer Termin',`${person(activeId).name} hat „${evt.title}“ eingeladen. Bitte antworte bis ${fmt(due)}. (Demo-Mitteilung)`);save();openModal('detail',evt.id);render();toast('Termin lokal erstellt.');return;}if(form.dataset.form==='comment'){const e=data.events.find(e=>e.id===form.dataset.id),msg=String(fd.get('text')).trim();if(!e||!msg||e.cancelled)return;e.comments.push({id:'c'+Math.random(),author:activeId,text:msg,created:stamp()});save();openModal('detail',e.id);render();toast('Kommentar gespeichert.');return;}if(form.id==='propose-form'){const e=data.events.find(e=>e.id===form.dataset.id),date=String(fd.get('date')),time=String(fd.get('time'));if(!e||e.cancelled)return;if(date===e.date&&time===e.time){toast('Bitte ein anderes Datum oder eine andere Uhrzeit wählen.');return;}e.proposals.push({author:activeId,date,time,created:stamp()});if(e.host!==activeId)notification(e.host,'Alternativtermin vorgeschlagen',`${person(activeId).name} schlägt für „${e.title}“ ${fmt(date)}, ${time} Uhr vor.`,e.id);save();openModal('detail',e.id);render();toast('Alternativtermin vorgeschlagen.');return;}if(form.id==='edit-form'){const e=data.events.find(e=>e.id===form.dataset.id);if(!e||e.host!==activeId||e.cancelled)return;const title=String(fd.get('title')).trim(),place=String(fd.get('place')).trim(),description=String(fd.get('description')).trim(),due=String(fd.get('due')),category=String(fd.get('category')),teaser=String(fd.get('teaser')||'').trim();if(!title||due>e.date||!CATEGORIES.some(c=>c.id===category)||teaser.length>90){toast('Titel, Terminart, Kurzinfo und Antwortfrist prüfen.');return;}if(title===e.title&&place===e.place&&description===e.description&&due===e.due&&category===categoryFor(e).id&&teaser===(e.teaser||'')){toast('Keine Änderungen vorhanden.');return;}e.title=title;e.place=place;e.description=description;e.due=due;e.category=category;e.teaser=teaser;e.history.unshift(`Details geändert von ${person(activeId).name} (${new Date().toLocaleDateString('de-DE')})`);notifyAll(e,'Termindetails geändert',`Für „${e.title}“ wurden Details geändert. Bitte prüfe die Einladung. (Demo-Mitteilung)`);save();openModal('detail',e.id);render();toast('Termindetails aktualisiert.');return;}if(form.id==='reschedule-form'){const e=data.events.find(e=>e.id===form.dataset.id);if(e&&e.host===activeId)rescheduleEvent(e,String(fd.get('date')),String(fd.get('time')),String(fd.get('due')));return;}}
function handlerChange(ev){const t=ev.target;if(t.dataset.action==='companion'){const e=data.events.find(e=>e.id===t.dataset.event),p=t.dataset.person;if(!e||!e.responses[activeId]||e.responses[activeId].status!=='yes')return;const existing=new Set(e.responses[activeId].people||[activeId]);if(t.checked)existing.add(p);else existing.delete(p);existing.add(activeId);e.responses[activeId].people=[...existing];save();openModal('detail',e.id);render();toast('Mitreisende aktualisiert.');}}
document.addEventListener('click',e=>{
 if(loginState==='ready') remoteClick(e);
});
document.addEventListener('submit',e=>{if(e.target.closest('form')){e.preventDefault();remoteSubmit(e);}});
document.addEventListener('change',e=>{if(loginState==='ready')remoteChange(e);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal)closeModal()});
if('serviceWorker' in navigator && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname))) {
 navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
bootRemote();

/* ==============================================================
   Online-Modus 0.7: echte Anmeldung und Datenbankabgleich
   ============================================================= */
function loginScreen(){
 const title=loginState==='loading'?'Verbindung wird aufgebaut …':
   loginState==='unlinked'?'Dein Konto ist noch nicht freigeschaltet':
   loginState==='error'?'Verbindung nicht verfügbar':'Willkommen bei Familienzeit';
 const subtitle=loginState==='unlinked'?'Du bist angemeldet, aber dein Konto muss noch einer der sieben Personen zugeordnet werden. Bitte den App-Verwalter informieren.':
   loginState==='error'?'Die Anmeldung konnte nicht geladen werden. Prüfe Internetverbindung und Browser und versuche es erneut.':
   'Melde dich mit deinem persönlichen Konto an. Danach erkennt die App dich automatisch.';
 let body='';
 if(loginState==='login') body=`<form id="login-form" class="auth-form"><label class="field"><span>E-Mail-Adresse</span><input type="email" name="email" class="input" autocomplete="email" required placeholder="name@beispiel.de"></label><label class="field"><span>Passwort</span><input type="password" name="password" class="input" autocomplete="current-password" required placeholder="Dein Passwort"></label><button class="solid-btn" type="submit">${icon('check',22)} Anmelden</button><button class="outline-btn" type="button" data-action="magic-link">Anmeldelink per E-Mail senden</button><p class="auth-note">Einladungslink oder Passwort funktionieren erst, nachdem dein Familienkonto eingerichtet wurde.</p></form>`;
 if(loginState==='unlinked')body=`<p class="auth-note">Angemeldet als <b>${safe(authUser?.email||'Unbekannt')}</b></p><button class="outline-btn" data-action="logout">Abmelden</button>`;
 if(loginState==='error')body='<button class="solid-btn" data-action="retry-connect">Erneut versuchen</button>';
 return `<div class="app-shell auth-shell"><header class="app-header"><div class="brand"><div class="brand-mark">${icon('heart',28)}</div><div class="brand-name">Familienzeit</div></div></header><main class="auth-card glass"><div class="auth-icon">${icon(loginState==='loading'?'clock':loginState==='unlinked'?'info':'heart',35)}</div><h1>${safe(title)}</h1><p>${safe(subtitle)}</p>${body}</main><p class="auth-footer">Privater Familienkalender · 7 persönliche Konten</p></div>`;
}
function mapRows(rows){
  personIdByLocal={};localIdByPerson={};userIdByLocal={};localIdByUser={};
  for(const p of rows){const l=PEOPLE.find(x=>x.name.toLocaleLowerCase('de-DE')===p.display_name.toLocaleLowerCase('de-DE'))?.id;
    if(!l)continue;
    personIdByLocal[l]=p.id;localIdByPerson[p.id]=l;
    if(p.auth_user_id){userIdByLocal[l]=p.auth_user_id;localIdByUser[p.auth_user_id]=l;}
  }
}
function assembleData(rows){
  const commentsByEvent={},alternativesByEvent={},historyByEvent={},responsesByEvent={},attendeesByKey={};
  for(const a of rows.rsvp_attendees){const key=[a.event_id,a.responder_user_id,a.revision].join('|');(attendeesByKey[key]??=[]).push(localIdByPerson[a.person_id]);}
  for(const r of rows.rsvps){const e=rows.events.find(e=>e.id===r.event_id);if(!e||r.revision!==e.revision)continue;
    const who=localIdByUser[r.responder_user_id];if(!who)continue;
    (responsesByEvent[r.event_id]??={})[who]={status:r.status,people:(attendeesByKey[[r.event_id,r.responder_user_id,r.revision].join('|')]||[]).filter(Boolean)};
  }
  for(const c of rows.comments)(commentsByEvent[c.event_id]??=[]).push({id:c.id,author:localIdByUser[c.author_user_id]||'unbekannt',text:c.body,created:c.created_at});
  for(const a of rows.alternatives)(alternativesByEvent[a.event_id]??=[]).push({id:a.id,author:localIdByUser[a.author_user_id]||'unbekannt',date:a.proposed_date,time:String(a.proposed_time).slice(0,5),created:a.created_at});
  for(const h of rows.event_changes)(historyByEvent[h.event_id]??=[]).push(`${({rescheduled:'Verschoben',updated:'Details geändert',cancelled:'Abgesagt'})[h.change_type]||'Geändert'} · ${new Date(h.created_at).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}`);
  const inviteMap={};for(const i of rows.event_invites)(inviteMap[i.event_id]??=[]).push(localIdByPerson[i.person_id]);
  const events=rows.events.map(e=>({
    id:e.id,title:e.title,date:e.event_date,time:String(e.event_time).slice(0,5),host:localIdByUser[e.creator_user_id]||'unbekannt',place:e.location_text||'',mapsUrl:e.maps_url||'',description:e.description||'',due:e.response_deadline||e.event_date,category:e.kind,teaser:e.teaser||'',invitees:(inviteMap[e.id]||[]).filter(Boolean),responses:responsesByEvent[e.id]||{},comments:commentsByEvent[e.id]||[],proposals:alternativesByEvent[e.id]||[],history:historyByEvent[e.id]||[],nudges:{},cancelled:e.status==='cancelled',created:e.created_at,revision:e.revision
  }));
  const types={invited:'Neue Einladung',rescheduled:'Termin verschoben',updated:'Termin geändert',cancelled:'Termin abgesagt',nudge:'Persönlicher Stupser'};
  const notifications=rows.notifications.map(n=>({id:n.id,to:localIdByUser[n.recipient_user_id]||activeId,title:types[n.kind]||'Mitteilung',body:n.message,ev:n.event_id,created:n.created_at,read:!!n.read_at}));
  return {version:2,events,notifications};
}
async function bootRemote(){
 loginState='loading';render();
 try{
  await connect();
  const u=await auth.getUser();
  if(!u){loginState='login';render();return;}
  authUser=u;
  await refreshRemote(true);
  if(!unwatch){try{unwatch=watchChanges(()=>{if(!changing)queueRemoteRefresh();});}catch(e){console.warn('Realtime noch nicht aktiv',e);}}
  if(!refreshTimer){refreshTimer=setInterval(()=>{if(document.visibilityState==='visible'&&!changing)queueRemoteRefresh();},45000);}
 }catch(e){console.error(e);loginState='error';render();}
}
let queuedRefresh=0;
function queueRemoteRefresh(){clearTimeout(queuedRefresh);queuedRefresh=setTimeout(()=>refreshRemote(false).catch(console.error),400);}
async function refreshRemote(boot=false){
 const rows=await fetchAll();
 mapRows(rows.people);
 const local=localIdByUser[authUser.id];
 if(!local){loginState='unlinked';render();return;}
 activeId=local;
 data=assembleData(rows);
 loginState='ready';
 if(!modal || modal==='detail' || modal==='notifications' || boot)render();
}
async function actionRun(work,success){
 if(changing)return;
 changing=true;
 try{await work();if(loginState==='ready'&&authUser)await refreshRemote();if(success)toast(success);}
 catch(e){console.error(e);toast('Nicht gespeichert: '+String(e.message||e));}
 finally{changing=false;}
}
function remoteClick(ev){
 const t=ev.target.closest('[data-action]');if(!t)return;
 const a=t.dataset.action,id=t.dataset.id;
 if(a==='logout'){actionRun(async()=>{unwatch?.();unwatch=null;await auth.logout();authUser=null;loginState='login';data={events:[],notifications:[]};modal=null;overlay.innerHTML='';document.body.style.overflow='';render();});return;}
 if(a==='retry-connect'){bootRemote();return;}
 if(a==='magic-link'){
  const email=document.querySelector('input[name="email"]')?.value?.trim();
  if(!email){toast('Bitte zuerst die E-Mail-Adresse eingeben.');return;}
  actionRun(()=>auth.magic(email),'Anmeldelink angefordert. Bitte dein E-Mail-Postfach prüfen.');return;
 }
 if(a==='rsvp'){
  const e=data.events.find(e=>e.id===id);if(!e)return;
  const previous=e.responses[activeId]?.people||[];
  const selected=t.dataset.response==='yes'?Array.from(new Set([activeId,...previous])).map(x=>personIdByLocal[x]).filter(Boolean):[];
  actionRun(()=>respond(id,t.dataset.response,selected),'Deine Antwort wurde gespeichert.');return;
 }
 if(a==='nudge'){
  const personId=personIdByLocal[t.dataset.to];if(!personId)return;
  actionRun(()=>nudge(id,personId),'Stupser in der App gesendet.');return;
 }
 if(a==='cancel'){
  const e=data.events.find(e=>e.id===id);if(!e||e.host!==activeId)return;
  if(!confirm(`„${e.title}“ wirklich absagen? Alle Eingeladenen erhalten eine Mitteilung in der App.`))return;
  actionRun(async()=>{await editEvent(id,{status:'cancelled'});modal=null;overlay.innerHTML='';document.body.style.overflow='';},'Termin abgesagt.');return;
 }
 if(a==='accept-proposal'){
  const e=data.events.find(e=>e.id===id),proposal=e?.proposals?.[Number(t.dataset.index)];
  if(!e||e.host!==activeId||!proposal)return;
  if(e.due>proposal.date){toast('Antwortfrist liegt nach dem vorgeschlagenen Datum. Termin bitte manuell verschieben.');return;}
  if(!confirm('Alternativtermin übernehmen? Alle müssen erneut antworten.'))return;
  actionRun(()=>editEvent(e.id,{event_date:proposal.date,event_time:proposal.time}), 'Neues Datum gespeichert, alte Zusagen sind nicht mehr gültig.');return;
 }
 if(a==='notifications'){
  const unread=data.notifications.filter(n=>!n.read).map(n=>n.id);
  handlerClick(ev);
  if(unread.length)actionRun(()=>markRead(unread));
  return;
 }
 if(['switch','reset'].includes(a))return;
 handlerClick(ev);
}
async function remoteSubmit(ev){
 const form=ev.target,fd=new FormData(form);
 if(form.id==='login-form'){
   await actionRun(async()=>{await auth.login(String(fd.get('email')).trim(),String(fd.get('password')));authUser=await auth.getUser();if(!authUser)throw Error('Anmeldung fehlgeschlagen');await refreshRemote(true);},'Angemeldet.');
   return;
 }
 if(loginState!=='ready')return;
 if(form.id==='create-form'){
  const date=String(fd.get('date')),deadline=String(fd.get('due'));
  if(deadline>date){toast('Antwortfrist darf nicht nach dem Termin liegen.');return;}
  const selected=[...new Set([...Array.from(form.querySelectorAll('input[name="invitees"]:checked')).map(i=>i.value),activeId])];
  const values={p_title:String(fd.get('title')).trim(),p_kind:String(fd.get('category')),p_teaser:String(fd.get('teaser')||'').trim(),p_event_date:date,p_event_time:String(fd.get('time')),p_deadline:deadline,p_location:String(fd.get('place')||'').trim(),p_description:String(fd.get('description')||'').trim(),p_invitees:selected.map(x=>personIdByLocal[x]).filter(Boolean),p_maps_url:''};
  if(!values.p_title||values.p_teaser.length>90){toast('Titel und Kurzinfo prüfen.');return;}
  await actionRun(async()=>{const created=await createEvent(values);await refreshRemote();openModal('detail',created);},'Termin veröffentlicht.');return;
 }
 if(form.dataset.form==='comment'){
  const body=String(fd.get('text')||'').trim(),id=form.dataset.id;
  if(!body)return;
  await actionRun(async()=>{await addComment(id,body,authUser.id);await refreshRemote();openModal('detail',id);},'Kommentar gespeichert.');return;
 }
 if(form.id==='propose-form'){
  const id=form.dataset.id,date=String(fd.get('date')),time=String(fd.get('time'));
  const e=data.events.find(e=>e.id===id);
  if(e?.date===date&&e.time===time){toast('Bitte eine echte Alternative vorschlagen.');return;}
  await actionRun(async()=>{await addAlternative(id,date,time,authUser.id);await refreshRemote();openModal('detail',id);},'Alternativtermin vorgeschlagen.');return;
 }
 if(form.id==='edit-form'){
  const id=form.dataset.id,e=data.events.find(e=>e.id===id);
  if(!e||e.host!==activeId||e.cancelled)return;
  const deadline=String(fd.get('due')),teaser=String(fd.get('teaser')||'').trim();
  if(deadline>e.date||teaser.length>90){toast('Bitte Antwortfrist und Kurzinfo prüfen.');return;}
  await actionRun(async()=>{await editEvent(id,{title:String(fd.get('title')).trim(),kind:String(fd.get('category')),teaser,location_text:String(fd.get('place')||'').trim(),description:String(fd.get('description')||'').trim(),response_deadline:deadline});await refreshRemote();openModal('detail',id);},'Änderungen gespeichert.');return;
 }
 if(form.id==='reschedule-form'){
  const id=form.dataset.id,e=data.events.find(e=>e.id===id),date=String(fd.get('date')),time=String(fd.get('time')),due=String(fd.get('due'));
  if(!e||e.host!==activeId||e.cancelled)return;
  if(due>date){toast('Antwortfrist liegt nach dem neuen Termin.');return;}
  if(e.date===date&&e.time===time){toast('Datum und Uhrzeit sind unverändert.');return;}
  await actionRun(async()=>{await editEvent(id,{event_date:date,event_time:time,response_deadline:due});await refreshRemote();openModal('detail',id);},'Termin verschoben: Erneute Zusagen erforderlich.');return;
 }
}
function remoteChange(ev){
 const t=ev.target;if(t.dataset.action!=='companion')return;
 const e=data.events.find(e=>e.id===t.dataset.event);
 if(!e||e.responses[activeId]?.status!=='yes')return;
 const selected=new Set(e.responses[activeId].people||[activeId]);
 if(t.checked)selected.add(t.dataset.person);else selected.delete(t.dataset.person);
 selected.add(activeId);
 actionRun(async()=>{await respond(e.id,'yes',[...selected].map(p=>personIdByLocal[p]).filter(Boolean));await refreshRemote();openModal('detail',e.id);},'Teilnehmer aktualisiert.');
}
// Anmeldung ist ein separater, geschützter Bereich; die UI sieht dort keine Familiendaten.
document.addEventListener('click',e=>{
 if(loginState!=='ready'){
  const t=e.target.closest('[data-action]');if(!t)return;
  if(t.dataset.action==='retry-connect'){bootRemote();return;}
  if(t.dataset.action==='logout'){actionRun(async()=>{await auth.logout();authUser=null;loginState='login';render();});return;}
  if(t.dataset.action==='magic-link'){
    const email=document.querySelector('input[name="email"]')?.value?.trim();if(!email){toast('Bitte E-Mail-Adresse eingeben.');return;}
    actionRun(()=>auth.magic(email),'Anmeldelink angefordert.');
  }
 }
});
