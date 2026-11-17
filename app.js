/* Familienzeit 1.1 · iOS-Feinschliff, stabile Einladungen, sichere Entwürfe */
import * as API from './backend.js?v=110';
const $=q=>document.querySelector(q);
const PEOPLE=['Martin','Stephanie','Fynn','Sonja','Mirco','Bela','Ella','Holger','Ivonne','Susanne'];
const CATEGORIES=[
 {id:'coffee',name:'Kaffee & Kuchen',icon:'coffee'},
 {id:'birthday',name:'Geburtstag',icon:'gift'},
 {id:'dining',name:'Gemeinsam essen',icon:'utensils'},
 {id:'gathering',name:'Familientreffen',icon:'users'},
 {id:'party',name:'Feier',icon:'party'},
 {id:'trip',name:'Ausflug',icon:'car'},
 {id:'holiday',name:'Feiertag',icon:'tree'},
 {id:'other',name:'Sonstiges',icon:'calendar'}
];
const COLORS=[{id:'blue',name:'Blau'},{id:'green',name:'Grün'},{id:'yellow',name:'Gelb'},{id:'apricot',name:'Apricot'},{id:'rose',name:'Rosé'},{id:'lavender',name:'Lavendel'}];
const path={
 heart:'<path d="M20.8 4.7a5.6 5.6 0 0 0-7.9 0L12 5.6l-.9-.9a5.6 5.6 0 0 0-7.9 7.9L12 21l8.8-8.4a5.6 5.6 0 0 0 0-7.9Z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
 plus:'<path d="M12 4v16M4 12h16"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 left:'<path d="m15 5-7 7 7 7"/>',
 down:'<path d="m5 9 7 7 7-7"/>',
 check:'<path d="m5 12 5 5L20 7"/>',
 x:'<path d="M5 5 19 19M19 5 5 19"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 gift:'<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M12 10v11M3 14h18M2 7h20v4H2zM12 7C6 7 6 2 9 2c2.5 0 3 5 3 5Zm0 0c6 0 6-5 3-5-2.5 0-3 5-3 5Z"/>',
 coffee:'<path d="M4 9h13v5a6.5 6.5 0 0 1-13 0V9Zm13 1h2a3 3 0 1 1 0 6h-2M2 21h18M8 3v3M13 3v3"/>',
 utensils:'<path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M20 3c-3 0-4 4-4 8v3h4V3Zm0 11v7"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 5 5v1"/>',
 party:'<path d="m5 21 3.6-14.3L18 17l-13 4Z M10 6l2-3M17 5l3-2M19 11l3 1M14 2h.01M20 20h.01"/>',
 car:'<path d="M5 17h14l1-6-2-5H6l-2 5 1 6Zm0 0v3M19 17v3M5 12h14M7.5 14.5h.01M16.5 14.5h.01"/>',
 tree:'<path d="m12 2 7 9h-4l5 7H4l5-7H5l7-9ZM12 18v4"/>',
 home:'<path d="m3 11 9-8 9 8v10h-7v-7h-4v7H3z"/>',
 edit:'<path d="m4 16 12-12 4 4L8 20H4zM14 6l4 4"/>',
 message:'<path d="M20 4H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3l4 3v-3h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>',
 send:'<path d="M21 3 3 11l7 3 3 7 8-18ZM10 14 21 3"/>',
 map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16M15 5v16"/>',
 camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3V7Zm9 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 sparkle:'<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"/>',
 arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
 logout:'<path d="M9 3H4v18h5M15 8l4 4-4 4M19 12H8"/>',
 image:'<rect x="2" y="3" width="20" height="18" rx="3"/><circle cx="8" cy="9" r="2"/><path d="m3 19 6-6 4 3 3-4 5 6"/>',
 shield:'<path d="M12 2 4 6v5c0 6 3 9 8 11 5-2 8-5 8-11V6l-8-4Z"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/>'
};
function icon(name,size=22){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path[name]||path.info}</svg>`;}
function safe(s){return String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function localDate(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
function iso(y,m,d){return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
function fmt(date,options={day:'numeric',month:'long',year:'numeric'}){if(!date)return 'Nicht angegeben';return new Date(String(date).slice(0,10)+'T12:00:00').toLocaleDateString('de-DE',options);}
function monthShort(date){return fmt(date,{month:'short'}).replace('.','').toUpperCase();}
function weekday(date){return fmt(date,{weekday:'short'});}
function dateNowAtNoon(date){return new Date(String(date).slice(0,10)+'T12:00:00');}
function daysBetween(a,b){return Math.round((Date.UTC(+b.slice(0,4),+b.slice(5,7)-1,+b.slice(8,10))-Date.UTC(+a.slice(0,4),+a.slice(5,7)-1,+a.slice(8,10)))/86400000);}
function birthdayInYear(person,year){if(!person?.birth_date)return null;const m=+person.birth_date.slice(5,7),d=+person.birth_date.slice(8,10);const last=new Date(year,m,0).getDate();return iso(year,m,Math.min(d,last));}
function nextBirthday(person){if(!person?.birth_date)return null;const t=localDate(),y=+t.slice(0,4);let date=birthdayInYear(person,y);if(date<t)date=birthdayInYear(person,y+1);return {date,days:daysBetween(t,date)};}
function upcomingBirthdays(){return data.people.filter(p=>p.birth_date).map(p=>({...p,next:nextBirthday(p)})).sort((a,b)=>a.next.days-b.next.days);}
const typeName=id=>CATEGORIES.find(c=>c.id===id)?.name||'Sonstiges';
const typeIcon=id=>CATEGORIES.find(c=>c.id===id)?.icon||'calendar';
const colorName=id=>COLORS.find(v=>v.id===id)?.name||'Blau';
function toast(msg){const el=$('#toast-root');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{el.classList.remove('show');},4400);}
let homeFilter='all';
let page='home',modal=null,user=null,mode='loading',lastError='',loadingAction=false,month=new Date(),selectedDay=localDate(),birthdayDraft=null;
let installEvent=null;const invitationFromUrl=new URLSearchParams(location.search).get('invite')||'';
let inviteCode=/^[0-9a-f]{24}$/i.test(invitationFromUrl)?invitationFromUrl.toLowerCase():'';let invitePerson='',draftSaveTimer=null;
let unsubscribe=null,refreshTimeout=null,avatarCache=new Map(),peopleById=new Map(),accountsByUser=new Map();
let data={people:[],person_managers:[],events:[],event_invites:[],rsvps:[],rsvp_attendees:[],comments:[],alternatives:[],notifications:[]};
const profileByUser=()=>data.people.find(p=>p.auth_user_id===user?.id)||null;
const me=()=>profileByUser();
const person=id=>peopleById.get(id)||{id,display_name:'Person',birth_date:null,can_login:false};
const canManage=id=>{
  const own=me();if(!own)return false;
  return id===own.id||data.person_managers.some(m=>m.person_id===id&&m.manager_person_id===own.id);
};
const personalId=id=>person(id).id;
function avatar(p,size='md'){
  if(typeof p==='string')p=person(p);
  const color=PEOPLE.indexOf(p.display_name||'')%7;
  const src=avatarCache.get(p.id)?.url;
  return `<span class="avatar ${size} tone-${color<0?0:color}" aria-hidden="true">${src?`<img src="${safe(src)}" alt="" loading="lazy">`:`<span>${safe((p.display_name||'?').slice(0,2).toUpperCase())}</span>`}</span>`;
}
function eventInvites(id){return data.event_invites.filter(i=>i.event_id===id).map(i=>i.person_id);}
function responseFor(id,personId){const p=person(personId),e=data.events.find(x=>x.id===id);if(!e||!p.auth_user_id)return null;return data.rsvps.find(r=>r.event_id===id&&r.revision===e.revision&&r.responder_user_id===p.auth_user_id)||null;}
function guestsFor(event_id,responder_user_id,revision){return data.rsvp_attendees.filter(a=>a.event_id===event_id&&a.responder_user_id===responder_user_id&&a.revision===revision).map(a=>a.person_id);}
function guestsTotal(e){const ids=new Set();for(const r of data.rsvps.filter(r=>r.event_id===e.id&&r.revision===e.revision&&r.status==='yes'))for(const p of guestsFor(e.id,r.responder_user_id,r.revision))ids.add(p);return ids.size;}
function pendingEvents(){const own=me();if(!own)return [];return data.events.filter(e=>e.status==='active'&&e.event_date>=localDate()&&eventInvites(e.id).includes(own.id)&&!responseFor(e.id,own.id)).sort((a,b)=>(a.event_date+a.event_time).localeCompare(b.event_date+b.event_time));}
function upcomingEvents(){return data.events.filter(e=>e.event_date>=localDate()&&e.status==='active').sort((a,b)=>(a.event_date+a.event_time).localeCompare(b.event_date+b.event_time));}
function unread(){return data.notifications.filter(n=>!n.read_at);}
async function fetchAvatars(){await Promise.all(data.people.filter(p=>p.avatar_path).map(async p=>{const c=avatarCache.get(p.id);if(c?.path===p.avatar_path&&c?.until>Date.now())return;try{const url=await API.avatarUrl(p.avatar_path);avatarCache.set(p.id,{url,path:p.avatar_path,until:Date.now()+45*60*1000});}catch(err){console.warn('Profilbild nicht verfügbar:',err);}}));}
async function fetchData(){const oldIds=new Set(data.notifications.map(n=>n.id));const oldReady=mode==='ready';data=await API.readAll();peopleById=new Map(data.people.map(p=>[p.id,p]));accountsByUser=new Map(data.people.filter(p=>p.auth_user_id).map(p=>[p.auth_user_id,p]));if(!me()){mode='unlinked';render();return;}await fetchAvatars();mode='ready';render();if(oldReady)await notifyWhileOpen(data.notifications.filter(n=>!oldIds.has(n.id)));else await notifyWhileOpen(data.notifications.filter(n=>Date.now()-new Date(n.created_at).getTime()<120000));}
function scheduleRefresh(){clearTimeout(refreshTimeout);refreshTimeout=setTimeout(()=>{if(!loadingAction&&user)fetchData().catch(e=>{console.warn('Aktualisierung fehlgeschlagen',e);});},430);}
async function boot(){mode='loading';render();try{await API.connect();user=await API.getUser();if(!user){mode=inviteCode?'register':'login';render();if(inviteCode)loadInvitePreview();return;}await fetchData();unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);setInterval(()=>{if(user&&document.visibilityState==='visible')scheduleRefresh();},45000);window.addEventListener('focus',scheduleRefresh);await openDeeplink();}catch(e){console.error(e);lastError=e.message||'Verbindungsfehler';mode='error';render();}}
async function work(op,success,after){if(loadingAction)return;loadingAction=true;try{const result=await op();if(user)await fetchData();if(after)await after(result);if(success)toast(success);return result;}catch(err){console.error(err);toast('Nicht gespeichert: '+(err?.message||'Unbekannter Fehler'));}finally{loadingAction=false;}}
async function openDeeplink(){const params=new URLSearchParams(location.search),ev=params.get('event'),p=params.get('person');if(ev&&data.events.some(e=>e.id===ev))showModal('event',ev);else if(p&&peopleById.has(p))showModal('person',p);if(ev||p)history.replaceState(null,'',location.pathname);}

function layout(){
 const own=me(),newCount=unread().length;
 return `<div class="app-shell"><header class="topbar"><div class="brand"><div class="brand-symbol">${icon('heart',25)}</div><div><strong>Familienzeit</strong></div></div><div class="header-tools"><button class="icon-btn ${newCount?'has-unread':''}" data-action="notifications" aria-label="Mitteilungen anzeigen">${icon('bell',25)}${newCount?`<i>${newCount>9?'9+':newCount}</i>`:''}</button><button class="avatar-trigger" data-action="account" aria-label="Mein Konto">${avatar(own)}</button></div></header><main>${page==='home'?homeView():page==='calendar'?calendarView():familyView()}</main></div><nav class="bottom-nav" aria-label="Hauptnavigation"><button class="nav-item ${page==='home'?'active':''}" data-action="page" data-page="home">${icon('home',26)}<span>Start</span></button><button class="nav-item ${page==='calendar'?'active':''}" data-action="page" data-page="calendar">${icon('calendar',26)}<span>Kalender</span></button><button class="nav-item create" data-action="new-event">${icon('plus',27)}<span>Termin</span></button><button class="nav-item ${page==='family'?'active':''}" data-action="page" data-page="family">${icon('users',26)}<span>Familie</span></button></nav>`;
}
function authView(){
 const busy=mode==='loading';const unlinked=mode==='unlinked';
 const label=mode==='error'?'Verbindung unterbrochen':unlinked?'Noch keine Freischaltung':busy?'Familienzeit lädt …':mode==='register'?'Dein Familienzugang':'Schön, dass du da bist!';
 return `<div class="app-shell"><header class="topbar"><div class="brand"><div class="brand-symbol">${icon('heart',25)}</div><div><strong>Familienzeit</strong><small>Zusammen ist schöner</small></div></div></header><main class="auth-page"><div class="auth-art">${icon('users',55)}<span class="auth-spark s1">${icon('sparkle',24)}</span><span class="auth-spark s2">${icon('heart',19)}</span></div><section class="auth-panel glass"><p class="eyebrow">UNSER FAMILIENKALENDER</p><h1>${safe(label)}</h1><p class="auth-desc">${unlinked?'Dein Konto ist angemeldet, aber noch keiner Person zugeordnet. Bitte den Verwalter der Familien-App kontaktieren.':busy?'Die Verbindung zu eurem Familienkalender wird aufgebaut.':mode==='error'?safe(lastError):mode==='register'?'Einmalig E-Mail-Adresse und Passwort festlegen. Danach landest du direkt im gemeinsamen Familienkalender.':'Melde dich an. Du bleibst normalerweise angemeldet – auf jedem Gerät mit deinem eigenen Zugang.'}</p>
 ${mode==='login'?`<form id="login-form" class="stack" autocomplete="on"><label class="field">E-Mail-Adresse<input class="input" type="email" name="email" autocomplete="username" placeholder="Deine E-Mail-Adresse" required></label><label class="field">Passwort<input class="input" type="password" name="password" autocomplete="current-password" placeholder="Dein Passwort" required></label><button class="btn primary wide" type="submit">Anmelden ${icon('arrow',20)}</button><button type="button" class="btn secondary wide" data-action="begin-invite">Ich habe eine Familieneinladung</button><div class="auth-tip">${icon('shield',18)} Deine Zugangsdaten wurden dir beim Einrichten deines Familienkontos vergeben. Nach der ersten Anmeldung erfolgt die Erkennung automatisch.</div></form>`:''}
 ${mode==='register'?`<form id="register-form" class="stack" autocomplete="on"><div class="auth-tip">${icon('users',20)} <span id="invite-preview">${invitePerson?`Dein Profil: <b>${safe(invitePerson)}</b>`:'Deine persönliche Einladung wird geprüft …'}</span></div><label class="field">Einladungscode<input class="input" name="code" value="${safe(inviteCode)}" autocomplete="off" autocapitalize="off" spellcheck="false" required></label><label class="field">Deine E-Mail-Adresse<input class="input" type="email" name="email" autocomplete="email" required placeholder="name@beispiel.de"></label><label class="field">Eigenes Passwort (mindestens 10 Zeichen)<input class="input" type="password" minlength="10" name="password" autocomplete="new-password" required placeholder="Dein Passwort"></label><button class="btn primary wide" type="submit">Zugang erstellen ${icon('arrow',20)}</button><p class="form-help">Der Einladungscode ordnet dich automatisch deiner Person und demselben Familienkalender zu. Gib ihn nicht an andere weiter.</p><button class="btn secondary wide" type="button" data-action="back-to-login">Ich habe schon ein Konto</button></form>`:''}
 ${mode==='unlinked'?`<form id="claim-form" class="stack"><div class="auth-tip">${icon('info',20)} Angemeldet als ${safe(user?.email||'Unbekannt')}. Dein Familienverwalter gibt dir einen einmaligen Einladungscode.</div><label class="field">Einladungscode<input class="input" name="code" autocomplete="off" autocapitalize="off" spellcheck="false" value="${safe(inviteCode)}" placeholder="Code hier einfügen" required></label><button class="btn primary wide" type="submit">${icon('check',19)} Familienprofil aktivieren</button><button class="btn secondary wide" type="button" data-action="logout">Abmelden</button></form>`:''}
 ${mode==='error'?`<button class="btn primary wide" data-action="retry">Erneut verbinden</button>`:''}</section></main></div>`;
}
function render(){const app=$('#app');app.innerHTML=mode==='ready'?layout():authView();if(modal&&mode==='ready'){if(!(modal.type==='new'&&$('#new-event-form')))renderModal();}else if(mode!=='ready')$('#modal-root').innerHTML='';}
function greeting(){const h=new Date().getHours();return h<10?'Guten Morgen':h<18?'Hallo':'Guten Abend';}
function homeView(){
 const up=upcomingEvents(),pending=pendingEvents(),births=upcomingBirthdays();
 const imminent=births.filter(p=>p.next.days<=7).length;
 const own=me(),name=safe(own?.display_name||'Familie');
 const visible=homeFilter==='mine'?up.filter(e=>eventInvites(e.id).includes(own.id)):homeFilter==='pending'?pending:up;
 const currentFilter=homeFilter==='mine'?'Meine':homeFilter==='pending'?'Offene':'Alle';
 const installHint=!isInstalled()&&localStorage.getItem('fz11-show-install')==='yes';
 return `<section class="dashboard-welcome" aria-label="Dein Familienüberblick">
   <span class="welcome-sheen" aria-hidden="true"></span>
   <div class="welcome-content">
    <h1>${greeting()}, ${name}!</h1>
    <p>Hier siehst du, was ihr gemeinsam vorhabt.</p>
    <div class="welcome-actions"><span class="welcome-counter">${icon('calendar',19)} ${up.length} ${up.length===1?'Termin':'Termine'} geplant</span>
    <button type="button" class="birthday-quick" data-action="birthdays" title="Geburtstage ansehen" aria-label="Geburtstage ansehen${imminent?`, ${imminent} bald`:''}">${icon('gift',23)}${imminent?`<i aria-hidden="true">${imminent}</i>`:''}</button></div>
   </div><div class="welcome-sculpt" aria-hidden="true"><span class="sculpt-glow"></span>${icon('heart',75)}</div>
 </section>
 ${installHint?`<div class="install-hint">${icon('sparkle',20)} <span>Familienzeit wie eine App nutzen</span><button data-action="install-guide">Installieren</button><button class="install-hint-dismiss" aria-label="Hinweis ausblenden" data-action="install-dismiss">${icon('x',17)}</button></div>`:''}
 ${pending.length?`<button class="pending-action" type="button" data-action="pending"><span class="pending-action-icon">${icon('bell',25)}</span><span class="pending-action-copy"><strong>${pending.length===1?'Eine Rückmeldung offen':`${pending.length} Rückmeldungen offen`}</strong><small>Tippen und antworten</small></span>${icon('chevron',24)}</button>`:''}
 <div class="dashboard-section-head"><div><h2>Nächste Termine</h2><p>Unsere gemeinsamen Pläne</p></div><button class="dashboard-filter" type="button" data-action="home-filter" aria-label="Termine filtern, aktuell ${currentFilter}">${currentFilter} ${icon('down',18)}</button></div>
 <section class="event-list dashboard-events" aria-label="Anstehende Familientermine">
 ${visible.length?visible.map(eventCard).join(''):`<div class="empty-state home-empty">${icon('calendar',34)}<h3>${homeFilter==='all'?'Noch keine Termine':'Keine passenden Termine'}</h3><p>${homeFilter==='all'?'Plane euren nächsten gemeinsamen Moment.':'Wechsle zu „Alle“, um alle Termine zu sehen.'}</p>${homeFilter==='all'?`<button class="btn primary" data-action="new-event">Termin erstellen</button>`:''}</div>`}
 </section>`;
}
function birthdayOverview(){
 const birthdays=upcomingBirthdays();
 return `<div class="birthday-overview">${birthdays.length?birthdays.map(p=>`<button class="birthday-overview-row" type="button" data-action="person" data-id="${p.id}" aria-label="Geburtstag von ${safe(p.display_name)} ansehen">${avatar(p,'lg')}<span class="birthday-overview-copy"><strong>${safe(p.display_name)}</strong><small>${safe(fmt(p.next.date,{day:'numeric',month:'long'}))}${p.next.days<=7?` · ${p.next.days===0?'Heute':p.next.days===1?'Morgen':`in ${p.next.days} Tagen`}`:''}</small></span>${icon('chevron',22)}</button>`).join(''):`<div class="birthday-none">${icon('gift',31)}<p>Noch keine Geburtstage eingetragen.</p></div>`}<button class="btn secondary wide birthday-manage" type="button" data-action="page" data-page="family">${icon('users',20)} Geburtstage bearbeiten</button></div>`;
}
function birthdayMini(p){const b=p.next;return `<button class="birthday-mini" data-action="person" data-id="${p.id}" aria-label="Geburtstag von ${safe(p.display_name)} ansehen"><span class="birthday-photo">${avatar(p,'lg')}<i>${icon('gift',15)}</i></span><span class="birthday-copy"><strong>${safe(p.display_name)}</strong><small>${fmt(b.date,{day:'numeric',month:'short'})}</small><span class="tiny-pill">${b.days===0?'Heute!':b.days===1?'Morgen':`In ${b.days} Tagen`}</span></span></button>`;}
function themeClass(e){return `category-${/^(coffee|birthday|dining|gathering|party|trip|holiday|other)$/.test(e.kind)?e.kind:'other'} cover-${/^(soft|illustrated|warm)$/.test(e.cover_style)?e.cover_style:'illustrated'}`;}
function responseLabel(r){return !r?'Antwort offen':r.status==='yes'?'Zugesagt':r.status==='no'?'Abgesagt':'Vielleicht';}
function eventCard(e){
 const own=me(),r=responseFor(e.id,own.id),invited=eventInvites(e.id).includes(own.id);
 const host=accountsByUser.get(e.creator_user_id),hostName=host?.display_name||'Familie';
 const status=!invited?'':r?.status==='yes'?'Zugesagt':r?.status==='no'?'Abgesagt':r?.status==='maybe'?'Vielleicht':'Antwort offen';
 const statusClass=r?.status||'open',statusIcon=r?.status==='yes'?'check':r?.status==='no'?'x':r?.status==='maybe'?'info':'clock';
 const comments=data.comments.filter(c=>c.event_id===e.id).length;
 const attendees=guestsTotal(e);
 return `<button class="event-card family-event-card ${themeClass(e)} card-color-${safe(e.card_color||'blue')}" type="button" data-action="event" data-id="${e.id}" aria-label="${safe(e.title)}, ${safe(fmt(e.event_date))}, ${safe(String(e.event_time).slice(0,5))} Uhr, Details öffnen">
  <span class="family-event-watermark" aria-hidden="true">${icon(typeIcon(e.kind),110)}</span>
  <span class="family-event-main">
   <span class="family-date-tile"><span class="family-date-month">${monthShort(e.event_date)}</span><strong>${+e.event_date.slice(8,10)}</strong><span class="family-date-weekday">${weekday(e.event_date)}</span><span class="family-date-symbol" aria-hidden="true">${icon(typeIcon(e.kind),21)}</span></span>
   <span class="family-event-info"><span class="family-event-category">${safe(typeName(e.kind))}</span><strong class="family-event-title">${safe(e.title)}</strong><span class="family-event-time">${icon('clock',19)} ${safe(String(e.event_time).slice(0,5))} Uhr</span><span class="family-event-host">${host?avatar(host,'xs'):icon('users',19)} ${safe(hostName)} lädt ein</span></span>
   <span class="family-event-chevron" aria-hidden="true">${icon('chevron',22)}</span>
  </span>
  ${e.teaser?`<span class="family-event-teaser">${safe(e.teaser)}</span>`:''}
  <span class="family-event-footer"><span class="family-event-stats"><span>${icon('users',19)} ${attendees} ${attendees===1?'Person':'Personen'}</span><span>${icon('message',18)} ${comments}</span></span>${status?`<span class="family-event-status ${statusClass}">${icon(statusIcon,16)} ${safe(status)}</span>`:''}</span>
 </button>`;
}
function calendarView(){
 const y=month.getFullYear(),m=month.getMonth()+1,first=(new Date(y,m-1,1).getDay()+6)%7,last=new Date(y,m,0).getDate();let cells='';
 for(let i=0;i<first;i++)cells+='<span class="date-gap"></span>';
 for(let d=1;d<=last;d++){
   const date=iso(y,m,d),hasEvent=data.events.some(e=>e.event_date===date&&e.status!=='cancelled'),birthday=data.people.some(p=>birthdayInYear(p,y)===date);
   cells+=`<button class="calendar-day ${date===selectedDay?'selected':''} ${date===localDate()?'today':''}" data-action="calendar-day" data-date="${date}" aria-label="${safe(fmt(date))}${birthday?', Geburtstag':''}${hasEvent?', Termin':''}">${d}<span class="day-dots">${birthday?'<i class="birth-dot"></i>':''}${hasEvent?'<i class="event-dot"></i>':''}</span></button>`;
 }
 const date=selectedDay,dayEvents=data.events.filter(e=>e.event_date===date).sort((a,b)=>String(a.event_time).localeCompare(String(b.event_time))),birthdays=data.people.filter(p=>birthdayInYear(p,+date.slice(0,4))===date);
 return `<div class="page-head"><p class="eyebrow">ALLES AUF EINEN BLICK</p><h1>Unser Kalender</h1><p>Alle Familientermine und Geburtstage zusammen.</p></div><section class="calendar-panel"><div class="month-heading"><h2>${safe(month.toLocaleDateString('de-DE',{month:'long',year:'numeric'}))}</h2><div class="month-controls"><button data-action="month-prev" aria-label="Vorheriger Monat">${icon('left',22)}</button><button data-action="month-next" aria-label="Nächster Monat">${icon('chevron',22)}</button></div></div><div class="weekday-grid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span>${x}</span>`).join('')}</div><div class="month-grid">${cells}</div><div class="calendar-legend"><span><i class="birth-dot"></i> Geburtstag</span><span><i class="event-dot"></i> Termin</span></div></section>
 <div class="section-title"><div><p class="eyebrow">${safe(fmt(date,{weekday:'long'}).toUpperCase())}</p><h2>${safe(fmt(date,{day:'numeric',month:'long'}))}</h2></div></div>
 <div class="day-list">${birthdays.map(p=>`<button class="birthday-day-card" data-action="person" data-id="${p.id}">${avatar(p,'md')}<span><strong>${safe(p.display_name)} hat Geburtstag!</strong><small>Tippen, um eine Feier zu planen</small></span>${icon('gift',25)}</button>`).join('')}${dayEvents.map(e=>eventCard(e)).join('')}${!dayEvents.length&&!birthdays.length?'<div class="empty-state compact">Noch nichts an diesem Tag geplant.</div>':''}</div>`;
}
function familyView(){
 const people=[...data.people].sort((a,b)=>PEOPLE.indexOf(a.display_name)-PEOPLE.indexOf(b.display_name));
 return `<div class="page-head"><p class="eyebrow">UNSERE MENSCHEN</p><h1>Die Familie</h1><p>Hier sind alle zehn Personen. Jede sieht dieselben gemeinsamen Termine.</p></div><div class="family-panel"><div class="family-intro">${icon('heart',24)} <b>${data.people.length} Menschen, ein Kalender</b></div>${people.map(p=>{
 const own=p.id===me().id,canEdit=canManage(p.id);
 return `<button class="family-row" data-action="person" data-id="${p.id}">${avatar(p,'lg')}<span class="family-person"><strong>${safe(p.display_name)}${own?' <em>Du</em>':''}</strong><small>${p.birth_date?`${icon('gift',15)} ${fmt(p.birth_date,{day:'numeric',month:'long'})}`:canEdit?'Geburtstag und Foto ergänzen':p.can_login?'App-Mitglied':'Familienmitglied'}</small></span><span class="family-right">${canEdit?icon('edit',17):icon('chevron',20)}</span></button>${me().can_invite&&p.can_login&&!p.auth_user_id?`<div class="invite-action-row"><button class="btn secondary small" data-action="invite-code" data-id="${p.id}">${icon('plus',16)} Zugangscode für ${safe(p.display_name)} erstellen</button></div>`:''}`;
 }).join('')}</div><p class="family-note">${icon('shield',17)} Profilbilder bleiben privat. Nur die jeweilige Person beziehungsweise berechtigte Bezugspersonen können Daten ändern.</p>`;
}

function modalFrame(title,body,eyebrow='FAMILIENZEIT'){
 return `<div class="overlay"><div class="sheet" role="dialog" aria-modal="true" aria-label="${safe(title)}"><div class="sheet-grab"></div><div class="sheet-heading"><div><small>${safe(eyebrow)}</small><h2>${safe(title)}</h2></div><button class="sheet-close" type="button" data-action="close" aria-label="Schließen">${icon('x',24)}</button></div><div class="sheet-content">${body}</div></div></div>`;
}
function showModal(type,id=null){if(modal?.type==='new')storeEventDraft();modal={type,id};renderModal();document.body.classList.add('modal-open');}
function closeModal(){if(modal?.type==='new')storeEventDraft();modal=null;$('#modal-root').innerHTML='';document.body.classList.remove('modal-open');}
function renderModal(){if(!modal)return;if(modal.type==='new')storeEventDraft();let title='',body='',eyebrow='FAMILIENZEIT';const {type,id}=modal;
 if(type==='event'){const e=data.events.find(e=>e.id===id);if(!e){closeModal();return;}title='Einladung';eyebrow='TERMINDETAILS';body=eventDetail(e);}
 else if(type==='new'){title=birthdayDraft?'Geburtstag planen':'Neuen Termin planen';eyebrow='WIR SEHEN UNS';body=newEventForm();}
 else if(type==='edit'){title='Termin bearbeiten';body=editEventForm(data.events.find(e=>e.id===id));}
 else if(type==='move'){title='Termin verschieben';body=moveEventForm(data.events.find(e=>e.id===id));}
 else if(type==='alternative'){title='Alternativtermin';body=alternativeForm(data.events.find(e=>e.id===id));}
 else if(type==='person'){const p=person(id);title=p.display_name;eyebrow='FAMILIENPROFIL';body=personDetail(p);}
 else if(type==='account'){title='Mein Konto';body=accountView();}
 else if(type==='notifications'){title='Mitteilungen';eyebrow='NEUES AUS DER FAMILIE';body=notificationsView();}
 else if(type==='pending'){title='Noch zu beantworten';eyebrow='DEINE OFFENEN EINLADUNGEN';body=pendingView();}
 else if(type==='birthdays'){title='Geburtstage';eyebrow='UNSERE FAMILIE';body=birthdayOverview();}
 else if(type==='invite'){const p=person(id);title='Einladung für '+p.display_name;eyebrow='EINFACHER ERSTZUGANG';const link=invitationLink(modal.code||'');body=`<p class="form-help">${safe(p.display_name)} öffnet den Link und richtet das eigene Passwort ein. Das Profil wird automatisch mit eurem gemeinsamen Kalender verbunden.</p><div class="invitation-code">${safe(link)}</div><button class="btn primary wide" data-action="share-invite">${icon('send',19)} Einladung teilen</button><button class="btn secondary wide" data-action="copy-invite">${icon('check',19)} Link kopieren</button><p class="form-help notice">Der Link gilt 14 Tage und lässt sich nur einmal verwenden. Bitte nur der vorgesehenen Person schicken.</p>`;}
 else if(type==='install'){title='Familienzeit installieren';eyebrow='AUF DEINEM HANDY';body=installGuide();}
 $('#modal-root').innerHTML=modalFrame(title,body,eyebrow);if(type==='new')restoreEventDraft();
}
function colorPicker(selected='blue'){
 return `<fieldset class="field-group color-field"><legend>Farbe auswählen</legend><p class="form-help">Deine Farbe wird später auch auf der Terminkarte angezeigt.</p><div class="color-options">${COLORS.map(v=>`<label class="color-option"><input type="radio" name="card_color" value="${v.id}" ${selected===v.id?'checked':''}><span class="color-option-face"><i class="color-dot swatch-${v.id}"></i><b>${safe(v.name)}</b></span></label>`).join('')}</div></fieldset>`;
}
function categoryPicker(selected='gathering'){
 return `<fieldset class="field-group"><legend>Was habt ihr vor?</legend><div class="category-grid">${CATEGORIES.map(c=>`<label class="category-radio"><input type="radio" name="kind" value="${c.id}" ${selected===c.id?'checked':''} required><span>${icon(c.icon,27)}<b>${safe(c.name)}</b></span></label>`).join('')}</div></fieldset>`;
}
function inviteePicker(selected){return `<div class="invite-grid">${data.people.map(p=>`<label class="invite-person"><input type="checkbox" name="invitees" value="${p.id}" ${selected.has(p.id)?'checked':''} ${p.id===me().id?'disabled':''}><span>${avatar(p,'sm')}<b>${safe(p.display_name)}</b>${p.id===me().id?'<small>Du</small>':''}</span></label>`).join('')}</div>`;}
function newEventForm(){
 const draft=birthdayDraft,personForBirthday=draft?person(draft.personId):null;
 const d=new Date();d.setDate(d.getDate()+14);const defaultDate=draft?.date||iso(d.getFullYear(),d.getMonth()+1,d.getDate()),title=draft?`Geburtstag von ${personForBirthday.display_name}`:'',kind=draft?'birthday':'gathering';
 const deadlineDefault=defaultDate<localDate()?localDate():localDate();
 return `<form id="new-event-form" class="stack"><p class="form-help">Du erstellst eine Einladung für alle ausgewählten Personen. Du selbst bist automatisch dabei.</p>
 <p class="draft-safe-note">${icon('check',17)} Dein Entwurf wird automatisch gespeichert.</p>${categoryPicker(kind)}${colorPicker(draft?'apricot':'blue')}
 <label class="field">Wie heißt euer Treffen?<input class="input" name="title" maxlength="120" placeholder="z. B. Familienfrühstück" value="${safe(title)}" required></label>
 <div class="two-fields"><label class="field">Datum<input class="input" type="date" name="date" value="${defaultDate}" min="${localDate()}" required></label><label class="field">Uhrzeit<input class="input" type="time" name="time" value="15:00" required></label></div>
 <label class="field">Einladungssatz <small>(optional)</small><input class="input" name="teaser" maxlength="90" placeholder="Ein kleiner Vorgeschmack …" value="${draft?'Wir freuen uns auf einen schönen Tag zusammen!':''}"></label>
 <label class="field">Ort / Adresse<input class="input" name="location" maxlength="240" placeholder="z. B. bei uns zu Hause"></label>
 <label class="field">Das solltest du wissen <small>(optional)</small><textarea class="input" name="description" maxlength="3000" rows="3" placeholder="Was sollen die anderen mitbringen?"></textarea></label>
 <fieldset class="field-group"><legend>Wer ist eingeladen?</legend><p class="form-help">Alle zehn Personen können erscheinen, auch Kinder ohne eigenes Login. Die sieben App-Nutzer können selbst antworten.</p>${inviteePicker(new Set(data.people.map(p=>p.id)))}</fieldset>
 <label class="field">Bitte antworten bis<input class="input" type="date" name="deadline" value="${deadlineDefault}" required></label>
 <button class="btn primary wide" type="submit">${icon('check',19)} Einladung erstellen</button></form>`;
}
function eventDetail(e){
 const host=accountsByUser.get(e.creator_user_id),own=me(),invited=eventInvites(e.id).includes(own.id),ownResponse=responseFor(e.id,own.id),hostSelf=e.creator_user_id===user.id;
 const yes=data.rsvps.filter(r=>r.event_id===e.id&&r.revision===e.revision&&r.status==='yes'),confirmed=new Set(yes.flatMap(r=>guestsFor(e.id,r.responder_user_id,r.revision)));
 const notes=data.comments.filter(c=>c.event_id===e.id);
 const alternatives=data.alternatives.filter(a=>a.event_id===e.id);
 const yourGuests=ownResponse?.status==='yes'?guestsFor(e.id,user.id,e.revision):[];
 const missing=eventInvites(e.id).map(id=>person(id)).filter(p=>p.can_login&&p.auth_user_id&&!responseFor(e.id,p.id));
 return `<div class="detail-banner ${themeClass(e)} card-color-${safe(e.card_color||'blue')}"><span class="detail-banner-art">${icon(typeIcon(e.kind),94)}</span><p>${icon(typeIcon(e.kind),20)} ${safe(typeName(e.kind))}</p><h3>${safe(e.title)}</h3><span>${safe(fmt(e.event_date,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))}</span></div>
 ${e.status==='cancelled'?`<div class="cancelled-warning">${icon('x',23)} Dieser Termin wurde abgesagt.</div>`:''}
 ${e.teaser?`<p class="detail-teaser">${safe(e.teaser)}</p>`:''}<div class="detail-facts">
 <div>${icon('clock',21)} <span><b>${safe(String(e.event_time).slice(0,5))} Uhr</b> · ${safe(fmt(e.event_date))}</span></div>
 <div>${icon('users',21)} <span>Eingeladen von <b>${safe(host?.display_name||'Familie')}</b></span></div>
 ${e.location_text?`<div>${icon('map',21)} <span><b>${safe(e.location_text)}</b><p><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(e.location_text)}" target="_blank" rel="noopener noreferrer">Auf Google Maps ansehen</a></p></span></div>`:''}
 ${e.description?`<div>${icon('info',21)} <span>${safe(e.description)}</span></div>`:''}
 <div>${icon('calendar',21)} <span>Antwortfrist: <b>${safe(fmt(e.response_deadline||e.event_date))}</b></span></div></div>
 ${e.status==='active'&&invited?`<section class="detail-panel"><h3>Deine Rückmeldung</h3><p class="form-help">${ownResponse?`Du hast „${responseLabel(ownResponse)}“ ausgewählt. Du kannst deine Antwort ändern.`:'Du hast noch nicht geantwortet. Was passt für dich?'}</p><div class="rsvp-actions"><button class="rsvp-btn yes ${ownResponse?.status==='yes'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="yes">${icon('check',25)} Zusagen</button><button class="rsvp-btn maybe ${ownResponse?.status==='maybe'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="maybe">${icon('info',25)} Vielleicht</button><button class="rsvp-btn no ${ownResponse?.status==='no'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="no">${icon('x',25)} Absagen</button></div>
 ${ownResponse?.status==='yes'?`<h4>Wer kommt mit?</h4><p class="form-help">Du bist automatisch dabei. Jede Person wird insgesamt nur einmal gezählt.</p><div class="companion-list">${data.people.filter(p=>p.id!==own.id).map(p=>`<label class="companion-person">${avatar(p,'sm')}<span>${safe(p.display_name)}</span><input type="checkbox" data-action="companion" data-event="${e.id}" data-person="${p.id}" ${yourGuests.includes(p.id)?'checked':''}></label>`).join('')}</div>`:''}</section>`:''}
 <section class="detail-panel"><h3>${icon('users',21)} Dabei · ${confirmed.size} ${confirmed.size===1?'Person':'Personen'}</h3>${confirmed.size?`<div class="attendee-avatars">${[...confirmed].map(id=>`<span>${avatar(id,'sm')}${safe(person(id).display_name)}</span>`).join('')}</div>`:'<p class="form-help">Noch keine Zusagen.</p>'}
 ${missing.length?`<p class="form-help"><b>Antwort offen:</b> ${missing.map(p=>safe(p.display_name)).join(', ')}</p>`:''}
 ${hostSelf&&missing.length&&e.status==='active'?`<div class="nudge-list">${missing.map(p=>`<button class="btn secondary small" data-action="nudge" data-id="${e.id}" data-person="${p.id}">${icon('bell',16)} ${safe(p.display_name)} erinnern</button>`).join('')}</div>`:''}</section>
 ${alternatives.length?`<section class="detail-panel"><h3>Andere Terminvorschläge</h3>${alternatives.map(a=>`<div class="alternative-row"><span><b>${safe(fmt(a.proposed_date))} · ${safe(String(a.proposed_time).slice(0,5))} Uhr</b><small>von ${safe(accountsByUser.get(a.author_user_id)?.display_name||'Familie')}</small></span>${hostSelf&&e.status==='active'?`<button class="btn secondary small" data-action="accept-alternative" data-id="${e.id}" data-alt="${a.id}">Übernehmen</button>`:''}</div>`).join('')}</section>`:''}
 ${e.status==='active'?`<button class="btn secondary wide" data-action="alternative" data-id="${e.id}">${icon('calendar',19)} Alternativtermin vorschlagen</button>`:''}
 ${hostSelf&&e.status==='active'?`<section class="detail-panel host-actions"><h3>Deinen Termin verwalten</h3><button class="btn secondary wide" data-action="edit-event" data-id="${e.id}">${icon('edit',20)} Einladung bearbeiten</button><div class="action-pair"><button class="btn secondary" data-action="move-event" data-id="${e.id}">${icon('calendar',18)} Verschieben</button><button class="btn danger" data-action="cancel-event" data-id="${e.id}">${icon('x',18)} Absagen</button></div><p class="form-help">Nach einer Verschiebung müssen alle Eingeladenen außer dem Gastgeber erneut antworten.</p></section>`:''}
 <section class="detail-panel"><h3>${icon('message',21)} Kommentare · ${notes.length}</h3>${notes.length?notes.map(c=>`<div class="comment-row">${avatar(accountsByUser.get(c.author_user_id)||{id:'',display_name:'?'},'sm')}<div><b>${safe(accountsByUser.get(c.author_user_id)?.display_name||'Familie')}</b><small>${new Date(c.created_at).toLocaleDateString('de-DE')}</small><p>${safe(c.body)}</p></div></div>`).join(''):'<p class="form-help">Noch keine Kommentare.</p>'}${e.status==='active'&&invited?`<form id="comment-form" data-id="${e.id}" class="stack"><label class="field">Nachricht an die Familie<textarea class="input" name="message" rows="2" maxlength="2000" placeholder="Schreibe etwas ..." required></textarea></label><button class="btn primary" type="submit">${icon('send',18)} Kommentar senden</button></form>`:''}</section>`;
}
function editEventForm(e){if(!e)return '';
 return `<form id="edit-event-form" data-id="${e.id}" class="stack"><p class="form-help">Den Zeitpunkt änderst du über „Verschieben“. Alle werden über wichtige Änderungen informiert.</p>${categoryPicker(e.kind)}${colorPicker(e.card_color||'blue')}
 <label class="field">Titel<input class="input" name="title" maxlength="120" required value="${safe(e.title)}"></label>
 <label class="field">Einladungssatz<input class="input" name="teaser" maxlength="90" value="${safe(e.teaser)}"></label>
 <label class="field">Ort / Adresse<input class="input" name="location" maxlength="240" value="${safe(e.location_text)}"></label>
 <label class="field">Beschreibung<textarea class="input" rows="3" name="description" maxlength="3000">${safe(e.description)}</textarea></label>
 <fieldset class="field-group"><legend>Wer ist eingeladen?</legend>${inviteePicker(new Set(eventInvites(e.id)))}</fieldset>
 <label class="field">Antwortfrist<input type="date" class="input" name="deadline" value="${e.response_deadline||e.event_date}" required></label>
 <button class="btn primary wide" type="submit">${icon('check',19)} Änderungen speichern</button></form>`;
}
function moveEventForm(e){if(!e)return '';return `<form id="move-event-form" data-id="${e.id}" class="stack"><p class="form-help">Bei einer Verschiebung bleiben frühere Zusagen im Verlauf erhalten, aber alle müssen erneut antworten.</p><div class="two-fields"><label class="field">Neues Datum<input class="input" type="date" name="date" value="${e.event_date}" min="${localDate()}" required></label><label class="field">Neue Uhrzeit<input class="input" type="time" name="time" value="${String(e.event_time).slice(0,5)}" required></label></div><label class="field">Neue Antwortfrist<input class="input" type="date" name="deadline" value="${e.response_deadline||localDate()}" required></label><button class="btn primary wide" type="submit">${icon('refresh',20)} Termin verschieben</button></form>`;}
function alternativeForm(e){if(!e)return '';return `<form id="alternative-form" data-id="${e.id}" class="stack"><p class="form-help">Dein Vorschlag ändert noch nichts am eigentlichen Termin. Der Gastgeber entscheidet.</p><div class="two-fields"><label class="field">Anderes Datum<input class="input" type="date" name="date" value="${e.event_date}" min="${localDate()}" required></label><label class="field">Uhrzeit<input class="input" type="time" name="time" value="${String(e.event_time).slice(0,5)}" required></label></div><button class="btn primary wide" type="submit">${icon('send',18)} Vorschlag senden</button></form>`;}
function personDetail(p){
 const b=nextBirthday(p),canEdit=canManage(p.id);
 return `<div class="profile-cover"><div class="profile-big">${avatar(p,'xxl')}</div><div><h3>${safe(p.display_name)}</h3><span>${p.can_login?'App-Nutzer':'Familienmitglied ohne Login'}</span></div></div>
 ${p.birth_date?`<div class="profile-birthday">${icon('gift',26)}<span><b>Geburtstag am ${safe(fmt(p.birth_date,{day:'numeric',month:'long'}))}</b><small>${b.days===0?'Heute ist es so weit!':b.days===1?'Schon morgen!':`In ${b.days} Tagen`}</small></span></div>`:`<div class="profile-birthday">${icon('gift',25)}<span><b>Noch kein Geburtstag eingetragen</b><small>${canEdit?'Du kannst ihn unten ergänzen.':'Die berechtigte Person kann ihn ergänzen.'}</small></span></div>`}
 ${p.birth_date?`<button class="btn primary wide" data-action="birthday-event" data-id="${p.id}">${icon('plus',20)} Einladung zum Geburtstag erstellen</button>`:''}
 ${canEdit?`<section class="detail-panel"><h3>${icon('edit',20)} Profil bearbeiten</h3><form id="profile-form" data-id="${p.id}" class="stack"><label class="field">Geburtstag<input class="input" type="date" name="birthdate" max="${localDate()}" value="${p.birth_date||''}"></label><p class="form-help">Du kannst einen Geburtstag jederzeit nachtragen oder ändern.</p><label class="field">Profilbild <small>(optional)</small><input class="input file-input" type="file" name="avatar" accept="image/jpeg,image/png,image/webp"></label><p class="form-help">Das Bild wird auf eine quadratische Ansicht zugeschnitten und privat gespeichert. Maximal 8 MB Originalgröße.</p><button class="btn primary wide" type="submit">${icon('check',19)} Profil speichern</button></form></section>`:''}`;
}
function accountView(){const own=me(),supported=('Notification' in window);return `<div class="account-profile">${avatar(own,'xl')}<div><h3>${safe(own.display_name)}</h3><p>${safe(user?.email||'Persönlich angemeldet')}</p></div></div><div class="account-section"><button class="account-link" data-action="person" data-id="${own.id}">${icon('camera',23)} <span>Mein Profil & Bild</span>${icon('chevron',20)}</button><button class="account-link" data-action="install-guide">${icon('plus',23)} <span>App auf diesem Gerät installieren <small>Android & iPhone – direkt auf den Startbildschirm</small></span>${icon('chevron',20)}</button><button class="account-link" data-action="enable-notifications">${icon('bell',23)} <span>Geräte-Benachrichtigungen <small>${supported?Notification.permission==='granted'?'Für die geöffnete App aktiviert':'Aktivieren':'In diesem Browser nicht verfügbar'}</small></span>${icon('chevron',20)}</button></div><p class="form-help notice"><b>Wichtig:</b> Terminerinnerungen werden bereits serverseitig in der App gespeichert. Geräte-Benachrichtigungen funktionieren derzeit, wenn die App geöffnet ist. Push bei geschlossener App folgt noch.</p><p class="group-proof">${icon('users',17)} Gemeinsamer Familienkalender · ${data.people.length} Personen</p><p class="app-version">Familienzeit Version 1.1</p><button class="btn secondary wide" data-action="logout">${icon('logout',19)} Abmelden</button>`;}
function notificationsView(){return `${data.notifications.length?data.notifications.map(n=>`<button class="notification-row ${!n.read_at?'unread':''}" data-action="notification-open" data-id="${n.id}"><span class="notification-symbol">${icon(n.related_person_id?'gift':n.kind==='nudge'?'bell':'calendar',24)}</span><span><strong>${safe(n.related_person_id?'Geburtstag':n.kind==='invited'?'Neue Einladung':n.kind==='rescheduled'?'Termin verschoben':n.kind==='cancelled'?'Termin abgesagt':n.kind==='deadline_reminder'?'Antwortfrist läuft ab':n.kind==='nudge'?'Erinnerung':'Familien-Nachricht')}</strong><p>${safe(n.message)}</p><small>${new Date(n.created_at).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}</small></span>${icon('chevron',18)}</button>`).join(''):'<div class="empty-state compact">Hier erscheinen eure Einladungen, Erinnerungen und Änderungen.</div>'}<p class="form-help notice">Die App prüft jeden Morgen, welche Geburtstage und Antwortfristen anstehen.</p>`;}
function pendingView(){const list=pendingEvents();return `<p class="form-help">${list.length?'Diese Einladungen warten noch auf deine Antwort. Wähle einen Termin, um direkt zuzusagen oder abzusagen.':'Du hast aktuell alle Einladungen beantwortet.'}</p><div class="event-list">${list.map(eventCard).join('')}</div>`;}

function currentForm(){return $('#modal-root form');}
function formValues(form){const f=new FormData(form);return {f,date:String(f.get('date')||''),time:String(f.get('time')||''),deadline:String(f.get('deadline')||'')};}
function formValidDates(date,deadline){if(!date||!deadline||deadline>date){toast('Die Antwortfrist muss spätestens am Termintag liegen.');return false;}if(date<localDate()){toast('Der Termin muss heute oder in der Zukunft liegen.');return false;}return true;}
function invitedFromForm(form){const ids=[...form.querySelectorAll('input[name="invitees"]:checked')].map(x=>x.value);ids.push(me().id);return [...new Set(ids)];}
async function saveNewEvent(form){const {f,date,time,deadline}=formValues(form);if(!formValidDates(date,deadline))return;
 const title=String(f.get('title')||'').trim(),teaser=String(f.get('teaser')||'').trim();if(!title||teaser.length>90){toast('Titel oder Einladungssatz überprüfen.');return;}
 const values={p_title:title,p_kind:String(f.get('kind')),p_teaser:teaser,p_event_date:date,p_event_time:time,p_deadline:deadline,p_location:String(f.get('location')||'').trim(),p_description:String(f.get('description')||'').trim(),p_invitees:invitedFromForm(form),p_maps_url:'',p_cover_style:'illustrated',p_card_color:String(f.get('card_color')||'blue')};
 await work(()=>API.createEvent(values),'Einladung erstellt.',async id=>{clearEventDraft();birthdayDraft=null;showModal('event',id);});
}
async function saveExistingEvent(form){const id=form.dataset.id,e=data.events.find(x=>x.id===id);if(!e||e.creator_user_id!==user.id)return;
 const f=new FormData(form),deadline=String(f.get('deadline'));if(deadline>e.event_date){toast('Die Antwortfrist liegt nach dem Termin.');return;}
 const invited=invitedFromForm(form),old=eventInvites(id),add=invited.filter(x=>!old.includes(x)),remove=old.filter(x=>!invited.includes(x));
 const fields={title:String(f.get('title')).trim(),teaser:String(f.get('teaser')).trim(),kind:String(f.get('kind')),card_color:String(f.get('card_color')||'blue'),location_text:String(f.get('location')).trim(),description:String(f.get('description')).trim(),response_deadline:deadline};
 await work(async()=>{await API.updateEvent(id,fields);await API.replaceInvitees(id,add,remove);},'Einladung aktualisiert.',async()=>showModal('event',id));
}
async function moveEvent(form){const id=form.dataset.id,{date,time,deadline}=formValues(form),e=data.events.find(x=>x.id===id);if(!e||e.creator_user_id!==user.id||!formValidDates(date,deadline))return;
 if(date===e.event_date&&time===String(e.event_time).slice(0,5)){toast('Bitte ein anderes Datum oder eine andere Uhrzeit auswählen.');return;}
 if(!confirm('Termin verschieben? Alle bisherigen Zusagen müssen danach erneut bestätigt werden.'))return;
 await work(()=>API.updateEvent(id,{event_date:date,event_time:time,response_deadline:deadline}),'Termin verschoben. Die Familie muss erneut antworten.',async()=>showModal('event',id));
}
async function saveAlternative(form){const id=form.dataset.id,{date,time}=formValues(form),e=data.events.find(x=>x.id===id);if(!e||!date||date<localDate())return;
 if(date===e.event_date&&time===String(e.event_time).slice(0,5)){toast('Wähle bitte eine echte Alternative.');return;}
 await work(()=>API.addAlternative(id,user.id,date,time),'Terminvorschlag übermittelt.',async()=>showModal('event',id));
}
function croppedBlob(file){return new Promise(async(resolve,reject)=>{
  if(file.size>8*1024*1024){reject(Error('Das Foto ist größer als 8 MB.'));return;}
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){reject(Error('Bitte JPG, PNG oder WebP auswählen.'));return;}
  let bitmap=null,objectUrl=null,source=null;
  try{
    if('createImageBitmap' in window){bitmap=await createImageBitmap(file);source=bitmap;}
    else {objectUrl=URL.createObjectURL(file);source=new Image();await new Promise((res,rej)=>{source.onload=res;source.onerror=rej;source.src=objectUrl;});}
    const w=source.width,h=source.height,s=Math.min(w,h),canvas=document.createElement('canvas');canvas.width=384;canvas.height=384;
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('Bildverarbeitung nicht verfügbar');
    ctx.drawImage(source,(w-s)/2,(h-s)/2,s,s,0,0,384,384);
    canvas.toBlob(blob=>{if(blob)resolve(blob);else reject(Error('Bild konnte nicht verarbeitet werden'));},'image/webp',.83);
  }catch(e){reject(e);}finally{bitmap?.close?.();if(objectUrl)URL.revokeObjectURL(objectUrl);}
 });}
async function saveProfile(form){const id=form.dataset.id;if(!canManage(id))return;
 const formdata=new FormData(form),date=String(formdata.get('birthdate')||'');if(date&&date>localDate()){toast('Der Geburtstag darf nicht in der Zukunft liegen.');return;}
 await work(async()=>{
  const fields={birth_date:date||null},file=formdata.get('avatar');
  if(file&&file instanceof File&&file.size){const blob=await croppedBlob(file);fields.avatar_path=await API.uploadAvatar(id,blob);avatarCache.delete(id);}
  await API.savePerson(id,fields);
 },'Profil gespeichert.',async()=>showModal('person',id));
}
async function applyResponse(id,status){const e=data.events.find(x=>x.id===id);if(!e||e.status!=='active')return;
 const old=responseFor(id,me().id),persons=status==='yes'?[...new Set([me().id,...(old?.status==='yes'?guestsFor(id,user.id,e.revision):[])])]:[];
 await work(()=>API.respond(id,status,persons),'Deine Rückmeldung wurde gespeichert.',async()=>showModal('event',id));
}
async function updateCompanions(input){const id=input.dataset.event,e=data.events.find(x=>x.id===id);if(!e)return;
 const ids=[me().id,...[...$('#modal-root').querySelectorAll('input[data-action="companion"]:checked')].map(x=>x.dataset.person)];
 await work(()=>API.respond(id,'yes',[...new Set(ids)]),'Begleitpersonen aktualisiert.',async()=>showModal('event',id));
}
async function readNotification(id){const n=data.notifications.find(x=>x.id===id);if(!n)return;
 await work(()=>API.markRead([id]),null,async()=>{if(n.related_person_id)showModal('person',n.related_person_id);else if(n.event_id&&data.events.some(e=>e.id===n.event_id))showModal('event',n.event_id);else showModal('notifications');});
}
async function openNotifications(){showModal('notifications');const ids=unread().map(n=>n.id);if(ids.length)await work(()=>API.markRead(ids),null,async()=>showModal('notifications'));}
async function enableNotifications(){
 if(!('Notification' in window)){toast('Dieser Browser unterstützt keine Geräte-Benachrichtigungen.');return;}
 try{const permission=await Notification.requestPermission();if(permission==='granted'){toast('Geräte-Mitteilungen aktiviert, solange Familienzeit geöffnet ist.');}else toast('Keine Erlaubnis erteilt. Du siehst Mitteilungen weiterhin in der App.');if(modal?.type==='account')renderModal();}
 catch(e){toast('Die Benachrichtigungen konnten nicht aktiviert werden.');}
}
async function notifyWhileOpen(newNotifications){if(!('Notification' in window)||Notification.permission!=='granted'||!('serviceWorker' in navigator))return;
 const seenKey='familienzeit-notified-08';let seen=[];try{seen=JSON.parse(localStorage.getItem(seenKey)||'[]')}catch{}
 const seenSet=new Set(seen);
 for(const n of newNotifications.filter(n=>!n.read_at).slice(0,3)){
  if(seenSet.has(n.id)||Date.now()-new Date(n.created_at).getTime()>180000)continue;
  try{const reg=await navigator.serviceWorker.ready;await reg.showNotification('Familienzeit',{body:n.message,icon:'./icon-192.png',badge:'./icon-192.png',tag:'familienzeit-'+n.id,data:{event:n.event_id||null,person:n.related_person_id||null}});seenSet.add(n.id);}catch(e){console.warn('Geräte-Hinweis',e);}
 }
 try{localStorage.setItem(seenKey,JSON.stringify([...seenSet].slice(-100)))}catch{}
}

function isInstalled(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}
function invitationLink(code){const u=new URL('./index.html',location.href);u.searchParams.set('invite',code);return u.toString();}
async function loadInvitePreview(){if(!inviteCode)return;try{const r=await API.previewInvite(inviteCode);invitePerson=r.person||'';if(mode==='register'){const el=document.getElementById('invite-preview');if(el)el.textContent='Dein Profil: '+invitePerson;}}catch(e){invitePerson='';const el=document.getElementById('invite-preview');if(el)el.textContent='Code ungültig oder abgelaufen. Bitte neuen Link anfordern.';}}
function installGuide(){const ios=/iPad|iPhone|iPod/.test(navigator.userAgent),installed=isInstalled();return `<div class="install-steps">${installed?`<div class="install-complete">${icon('check',24)} Familienzeit ist auf diesem Gerät bereits als App geöffnet.</div>`:ios?`<p>Auf dem iPhone dauert die Installation nur wenige Sekunden:</p><div><b>1</b><span>Link in Safari öffnen.</span></div><div><b>2</b><span>Auf <strong>Teilen</strong> (Quadrat mit Pfeil) tippen.</span></div><div><b>3</b><span><strong>Zum Home-Bildschirm</strong> → <strong>Hinzufügen</strong>.</span></div>`:`<p>Installiere Familienzeit direkt auf deinem Android-Smartphone:</p><div><b>1</b><span>In Chrome das Menü <strong>⋮</strong> öffnen.</span></div><div><b>2</b><span><strong>App installieren</strong> oder <strong>Zum Startbildschirm hinzufügen</strong> wählen.</span></div><div><b>3</b><span>Bestätigen und anschließend das Familienzeit-Symbol öffnen.</span></div>`}<p class="form-help">Keine App-Store-Anmeldung nötig. Dein Konto und eure Termine werden synchronisiert.</p>${!installed?`<button class="btn primary wide" data-action="install-now">${icon('plus',20)} ${ios?'Anleitung verstanden':'Jetzt installieren'}</button>`:''}</div>`;}
function draftKey(){return 'familienzeit-draft-v11-'+(user?.id||'local');}
function storeEventDraft(){const form=$('#new-event-form');if(!form||!user)return;const d={};for(const el of form.querySelectorAll('[name]')){if(el.type==='checkbox'){(d[el.name]??=[]).push([el.value,!!el.checked]);}else if(el.type==='radio'){if(el.checked)d[el.name]=el.value;}else d[el.name]=el.value;}try{localStorage.setItem(draftKey(),JSON.stringify({at:Date.now(),fields:d}));}catch{}}
function restoreEventDraft(){const form=$('#new-event-form');if(!form||!user||birthdayDraft)return;let draft=null;try{draft=JSON.parse(localStorage.getItem(draftKey())||'null');}catch{}if(!draft||Date.now()-draft.at>30*24*3600*1000)return;for(const el of form.querySelectorAll('[name]')){const val=draft.fields?.[el.name];if(val===undefined)continue;if(el.type==='checkbox'){const picked=val.find?.(x=>x[0]===el.value);if(picked)el.checked=picked[1];}else if(el.type==='radio')el.checked=val===el.value;else el.value=val;}}
function clearEventDraft(){try{localStorage.removeItem(draftKey());}catch{}}
document.addEventListener('click',async ev=>{
 const el=ev.target.closest('[data-action]');if(!el)return;
 const a=el.dataset.action,id=el.dataset.id;
 if(a==='close-backdrop'){return;} // Outside taps never discard a draft.
 if(a==='close'){closeModal();return;}
 if(a==='apply-update'){await applyAvailableUpdate();return;}
 if(a==='retry'){boot();return;}
 if(a==='begin-invite'){mode='register';render();return;}
 if(a==='back-to-login'){mode='login';render();return;}
 if(a==='install-guide'){localStorage.setItem('fz11-show-install','no');showModal('install');return;}
 if(a==='install-dismiss'){localStorage.setItem('fz11-show-install','no');render();return;}
 if(a==='install-now'){if(installEvent){installEvent.prompt();await installEvent.userChoice;installEvent=null;closeModal();}else if(/iPad|iPhone|iPod/.test(navigator.userAgent))toast('Teilen → Zum Home-Bildschirm → Hinzufügen');else toast('Chrome-Menü ⋮ → App installieren');return;}
 if(a==='logout'){await work(async()=>{unsubscribe?.();unsubscribe=null;await API.logout();user=null;mode='login';closeModal();render();});return;}
 if(mode!=='ready')return;
 if(a==='page'){page=el.dataset.page;closeModal();render();window.scrollTo(0,0);return;}
 if(a==='new-event'){birthdayDraft=null;showModal('new');return;}
 if(a==='birthdays'){showModal('birthdays');return;}
 if(a==='home-filter'){homeFilter=homeFilter==='all'?'mine':homeFilter==='mine'?'pending':'all';render();return;}
 if(a==='pending'){const list=pendingEvents();if(list.length===1){showModal('event',list[0].id);}else if(list.length>1){showModal('pending');}else{toast('Alle Einladungen sind beantwortet.');}return;}
 if(a==='event'){showModal('event',id);return;}
 if(a==='person'){showModal('person',id);return;}
 if(a==='birthday-event'){birthdayDraft={personId:id,date:nextBirthday(person(id))?.date};showModal('new');return;}
 if(a==='invite-code'){if(!me()?.can_invite||!person(id).can_login)return;if(!confirm('Einen persönlichen Einladungslink für '+person(id).display_name+' erzeugen? Ein früherer Link für diese Person würde ungültig.'))return;await work(()=>API.createInviteCode(id),null,async code=>{showModal('invite',id);modal.code=code;renderModal();});return;}
 if(a==='copy-invite'||a==='share-invite'){const code=modal?.code;if(!code)return;const url=invitationLink(code);try{if(a==='share-invite'&&navigator.share)await navigator.share({title:'Familienzeit-Einladung',text:'Dein persönlicher Zugang zu unserem Familienkalender',url});else{await navigator.clipboard.writeText(url);toast('Persönlicher Einladungslink kopiert.');}}catch(err){if(err?.name!=='AbortError')toast('Bitte den Link markieren und kopieren.');}return;}
 if(a==='account'){showModal('account');return;}
 if(a==='notifications'){await openNotifications();return;}
 if(a==='notification-open'){await readNotification(id);return;}
 if(a==='enable-notifications'){await enableNotifications();return;}
 if(a==='calendar-day'){selectedDay=el.dataset.date;render();return;}
 if(a==='month-prev'||a==='month-next'){month.setDate(1);month.setMonth(month.getMonth()+(a==='month-next'?1:-1));selectedDay=iso(month.getFullYear(),month.getMonth()+1,1);render();return;}
 if(a==='respond'){await applyResponse(id,el.dataset.response);return;}
 if(a==='nudge'){await work(()=>API.nudge(id,el.dataset.person),'Persönliche Erinnerung in der App verschickt.',async()=>showModal('event',id));return;}
 if(a==='alternative'){showModal('alternative',id);return;}
 if(a==='edit-event'){showModal('edit',id);return;}
 if(a==='move-event'){showModal('move',id);return;}
 if(a==='cancel-event'){const e=data.events.find(x=>x.id===id);if(!e||e.creator_user_id!==user.id)return;if(!confirm('Termin wirklich absagen? Alle Eingeladenen erhalten eine Nachricht in der App.'))return;
   await work(()=>API.updateEvent(id,{status:'cancelled'}),'Termin abgesagt.',async()=>showModal('event',id));return;}
 if(a==='accept-alternative'){const e=data.events.find(x=>x.id===id),alt=data.alternatives.find(a=>a.id===el.dataset.alt&&a.event_id===id);if(!e||e.creator_user_id!==user.id||!alt)return;
  if((e.response_deadline||e.event_date)>alt.proposed_date){toast('Antwortfrist liegt nach dem vorgeschlagenen Termin. Bitte über „Verschieben“ anpassen.');return;}
  if(!confirm('Alternativtermin übernehmen? Bestehende Antworten verlieren ihre Gültigkeit.'))return;
  await work(()=>API.updateEvent(id,{event_date:alt.proposed_date,event_time:alt.proposed_time}),'Termin verschoben.',async()=>showModal('event',id));return;}
});
document.addEventListener('submit',async ev=>{
 const form=ev.target;ev.preventDefault();const id=form.id;
 if(id==='register-form'){const d=new FormData(form),code=String(d.get('code')||'').trim(),email=String(d.get('email')||'').trim(),password=String(d.get('password')||'');if(password.length<10){toast('Passwort mindestens 10 Zeichen');return;}await work(async()=>{await API.registerWithInvite(code,email,password);await API.login(email,password);user=await API.getUser();if(!user)throw Error('Anmeldung nach Registrierung fehlgeschlagen');await fetchData();if(mode!=='ready')throw Error('Familienprofil konnte nicht zugeordnet werden');localStorage.setItem('fz11-show-install','yes');unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);inviteCode='';history.replaceState(null,'',location.pathname);},'Willkommen in Familienzeit!');return;}
 if(id==='claim-form'){const code=String(new FormData(form).get('code')||'').trim();if(!code)return;await work(()=>API.claimInviteCode(code),'Dein Familienprofil ist aktiviert.',async()=>{closeModal();render();});return;}
 if(id==='login-form'){const d=new FormData(form);await work(async()=>{await API.login(String(d.get('email')).trim(),String(d.get('password')));user=await API.getUser();if(!user)throw Error('Anmeldung fehlgeschlagen');await fetchData();if(mode==='ready'){unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);await openDeeplink();}},'Angemeldet.');return;}
 if(mode!=='ready')return;
 if(id==='new-event-form')await saveNewEvent(form);
 else if(id==='edit-event-form')await saveExistingEvent(form);
 else if(id==='move-event-form')await moveEvent(form);
 else if(id==='alternative-form')await saveAlternative(form);
 else if(id==='profile-form')await saveProfile(form);
 else if(id==='comment-form'){const text=String(new FormData(form).get('message')||'').trim();if(!text)return;await work(()=>API.addComment(form.dataset.id,user.id,text),'Kommentar gespeichert.',async()=>showModal('event',form.dataset.id));}
});
let invitePreviewTimer=null;document.addEventListener('input',ev=>{if(ev.target.closest('#new-event-form'))storeEventDraft();if(ev.target.name==='code'&&ev.target.closest('#register-form')){inviteCode=ev.target.value.trim().toLowerCase();clearTimeout(invitePreviewTimer);if(/^[0-9a-f]{24}$/.test(inviteCode))invitePreviewTimer=setTimeout(loadInvitePreview,500);}});
document.addEventListener('change',async ev=>{if(ev.target.closest('#new-event-form'))storeEventDraft();
 const input=ev.target;
 if(input.dataset.action==='companion'&&mode==='ready')await updateCompanions(input);
 if(input.name==='kind'&&currentForm()){
   const selected=input.value;
   for(const cover of currentForm().querySelectorAll('.cover-preview')){
     cover.className=cover.className.replace(/category-[a-z]+/g,'category-'+selected);
     const art=cover.querySelector('.preview-art');if(art)art.innerHTML=icon(typeIcon(selected),34);
   }
 }
});
// Ein Update wird auch in einem bereits geoeffneten PWA-Fenster sichtbar angeboten.
// Anders als beim automatischen Reload bleiben ungespeicherte Eingaben unangetastet.
const APP_VERSION=document.querySelector('meta[name="familienzeit-version"]')?.content||'1.1';
let checkingVersion=false,availableVersion='';
function updateNotice(version){
 availableVersion=version;
 let box=document.querySelector('#app-update-notice');
 if(!box){box=document.createElement('div');box.id='app-update-notice';document.body.appendChild(box);}
 box.className='app-update-notice';
 box.setAttribute('role','status');
 box.innerHTML=`<span class="update-notice-icon">${icon('refresh',22)}</span><span class="update-notice-text"><strong>Update verfügbar</strong><small>Neue Version ${safe(version)} bereit</small></span><button type="button" data-action="apply-update">Aktualisieren</button>`;
}
async function checkForAppUpdate(){
 if(checkingVersion||document.visibilityState==='hidden'||!navigator.onLine)return;
 checkingVersion=true;
 try{
  const url=new URL('./index.html',location.href);url.searchParams.set('update-check',String(Date.now()));
  const res=await fetch(url,{cache:'no-store'});
  if(!res.ok)return;
  const html=await res.text();
  const version=html.match(/<meta\s+name=["']familienzeit-version["']\s+content=["']([^"']+)["']/i)?.[1];
  if(version&&version!==APP_VERSION){updateNotice(version);const reg=await navigator.serviceWorker?.getRegistration();reg?.update().catch(()=>{});}
 }catch(e){console.info('Update-Pruefung wird wiederholt',e)}finally{checkingVersion=false;}
}
async function applyAvailableUpdate(){
 const button=document.querySelector('#app-update-notice button');if(button){button.disabled=true;button.textContent='Lade …';}
 try{
  const reg=await navigator.serviceWorker?.getRegistration();
  await reg?.update();
  if(reg?.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
 }catch(e){console.info('Service Worker aktualisiert sich beim Aufruf',e)}
 const target=new URL('./index.html',location.href);
 target.searchParams.set('v',availableVersion||String(Date.now()));
 location.replace(target.href);
}
window.addEventListener('pageshow',()=>setTimeout(checkForAppUpdate,1200));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForAppUpdate();});
window.addEventListener('focus',()=>checkForAppUpdate());
window.setInterval(checkForAppUpdate,60000);
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
 navigator.serviceWorker.register('./sw.js?v=110',{updateViaCache:'none'}).then(reg=>reg.update()).catch(console.warn);
}
navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='APP_UPDATED'&&e.data.version!==APP_VERSION)updateNotice(e.data.version);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;});
boot();
