/* Familienzeit 2.0.2 · Dashboard- und Interaktionsverbesserungen */
import * as API from './backend.js?v=202';

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
 'view-cards':'<rect x="2" y="3" width="9" height="8" rx="2"/><rect x="13" y="3" width="9" height="8" rx="2"/><rect x="2" y="13" width="9" height="8" rx="2"/><rect x="13" y="13" width="9" height="8" rx="2"/>',
 'view-list':'<path d="M9 6h12M9 12h12M9 18h12"/><path d="M3 6h2M3 12h2M3 18h2"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/>'
};
function icon(name,size=22){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path[name]||path.info}</svg>`;}
function safe(s){return String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
// In-app demo pickers. The original form controls retain ISO values for the existing
// submission logic, but are not exposed to touch or focus (no OS date/time sheet).
let fzPicker=null;
function pickerValueLabel(input){
 if(!input.value)return input.type==='time'?'Uhrzeit wählen':input.type==='datetime-local'?'Datum und Uhrzeit wählen':'Datum wählen';
 if(input.type==='date')return fmt(input.value,{day:'2-digit',month:'2-digit',year:'numeric'});
 if(input.type==='datetime-local')return fmt(input.value.slice(0,10),{day:'2-digit',month:'2-digit',year:'numeric'})+' · '+input.value.slice(11,16);
 return input.value+' Uhr';
}
function installInAppPickers(form){
 if(!form)return;
 for(const input of form.querySelectorAll('input[type="date"],input[type="time"],input[type="datetime-local"]')){
  if(input.dataset.fzCustom==='yes')continue;
  input.dataset.fzCustom='yes';input.classList.add('fz-picker-original');input.tabIndex=-1;
  const field=input.closest('label.field');
  if(field){const wrap=document.createElement('div');wrap.className=field.className+' fz-picker-field';while(field.firstChild)wrap.appendChild(field.firstChild);field.replaceWith(wrap);}
  const btn=document.createElement('button');btn.type='button';btn.className='fz-picker-opener';btn.dataset.fzOpen='yes';btn.setAttribute('aria-label','Datum oder Uhrzeit auswählen');
  btn.innerHTML='<span>'+safe(pickerValueLabel(input))+'</span>'+icon('down',18);
  input.insertAdjacentElement('afterend',btn);
 }
}
function closeFzPicker(){document.getElementById('fz-picker-layer')?.remove();fzPicker=null;}
function pickerDateParts(v){const x=v&&/^\d{4}-\d{2}-\d{2}/.test(v)?v.slice(0,10):localDate();return {year:+x.slice(0,4),month:+x.slice(5,7),date:x};}
function openFzPicker(input){
 if(!input)return;
 closeFzPicker();
 const isDate=input.type==='date',isCombined=input.type==='datetime-local';
 const parts=pickerDateParts(input.value);
 fzPicker={input,year:parts.year,month:parts.month,date:parts.date,time:(isCombined?input.value.slice(11,16):input.value)||'15:00',screen:isDate?'date':isCombined?'date':'time',combined:isCombined};
 renderFzPicker();
}
function pickerCalendarMarkup(){
 const p=fzPicker,offset=(new Date(p.year,p.month-1,1).getDay()+6)%7,last=new Date(p.year,p.month,0).getDate();
 let days='<div class="fz-picker-days">'+['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>'<small>'+x+'</small>').join('');
 for(let i=0;i<offset;i++)days+='<span></span>';
 for(let d=1;d<=last;d++){
  const v=iso(p.year,p.month,d),disabled=!!p.input.min&&v<p.input.min;
  days+='<button type="button" data-fz-day="'+v+'" '+(disabled?'disabled':'')+' class="'+(v===p.date?'is-picked':'')+' '+(v===localDate()?'is-today':'')+'" aria-label="'+safe(fmt(v))+'">'+d+'</button>';
 }
 return '<div class="fz-picker-month"><button type="button" data-fz-nav="-1" aria-label="Vorheriger Monat">'+icon('left',22)+'</button><strong>'+new Date(p.year,p.month-1,10).toLocaleDateString('de-DE',{month:'long',year:'numeric'})+'</strong><button type="button" data-fz-nav="1" aria-label="Nächster Monat">'+icon('chevron',22)+'</button></div>'+days+'</div>';
}
function pickerTimeMarkup(){
 const p=fzPicker;const [hr,min]=p.time.match(/^\d\d:\d\d$/)?p.time.split(':').map(Number):[15,0];
 return '<p class="fz-picker-hint">Stunde und Minute auswählen.</p><div class="fz-picker-two-columns"><section><h4>Stunde</h4><div class="fz-picker-scroll">'+Array.from({length:24},(_,i)=>'<button type="button" data-fz-hour="'+i+'" class="'+(hr===i?'is-picked':'')+'">'+String(i).padStart(2,'0')+'</button>').join('')+'</div></section><section><h4>Minute</h4><div class="fz-picker-scroll">'+Array.from({length:60},(_,i)=>'<button type="button" data-fz-min="'+i+'" class="'+(min===i?'is-picked':'')+'">'+String(i).padStart(2,'0')+'</button>').join('')+'</div></section></div><div class="fz-picker-time-preview">'+safe(p.time)+' Uhr</div>';
}
function renderFzPicker(){
 if(!fzPicker)return;
 const p=fzPicker;let root=document.getElementById('fz-picker-layer');if(!root){root=document.createElement('div');root.id='fz-picker-layer';document.body.append(root);}
 root.className='fz-picker-layer';
 root.innerHTML='<div class="fz-picker-backdrop" data-fz-close="yes"></div><section class="fz-picker-dialog" role="dialog" aria-modal="true" aria-label="Datum und Uhrzeit auswählen"><div class="fz-picker-head"><div><small>FAMILIENZEIT</small><h3>'+(p.screen==='date'?'Datum auswählen':'Uhrzeit auswählen')+'</h3></div><button type="button" data-fz-close="yes" aria-label="Schließen">'+icon('x',24)+'</button></div>'+(p.screen==='date'?pickerCalendarMarkup():pickerTimeMarkup())+(p.input.required?'':'<button type="button" class="fz-picker-clear" data-fz-clear="yes">Auswahl entfernen</button>')+'<div class="fz-picker-actions"><button type="button" data-fz-close="yes">Abbrechen</button><button type="button" class="fz-picker-confirm" data-fz-confirm="yes">'+(p.combined&&p.screen==='date'?'Weiter zur Uhrzeit':'Übernehmen')+'</button></div></section>';
 root.querySelector('.is-picked')?.scrollIntoView({block:'nearest'});
}
function confirmFzPicker(){
 const p=fzPicker;if(!p)return;
 if(p.combined&&p.screen==='date'){p.screen='time';renderFzPicker();return;}
 const val=p.combined?p.date+'T'+p.time:p.input.type==='date'?p.date:p.time;
 p.input.value=val;
 p.input.dispatchEvent(new Event('change',{bubbles:true}));
 const opener=p.input.nextElementSibling;const span=opener?.querySelector('span');if(span)span.textContent=pickerValueLabel(p.input);
 closeFzPicker();
}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-fz-clear]')&&fzPicker){const p=fzPicker;p.input.value='';p.input.dispatchEvent(new Event('change',{bubbles:true}));const label=p.input.nextElementSibling?.querySelector('span');if(label)label.textContent=pickerValueLabel(p.input);closeFzPicker();return;}
 const open=e.target.closest('[data-fz-open]');if(open){e.preventDefault();openFzPicker(open.previousElementSibling);return;}
 const close=e.target.closest('[data-fz-close]');if(close){e.preventDefault();closeFzPicker();return;}
 const sel=e.target.closest('[data-fz-day]');if(sel&&fzPicker){fzPicker.date=sel.dataset.fzDay;renderFzPicker();return;}
 const nav=e.target.closest('[data-fz-nav]');if(nav&&fzPicker){const x=new Date(fzPicker.year,fzPicker.month-1+Number(nav.dataset.fzNav),1);fzPicker.year=x.getFullYear();fzPicker.month=x.getMonth()+1;renderFzPicker();return;}
 const hr=e.target.closest('[data-fz-hour]');if(hr&&fzPicker){fzPicker.time=String(hr.dataset.fzHour).padStart(2,'0')+':'+fzPicker.time.slice(3,5);renderFzPicker();return;}
 const mi=e.target.closest('[data-fz-min]');if(mi&&fzPicker){fzPicker.time=fzPicker.time.slice(0,2)+':'+String(mi.dataset.fzMin).padStart(2,'0');renderFzPicker();return;}
 if(e.target.closest('[data-fz-confirm]')){confirmFzPicker();return;}
},true);
document.addEventListener('keydown',e=>{if(fzPicker&&e.key==='Escape'){e.preventDefault();closeFzPicker();}});

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
function appointmentTime(e){const start=String(e.event_time||'').slice(0,5);const end=e.end_time?String(e.end_time).slice(0,5):'';return start+(end?'–'+end:'')+' Uhr';}
const colorName=id=>COLORS.find(v=>v.id===id)?.name||'Blau';
function toast(msg){const el=$('#toast-root');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{el.classList.remove('show');},4400);}
let homeFilter='all';
let page='home',modal=null,user=null,mode='loading',lastError='',loadingAction=false,month=new Date(),selectedDay=localDate(),birthdayDraft=null;
let installEvent=null, pushEnabled=false;const invitationFromUrl=new URLSearchParams(location.search).get('invite')||'';
let inviteCode=/^[0-9a-f]{24}$/i.test(invitationFromUrl)?invitationFromUrl.toLowerCase():'';let invitePerson='',draftSaveTimer=null;
let unsubscribe=null,refreshTimeout=null,avatarCache=new Map(),peopleById=new Map(),accountsByUser=new Map();
// File inputs cannot survive DOM replacement: retain the selected object independently.
const selectedAvatarFiles=new Map();
let data={people:[],person_managers:[],events:[],event_invites:[],rsvps:[],rsvp_attendees:[],comments:[],alternatives:[],notifications:[],event_reminder_preferences:[],event_cohosts:[],event_poll_options:[],event_poll_ballots:[],event_poll_votes:[]};
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
function cohostIds(eventId){return data.event_cohosts.filter(h=>h.event_id===eventId).map(h=>h.person_id);}
function allHosts(e){const primary=accountsByUser.get(e.creator_user_id);return [primary,...cohostIds(e.id).map(id=>person(id))].filter(Boolean);}
function hostNames(e){return allHosts(e).map(p=>p.display_name).join(' & ')||'Familie';}
function isEventAdmin(e){return !!e&&(e.creator_user_id===user?.id||cohostIds(e.id).some(id=>person(id).auth_user_id===user?.id));}
function isPoll(e){return e?.planning_mode==='poll';}
function openPoll(e){return isPoll(e)&&e.poll_state==='voting'&&new Date(e.poll_deadline).getTime()>Date.now()&&e.status==='active';}
function ballotFor(e){return data.event_poll_ballots.find(b=>b.event_id===e.id&&b.voter_user_id===user?.id)||null;}
function eventInvites(id){return data.event_invites.filter(i=>i.event_id===id).map(i=>i.person_id);}
function responseFor(id,personId){const p=person(personId),e=data.events.find(x=>x.id===id);if(!e||!p.auth_user_id)return null;return data.rsvps.find(r=>r.event_id===id&&r.revision===e.revision&&r.responder_user_id===p.auth_user_id)||null;}
function guestsFor(event_id,responder_user_id,revision){return data.rsvp_attendees.filter(a=>a.event_id===event_id&&a.responder_user_id===responder_user_id&&a.revision===revision).map(a=>a.person_id);}
function guestsTotal(e){const ids=new Set(allHosts(e).map(p=>p.id));for(const r of data.rsvps.filter(r=>r.event_id===e.id&&r.revision===e.revision&&r.status==='yes'))for(const p of guestsFor(e.id,r.responder_user_id,r.revision))ids.add(p);return ids.size;}
function pendingEvents(){const own=me();if(!own)return [];return data.events.filter(e=>futureEvent(e)&&eventInvites(e.id).includes(own.id)&&(isPoll(e)?openPoll(e)&&!ballotFor(e):!isEventAdmin(e)&&!responseFor(e.id,own.id))).sort(compareEventStarts);}
function compareEventStarts(a,b){
 const key=e=>isPoll(e)?String(e.poll_deadline||''):e.event_date+'T'+String(e.event_time);
 return key(a).localeCompare(key(b))||a.id.localeCompare(b.id);
}
function futureEvent(e){
 if(e.status!=='active')return false;
 if(isPoll(e))return e.poll_state==='voting'||(e.poll_state==='no_votes'&&isEventAdmin(e));
 return new Date(e.event_date+'T'+String(e.end_time||e.event_time).slice(0,5)+':00').getTime()>=Date.now();
}
function visibleToCurrentUser(e){const own=me();return !!own&&!!e&&(e.creator_user_id===user?.id||isEventAdmin(e)||eventInvites(e.id).includes(own.id));}
function upcomingEvents(){return data.events.filter(e=>visibleToCurrentUser(e)&&futureEvent(e)).sort(compareEventStarts);}
function isReminderExpired(n){
 if(!n.kind?.startsWith('personal_event_'))return false;
 const e=data.events.find(e=>e.id===n.event_id);
 return !e||e.status!=='active'||new Date(e.event_date+'T'+String(e.event_time).slice(0,5)+':00').getTime()<=Date.now();
}
function visibleNotifications(){return data.notifications.filter(n=>(!n.event_id||data.events.some(e=>e.id===n.event_id&&visibleToCurrentUser(e)))&&!isReminderExpired(n));}
function unread(){return visibleNotifications().filter(n=>!n.read_at);}
async function fetchAvatars(){await Promise.all(data.people.filter(p=>p.avatar_path).map(async p=>{const c=avatarCache.get(p.id);if(c?.path===p.avatar_path&&c?.until>Date.now())return;try{const url=await API.avatarUrl(p.avatar_path);avatarCache.set(p.id,{url,path:p.avatar_path,until:Date.now()+45*60*1000});}catch(err){console.warn('Profilbild nicht verfügbar:',err);}}));}
async function fetchData(){const oldIds=new Set(data.notifications.map(n=>n.id));const oldReady=mode==='ready';data=await API.readAll();peopleById=new Map(data.people.map(p=>[p.id,p]));accountsByUser=new Map(data.people.filter(p=>p.auth_user_id).map(p=>[p.auth_user_id,p]));if(!me()){mode='unlinked';render();return;}await fetchAvatars();mode='ready';render();if(oldReady)await notifyWhileOpen(data.notifications.filter(n=>!oldIds.has(n.id)));else await notifyWhileOpen(data.notifications.filter(n=>Date.now()-new Date(n.created_at).getTime()<120000));}
function scheduleRefresh(){clearTimeout(refreshTimeout);refreshTimeout=setTimeout(()=>{if(!loadingAction&&user)fetchData().catch(e=>{console.warn('Aktualisierung fehlgeschlagen',e);});},430);}
async function boot(){mode='loading';render();try{await API.connect();user=await API.getUser();if(!user){mode=inviteCode?'register':'login';render();if(inviteCode)loadInvitePreview();return;}await fetchData();API.isPushSubscribed().then(v=>{pushEnabled=v;}).catch(()=>{});unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);setInterval(()=>{if(user&&document.visibilityState==='visible')scheduleRefresh();},45000);window.addEventListener('focus',scheduleRefresh);await openDeeplink();}catch(e){console.error(e);lastError=e.message||'Verbindungsfehler';mode='error';render();}}
async function work(op,success,after){if(loadingAction)return;loadingAction=true;try{const result=await op();if(user)await fetchData();if(after)await after(result);if(success)toast(success);return result;}catch(err){console.error(err);toast('Nicht gespeichert: '+(err?.message||'Unbekannter Fehler'));}finally{loadingAction=false;}}
async function openDeeplink(){const params=new URLSearchParams(location.search),ev=params.get('event'),p=params.get('person');if(ev&&data.events.some(e=>e.id===ev&&visibleToCurrentUser(e)))showModal('event',ev);else if(p&&peopleById.has(p))showModal('person',p);if(ev||p)history.replaceState(null,'',location.pathname);}

function layout(){
 const own=me(),newCount=unread().length;
 return `<div class="app-shell"><header class="topbar"><div class="brand"><div class="brand-symbol">${icon('heart',25)}</div><div><strong>Familienzeit</strong></div></div><div class="header-tools"><button class="icon-btn ${newCount?'has-unread':''}" data-action="notifications" aria-label="Mitteilungen anzeigen${newCount?`, ${newCount} ungelesen`:''}">${icon('bell',25)}${newCount?`<i>${newCount>9?'9+':newCount}</i>`:''}</button><button class="avatar-trigger" data-action="account" aria-label="Mein Konto">${avatar(own)}</button></div></header><main>${page==='home'?homeView():page==='calendar'?calendarView():familyView()}</main></div><nav class="bottom-nav" aria-label="Hauptnavigation"><button class="nav-item ${page==='home'?'active':''}" data-action="page" data-page="home">${icon('home',26)}<span>Start</span></button><button class="nav-item ${page==='calendar'?'active':''}" data-action="page" data-page="calendar">${icon('calendar',26)}<span>Kalender</span></button><button class="nav-item create" data-action="new-event">${icon('plus',27)}<span>Termin</span></button><button class="nav-item ${page==='family'?'active':''}" data-action="page" data-page="family">${icon('users',26)}<span>Familie</span></button></nav>`;
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
function render(){
 const app=$('#app');app.innerHTML=mode==='ready'?layout():authView();
 if(modal&&mode==='ready'){
  // A focus/visibility event after Android's gallery picker can trigger fetchData().
  // Recreating the open profile sheet would discard the browser's selected File.
  const editingEvent=modal.type==='new'&&$('#new-event-form');
  const editingProfile=modal.type==='person'&&$('#profile-form')?.dataset.id===modal.id;
  const editingReminder=modal.type==='reminders'&&$('#reminder-form')?.dataset.id===modal.id;
  if(!editingEvent&&!editingProfile&&!editingReminder)renderModal();
 }else if(mode!=='ready')$('#modal-root').innerHTML='';
}
function greeting(){const h=new Date().getHours();return h<10?'Guten Morgen':h<18?'Hallo':'Guten Abend';}

// Personal dashboard presentation, stored per signed-in account. Default: full cards.
function homeViewMode(){
 try{return localStorage.getItem('fz-home-view-'+(user?.id||'guest'))==='list'?'list':'cards';}
 catch(_){return 'cards';}
}
function setHomeViewMode(mode){
 if(mode!=='list'&&mode!=='cards')return;
 try{localStorage.setItem('fz-home-view-'+(user?.id||'guest'),mode);}catch(_){/* private mode */}
}
function homeListRow(e,featured=false){
 const poll=isPoll(e),own=me(),r=responseFor(e.id,own.id),host=hostNames(e);
 const deadline=poll&&e.poll_deadline?new Date(e.poll_deadline):null;
 const rawDate=poll?deadline?.toLocaleDateString('sv-SE')||e.event_date:e.event_date;
 const day=+rawDate.slice(8,10),month=monthShort(rawDate);
 const time=poll?'Abstimmung':appointmentTime(e);
 const invitees=eventInvites(e.id).filter(id=>person(id)?.can_login).length;
 const accepted=new Set([...allHosts(e).map(p=>p.id),...data.rsvps.filter(v=>v.event_id===e.id&&v.revision===e.revision&&v.status==='yes').map(v=>accountsByUser.get(v.responder_user_id)?.id).filter(Boolean)]).size;
 const votes=data.event_poll_ballots.filter(v=>v.event_id===e.id).length;
 const days=poll?null:Math.max(0,daysBetween(localDate(),e.event_date));
 const countdown=poll?'':days===0?'Heute':days===1?'Morgen':'in '+days+' Tagen';
 const address=String(e.location_text||'').trim();
 const mapUrl=!poll?routeUrl(e):'';
 return `<article class="fz-list-row ${featured?'fz-list-next':''} ${themeClass(e)} card-color-${safe(e.card_color||'blue')}">
 <button type="button" class="fz-list-open" data-action="event" data-id="${safe(e.id)}" aria-label="${safe(e.title)} öffnen">
 <span class="fz-list-date"><small>${poll?'FRIST':safe(month)}</small><strong>${day}</strong></span>
 <span class="fz-list-text"><strong class="fz-list-title">${safe(e.title)}</strong><span class="fz-list-line">${safe(time)} <span aria-hidden="true">·</span> ${safe(host)}</span><span class="fz-list-stats">${poll?`${votes} abgestimmt`: `${invitees} eingeladen · ${accepted} zugesagt`}${countdown?' · '+countdown:''}</span></span>
 <span class="fz-list-chevron">${icon('chevron',19)}</span>
 </button>
 ${mapUrl?`<a class="fz-list-map" href="${mapUrl}" target="_blank" rel="noopener noreferrer" aria-label="Route nach ${safe(address)} in Google Maps öffnen" title="Route ansehen"><img class="fz-gmaps-real" src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="" loading="lazy" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none'"><span class="fz-maps-fallback" aria-hidden="true" style="display:block">${icon('map',23)}</span></a>`:''}
 </article>`;
}

function isHomePlace(value){
 const text=String(value||'').trim().toLocaleLowerCase('de-DE');
 return /^(bei uns(?: zu hause)?|zu hause|zuhause|bei uns daheim|daheim)(?:[.!])?$/.test(text);
}
function routeUrl(e){
 const address=String(e?.location_text||'').trim();
 // Home is a family shorthand, never geocode or navigate to its literal wording.
 if(!address||isHomePlace(address))return '';
 return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(address)+'&travelmode=driving&dir_action=navigate';
}
function meetingPlacePicker(value='',newEvent=false){
 const current=String(value||'').trim();
 const choice=isHomePlace(current)?'home':current?'address':'';
 const isHome=choice==='home',isAddress=choice==='address',place=isHome?'':current;
 return `<fieldset class="field-group meeting-place"><legend>Wo treffen wir uns? <span aria-label="Pflichtfeld">*</span></legend>
 <div class="meeting-choice"><label><input type="radio" name="meet_kind" value="home" ${isHome?'checked':''}><span>${icon('home',23)} <strong>Bei uns zu Hause</strong></span></label>
 <label><input type="radio" name="meet_kind" value="address" ${isAddress?'checked':''}><span>${icon('map',23)} <strong>Anderer Ort</strong></span></label></div>
 <div class="meeting-address" ${!isAddress?'hidden':''}><label class="field">Adresse oder Treffpunkt<input class="input place-query" name="location" maxlength="240" autocomplete="off" placeholder="Restaurant oder Straße eingeben …" value="${safe(place)}" ${isAddress?'required':''} ${!isAddress?'disabled':''}></label><div class="place-suggestions" role="listbox" aria-label="Ortsvorschläge" aria-live="polite" hidden></div><p class="place-source">${icon('map',14)} Vorschläge via Photon · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap-Mitwirkende</a> · Manuelle Eingabe möglich.</p></div>
 <p class="form-help meeting-helper">${isHome?'Den Gastgebern ist der Treffpunkt bekannt.':isAddress?'Bitte den Ort möglichst genau angeben. Daraus wird die Google-Maps-Route erstellt.':'Bitte eine der beiden Möglichkeiten auswählen.'}</p></fieldset>`;
}
function syncMeetingPlace(form){
 if(!form)return;
 const choice=form.querySelector('input[name="meet_kind"]:checked')?.value||'';
 const field=form.querySelector('.meeting-address'),input=form.querySelector('input[name="location"]'),hint=form.querySelector('.meeting-helper');
 if(field)field.hidden=choice!=='address';
 if(input){input.disabled=choice!=='address';input.required=choice==='address';}
 if(hint)hint.textContent=choice==='home'?'Den Gastgebern ist der Treffpunkt bekannt.':choice==='address'?'Bitte den Ort möglichst genau angeben. Daraus wird die Google-Maps-Route erstellt.':'Bitte eine der beiden Möglichkeiten auswählen.';
}
function meetingPlaceValue(form){
 const choice=form.querySelector('input[name="meet_kind"]:checked')?.value;
 if(choice==='home')return 'Bei uns zu Hause';
 if(choice!=='address')return '';
 return String(form.querySelector('input[name="location"]')?.value||'').trim();
}
let placeTimer=null,placeController=null,placeSequence=0;
function photoPlaceLabel(properties){
 const p=properties||{},parts=[];
 const name=String(p.name||'').trim(),street=[p.street,p.housenumber].filter(Boolean).join(' ').trim(),
 city=[p.postcode,p.city||p.town||p.village||p.municipality||p.county].filter(Boolean).join(' ').trim(),country=String(p.country||'').trim();
 for(const item of [name,street,city,country])if(item&&!parts.some(q=>q.toLowerCase()===item.toLowerCase()))parts.push(item);
 return parts.join(', ').slice(0,240);
}
function clearPlaceResults(form){const list=form?.querySelector('.place-suggestions');if(list){list.innerHTML='';list.hidden=true;}}
function searchPlace(input){
 const form=input.closest('form');if(!form)return;
 const query=input.value.trim(),list=form.querySelector('.place-suggestions');if(!list)return;
 clearTimeout(placeTimer);placeController?.abort();placeSequence++;const id=placeSequence;
 if(query.length<3){clearPlaceResults(form);return;}
 list.hidden=false;list.innerHTML='<span class="place-message">Suche nach passenden Orten …</span>';
 placeTimer=setTimeout(async()=>{
  placeController=new AbortController();
  try{
   const u=new URL('https://photon.komoot.io/api/');u.searchParams.set('q',query);u.searchParams.set('limit','5');u.searchParams.set('lang','de');
   const res=await fetch(u.toString(),{signal:placeController.signal,headers:{Accept:'application/json'}});
   if(!res.ok)throw Error('Der Suchdienst ist momentan nicht erreichbar.');
   const json=await res.json();if(id!==placeSequence||!list.isConnected||input.value.trim()!==query)return;
   const results=[...new Set((json.features||[]).map(x=>photoPlaceLabel(x.properties)).filter(Boolean))].slice(0,5);
   if(!results.length){list.innerHTML='<span class="place-message">Keine Treffer. Du kannst den Treffpunkt selbst eintragen.</span>';return;}
   list.innerHTML=results.map(label=>`<button type="button" role="option" class="place-result" data-action="pick-place" data-place="${safe(label)}">${icon('map',19)} <span>${safe(label)}</span></button>`).join('');
  }catch(err){if(err?.name==='AbortError')return;if(id!==placeSequence||!list.isConnected)return;
   list.innerHTML='<span class="place-message">Vorschläge momentan nicht verfügbar. Bitte Ort selbst eintragen.</span>';
  }
 },650);
}
function homeView(){
 const up=upcomingEvents(),pending=pendingEvents(),births=upcomingBirthdays();
 const imminent=births.filter(p=>p.next.days<=7).length;
 const own=me(),name=safe(own?.display_name||'Familie');
 const visible=homeFilter==='mine'?up.filter(e=>eventInvites(e.id).includes(own.id)):homeFilter==='pending'?pending:up;
 const currentFilter=homeFilter==='mine'?'Meine':homeFilter==='pending'?'Offene':'Alle';
 const installHint=!isInstalled()&&localStorage.getItem('fz11-show-install')==='yes';
 return ` ${typeof Notification!=='undefined'&&Notification.permission!=='granted'&&localStorage.getItem('fz13-hide-push')!=='yes'?`<div class="push-onboarding">${icon('bell',21)}<span><b>Keine Termine verpassen</b><small>Erinnerungen direkt aufs Smartphone bekommen</small></span><button type="button" data-action="push-guide">Aktivieren</button><button type="button" class="push-dismiss" aria-label="Hinweis ausblenden" data-action="push-dismiss">${icon('x',16)}</button></div>`:''}
 ${installHint?`<div class="install-hint">${icon('sparkle',20)} <span>Familienzeit wie eine App nutzen</span><button data-action="install-guide">Installieren</button><button class="install-hint-dismiss" aria-label="Hinweis ausblenden" data-action="install-dismiss">${icon('x',17)}</button></div>`:''}
 ${pending.length?`<button class="pending-action" type="button" data-action="pending"><span class="pending-action-icon">${icon('bell',25)}</span><span class="pending-action-copy"><strong>${pending.length===1?(isPoll(pending[0])?'Eine Abstimmung offen':'Eine Rückmeldung offen'):`${pending.length} Einladungen / Abstimmungen offen`}</strong><small>Tippen und auswählen</small></span>${icon('chevron',24)}</button>`:''}
 <div class="dashboard-section-head"><div><h2>Unsere Termine</h2></div><div class="fz-dashboard-controls"><button type="button" class="fz-view-button" data-action="home-view" aria-label="${homeViewMode()==='cards'?'Zur kompakten Listenansicht wechseln':'Zur großen Kartenansicht wechseln'}" title="${homeViewMode()==='cards'?'Listenansicht':'Kartenansicht'}">${icon(homeViewMode()==='cards'?'view-list':'view-cards',22)}</button><button class="dashboard-filter" type="button" data-action="home-filter" aria-label="Termine filtern, aktuell ${currentFilter}">${currentFilter} ${icon('down',18)}</button></div></div>
 <section class="event-list dashboard-events ${homeViewMode()==='list'?'fz-dashboard-list':'fz-dashboard-cards'}" aria-label="Anstehende Familientermine">
 ${visible.length?visible.map((e,i)=>homeViewMode()==='list'?homeListRow(e,i===0):eventCard(e,i===0)).join(''):`<div class="empty-state home-empty">${icon('calendar',34)}<h3>${homeFilter==='all'?'Noch keine Termine':'Keine passenden Termine'}</h3><p>${homeFilter==='all'?'Plane euren nächsten gemeinsamen Moment.':'Wechsle zu „Alle“, um alle Termine zu sehen.'}</p>${homeFilter==='all'?`<button class="btn primary" data-action="new-event">Termin erstellen</button>`:''}</div>`}
 </section>`;
}
function birthdayOverview(){
 const birthdays=upcomingBirthdays();
 return `<div class="birthday-overview">${birthdays.length?birthdays.map(p=>`<button class="birthday-overview-row" type="button" data-action="person" data-id="${p.id}" aria-label="Geburtstag von ${safe(p.display_name)} ansehen">${avatar(p,'lg')}<span class="birthday-overview-copy"><strong>${safe(p.display_name)}</strong><small>${safe(fmt(p.next.date,{day:'numeric',month:'long'}))}${p.next.days<=7?` · ${p.next.days===0?'Heute':p.next.days===1?'Morgen':`in ${p.next.days} Tagen`}`:''}</small></span>${icon('chevron',22)}</button>`).join(''):`<div class="birthday-none">${icon('gift',31)}<p>Noch keine Geburtstage eingetragen.</p></div>`}<button class="btn secondary wide birthday-manage" type="button" data-action="page" data-page="family">${icon('users',20)} Geburtstage bearbeiten</button></div>`;
}
function birthdayMini(p){const b=p.next;return `<button class="birthday-mini" data-action="person" data-id="${p.id}" aria-label="Geburtstag von ${safe(p.display_name)} ansehen"><span class="birthday-photo">${avatar(p,'lg')}<i>${icon('gift',15)}</i></span><span class="birthday-copy"><strong>${safe(p.display_name)}</strong><small>${fmt(b.date,{day:'numeric',month:'short'})}</small><span class="tiny-pill">${b.days===0?'Heute!':b.days===1?'Morgen':`In ${b.days} Tagen`}</span></span></button>`;}
function themeClass(e){return `category-${/^(coffee|birthday|dining|gathering|party|trip|holiday|other)$/.test(e.kind)?e.kind:'other'} cover-${/^(soft|illustrated|warm)$/.test(e.cover_style)?e.cover_style:'illustrated'}`;}
function responseLabel(r){return !r?'Antwort offen':r.status==='yes'?'Zugesagt':r.status==='no'?'Abgesagt':'Vielleicht';}
function eventCard(e,featured=false){
 const own=me(),r=responseFor(e.id,own.id),invited=eventInvites(e.id).includes(own.id),poll=isPoll(e);
 const host=accountsByUser.get(e.creator_user_id),hostLabel=hostNames(e);
 const status=isEventAdmin(e)&&!poll?'Gastgeber':!invited?'':r?.status==='yes'?'Zugesagt':r?.status==='no'?'Abgesagt':r?.status==='maybe'?'Vielleicht':'Antwort offen';
 const statusClass=isEventAdmin(e)&&!poll?'yes':r?.status||'open',statusIcon=isEventAdmin(e)&&!poll?'check':r?.status==='yes'?'check':r?.status==='no'?'x':r?.status==='maybe'?'info':'clock';
 const comments=data.comments.filter(c=>c.event_id===e.id).length;
 const count=data.event_poll_options.filter(o=>o.event_id===e.id).length;
 const voted=data.event_poll_ballots.filter(v=>v.event_id===e.id).length;
 const deadline=poll&&e.poll_deadline?new Date(e.poll_deadline):null;
 const pollDay=deadline?String(deadline.getDate()).padStart(2,'0'):'–';
 const pollMonth=deadline?deadline.toLocaleDateString('de-DE',{month:'short'}).replace('.','').toUpperCase():'ABST';
 const pollLabel=e.poll_state==='no_votes'?'Kein Ergebnis':openPoll(e)?ballotFor(e)?'Abgestimmt':'Jetzt abstimmen':'Wird ausgewertet';
 const invitations=new Set(eventInvites(e.id)).size;
 const yesVotes=new Set([...allHosts(e).map(p=>p.id),...data.rsvps.filter(v=>v.event_id===e.id&&v.revision===e.revision&&v.status==='yes').map(v=>accountsByUser.get(v.responder_user_id)?.id).filter(Boolean)]).size;
 const days=poll?null:Math.max(0,daysBetween(localDate(),e.event_date));
 const countdown=days===0?'Heute':days===1?'Morgen':`in ${days} Tagen`;
 const address=String(e.location_text||'').trim();
 const maps=routeUrl(e)&&!poll?`<a class="demo-map-link" title="Route mit Google Maps anzeigen" aria-label="Route nach ${safe(address)} in Google Maps öffnen" target="_blank" rel="noopener noreferrer" href="${routeUrl(e)}"><img class="fz-gmaps-real" src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="" loading="lazy" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none'"><span class="fz-maps-fallback" aria-hidden="true" style="display:block">${icon('map',23)}</span></a>`:'';
 return `<article class="event-card family-event-card demo-refined-card ${featured?'is-next-event':''} ${poll?'is-poll-card':''} ${themeClass(e)} card-color-${safe(e.card_color||'blue')}">
  <span class="family-event-watermark demo-stronger-motif" aria-hidden="true">${icon(poll?'calendar':typeIcon(e.kind),126)}</span>
  <button class="demo-open-card" type="button" data-action="event" data-id="${e.id}" aria-label="${safe(e.title)}, Details öffnen">
   <span class="family-event-main">
    <span class="family-date-tile"><span class="family-date-month">${poll?'FRIST':monthShort(e.event_date)}</span><strong>${poll?pollDay:+e.event_date.slice(8,10)}</strong><span class="family-date-weekday">${poll?pollMonth:weekday(e.event_date)}</span><span class="family-date-symbol" aria-hidden="true">${icon(poll?'calendar':typeIcon(e.kind),21)}</span></span>
    <span class="family-event-info"><span class="family-event-category">${poll?'TERMINABSTIMMUNG · '+safe(typeName(e.kind)):safe(typeName(e.kind))}</span><strong class="family-event-title">${safe(e.title)}</strong><span class="family-event-time">${icon('clock',19)} ${poll?`Abstimmung bis ${safe(deadline?.toLocaleDateString('de-DE')||'')}`:safe(appointmentTime(e))}</span><span class="family-event-host">${host?avatar(host,'xs'):icon('users',19)} <span class="host-identity"><b>Organisiert von</b><strong>${safe(hostLabel)}</strong></span></span></span>
    <span class="family-event-chevron" aria-hidden="true">${icon('chevron',22)}</span>
   </span>
   <span class="family-event-teaser ${e.teaser?'':'is-empty'}" ${e.teaser?'':'aria-hidden="true"'} title="${safe(e.teaser||'')}">${safe(e.teaser||'')}</span>
  </button>
  <div class="demo-counts-row" aria-label="${poll?count+' Optionen, '+voted+' Abstimmungen':invitations+' eingeladen, '+yesVotes+' zugesagt'}">
    ${poll?`<span>${icon('calendar',17)} ${count} Vorschläge</span><span>${icon('users',17)} ${voted} abgestimmt</span>`:`<span>${icon('users',18)} ${invitations} eingeladen</span><span class="demo-confirmed">${icon('check',17)} ${yesVotes} zugesagt</span>`}
    ${!poll?`<span class="demo-countdown">${icon('calendar',15)} ${countdown}</span>`:''}
  </div>
  <div class="family-event-footer demo-footer"><span class="family-event-stats"><span>${icon('message',18)} ${comments} Kommentare</span></span><span class="demo-footer-actions">${maps}${poll?`<span class="family-event-status ${e.poll_state==='no_votes'?'no':'open'}">${icon('calendar',16)} ${safe(pollLabel)}</span>`:status?`<span class="family-event-status ${statusClass}">${icon(statusIcon,16)} ${safe(status)}</span>`:''}</span></div>
 </article>`;
}

function calendarView(){
 const y=month.getFullYear(),m=month.getMonth()+1,first=(new Date(y,m-1,1).getDay()+6)%7,last=new Date(y,m,0).getDate();let cells='';
 for(let i=0;i<first;i++)cells+='<span class="date-gap"></span>';
 for(let d=1;d<=last;d++){
   const date=iso(y,m,d),dayMatches=data.events.filter(e=>visibleToCurrentUser(e)&&e.status!=='cancelled'&&(isPoll(e)?new Date(e.poll_deadline).toLocaleDateString('sv-SE')===date:e.event_date===date)),hasEvent=dayMatches.length>0,birthdayPeople=data.people.filter(p=>birthdayInYear(p,y)===date),birthday=birthdayPeople.length>0;
   const birthdayName=birthdayPeople.map(p=>p.display_name).join(', ');
   cells+=`<button class="calendar-day ${hasEvent?'has-event fz-day-'+safe(dayMatches[0].card_color||'blue'):''} ${birthday?'has-birthday':''} ${date===selectedDay?'selected':''} ${date===localDate()?'today':''}" data-action="calendar-day" data-date="${date}" title="${birthday?safe('Geburtstag: '+birthdayName):safe(fmt(date))}" aria-label="${safe(fmt(date))}${birthday?', Geburtstag von '+safe(birthdayName):''}${hasEvent?', Termin':''}"><span class="calendar-day-number">${d}</span><span class="day-dots">${birthday?`<span class="birthday-calendar-gift" aria-hidden="true">${icon('gift',15)}</span>`:''}${dayMatches.length===1?`<span class="fz-calendar-event-symbol" aria-hidden="true">${icon(typeIcon(dayMatches[0].kind),17)}</span>`:''}${dayMatches.length>1?dayMatches.slice(0,3).map(e=>`<span class="fz-calendar-mark fz-mark-${safe(e.card_color||'blue')}" title="${safe(e.title)}" aria-hidden="true"></span>`).join(''):''}</span></button>`;
 }
 const date=selectedDay,dayEvents=data.events.filter(e=>visibleToCurrentUser(e)&&e.status!=='cancelled'&&(isPoll(e)?new Date(e.poll_deadline).toLocaleDateString('sv-SE')===date:e.event_date===date)).sort((a,b)=>String(a.event_time).localeCompare(String(b.event_time))),birthdays=data.people.filter(p=>birthdayInYear(p,+date.slice(0,4))===date);
 return `<div class="page-head"><p class="eyebrow">ALLES AUF EINEN BLICK</p><h1>Unser Kalender</h1><p>Deine Termine und die Geburtstage der Familie.</p></div><section class="calendar-panel"><div class="month-heading"><h2>${safe(month.toLocaleDateString('de-DE',{month:'long',year:'numeric'}))}</h2><div class="month-controls"><button class="fz-today-button" type="button" data-action="calendar-today">Heute</button><button class="fz-cal-gift" type="button" data-action="birthdays" aria-label="Geburtstage anzeigen" title="Geburtstage">${icon('gift',21)}</button><button data-action="month-prev" aria-label="Vorheriger Monat">${icon('left',22)}</button><button data-action="month-next" aria-label="Nächster Monat">${icon('chevron',22)}</button></div></div><div class="weekday-grid">${['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span>${x}</span>`).join('')}</div><div class="month-grid">${cells}</div><div class="calendar-legend"><span>${icon('gift',17)} Geburtstag</span><span><i class="fz-calendar-mark fz-mark-blue"></i> Termine in Kartenfarbe</span></div></section>
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
function showModal(type,id=null){if(modal?.type==='new')storeEventDraft();if(type==='new')wizardStep=0;modal={type,id};renderModal();document.body.classList.add('modal-open');}
function closeModal(){if(modal?.type==='new')storeEventDraft();modal=null;$('#modal-root').innerHTML='';document.body.classList.remove('modal-open');}
function renderModal(){if(!modal)return;if(modal.type==='new')storeEventDraft();let title='',body='',eyebrow='FAMILIENZEIT';const {type,id}=modal;
 if(type==='event'){const e=data.events.find(e=>e.id===id);if(!e){closeModal();return;}title=isPoll(e)?'Terminabstimmung':'Einladung';eyebrow='TERMINDETAILS';body=eventDetail(e);}
 else if(type==='reminders'){const e=data.events.find(e=>e.id===id);if(!e){closeModal();return;}title='Meine Erinnerungen';eyebrow='NUR FÜR DICH';body=personalReminderForm(e);}
 else if(type==='new'){title=birthdayDraft?'Geburtstag planen':'Neuen Termin planen';eyebrow='WIR SEHEN UNS';body=newEventForm();}
 else if(type==='edit'){title='Termin bearbeiten';body=editEventForm(data.events.find(e=>e.id===id));}
 else if(type==='move'){title='Termin verschieben';body=moveEventForm(data.events.find(e=>e.id===id));}
 else if(type==='cancel'){title='Termin absagen';eyebrow='NUR FÜR GASTGEBER';body=cancelEventForm(data.events.find(e=>e.id===id));}
 else if(type==='alternative'){title='Alternativtermin';body=alternativeForm(data.events.find(e=>e.id===id));}
 else if(type==='person'){const p=person(id);title=p.display_name;eyebrow='FAMILIENPROFIL';body=personDetail(p);}
 else if(type==='account'){title='Mein Konto';body=accountView();}
 else if(type==='notifications'){title='Mitteilungen';eyebrow='NEUES AUS DER FAMILIE';body=notificationsView();}
 else if(type==='pending'){title='Noch zu beantworten';eyebrow='DEINE OFFENEN EINLADUNGEN';body=pendingView();}
 else if(type==='birthdays'){title='Geburtstage';eyebrow='UNSERE FAMILIE';body=birthdayOverview();}
 else if(type==='invite'){const p=person(id);title='Einladung für '+p.display_name;eyebrow='EINFACHER ERSTZUGANG';const link=invitationLink(modal.code||'');body=`<p class="form-help">${safe(p.display_name)} öffnet den Link und richtet das eigene Passwort ein. Das Profil wird automatisch mit eurem gemeinsamen Kalender verbunden.</p><div class="invitation-code">${safe(link)}</div><button class="btn primary wide" data-action="share-invite">${icon('send',19)} Einladung teilen</button><button class="btn secondary wide" data-action="copy-invite">${icon('check',19)} Link kopieren</button><p class="form-help notice">Der Link gilt 14 Tage und lässt sich nur einmal verwenden. Bitte nur der vorgesehenen Person schicken.</p>`;}
 else if(type==='install'){title='Familienzeit installieren';eyebrow='AUF DEINEM HANDY';body=installGuide();}
 else if(type==='push-guide'){title='Benachrichtigungen';eyebrow='AUF DEINEM SMARTPHONE';body=pushGuide();}
 $('#modal-root').innerHTML=modalFrame(title,body,eyebrow);if(type==='new'){restoreEventDraft();toggleNewEventMode($('#new-event-form'));syncMeetingPlace($('#new-event-form'));syncGuestPicker($('#new-event-form'));updateWizardHostSummary($('#new-event-form'));setWizardStep(wizardStep,false);installInAppPickers($('#new-event-form'));}if(type==='edit'){syncMeetingPlace($('#edit-event-form'));syncGuestPicker($('#edit-event-form'));}
}
function colorPicker(selected='blue'){
 return `<fieldset class="field-group color-field"><legend>Farbe auswählen</legend><p class="form-help">Deine Farbe wird später auch auf der Terminkarte angezeigt.</p><div class="color-options">${COLORS.map(v=>`<label class="color-option" title="${safe(v.name)}"><input type="radio" name="card_color" value="${v.id}" aria-label="${safe(v.name)}" ${selected===v.id?'checked':''}><span class="color-option-face"><i class="color-dot swatch-${v.id}"></i></span></label>`).join('')}</div></fieldset>`;
}
const CATEGORY_PICTOGRAMS={coffee:'☕',birthday:'🎁',dining:'🥗',gathering:'🤝',party:'🎉',trip:'🏔️',holiday:'🗓️',other:'✨'};
function categoryPicker(selected='gathering',wizard=false){
 return `<fieldset class="field-group"><legend>Was habt ihr vor?</legend><div class="category-grid">${CATEGORIES.map(c=>`<label class="category-radio"><input type="radio" name="kind" value="${c.id}" ${selected===c.id?'checked':''} required><span>${wizard?`<span class="category-illustration" aria-hidden="true">${CATEGORY_PICTOGRAMS[c.id]||'✨'}</span>`:icon(c.icon,27)}<b>${safe(c.name)}</b></span></label>`).join('')}</div></fieldset>`;
}

function inviteePicker(selected=new Set(),chosenHosts=new Set()){
 const hosts=new Set(chosenHosts);
 return `<div class="invite-grid">${data.people.filter(p=>p.id!==me().id).map(p=>{
  const isHost=hosts.has(p.id);
  return `<label class="invite-person" ${isHost?'hidden':''}><input type="checkbox" name="invitees" value="${p.id}" ${selected.has(p.id)&&!isHost?'checked':''} ${isHost?'disabled':''}><span>${avatar(p,'sm')}<b>${safe(p.display_name)}</b></span></label>`;
 }).join('')}</div>`;
}
function syncGuestPicker(form){
 if(!form)return;
 const hosts=new Set([me()?.id,...[...form.querySelectorAll('input[name="hosts"]:checked')].map(x=>x.value)]);
 for(const input of form.querySelectorAll('input[name="invitees"]')){
  const hosted=hosts.has(input.value),label=input.closest('.invite-person');
  if(hosted){input.checked=false;input.disabled=true;}else input.disabled=false;
  if(label)label.hidden=hosted;
 }
 const info=form.querySelector('.guest-picker-help');
 if(info)info.textContent=form.id==='new-event-form'?'Du kannst eine oder mehrere Personen auswählen.':'Gastgeber sind automatisch dabei, andere Personen lassen sich einzeln einladen.';
}
function hostPicker(selected=new Set()){
 const guests=data.people.filter(p=>p.id!==me().id);
 return `<fieldset class="field-group cohost-picker"><legend>Weitere Gastgeber <small>(optional)</small></legend>
 <p class="form-help">Weitere Gastgeber sind automatisch dabei. Erwachsene mit App-Zugang dürfen den Termin mitverwalten. Kinder werden als Gastgeber angezeigt, erhalten aber keine Adminrechte.</p>
 <div class="invite-grid">${guests.map(p=>`<label class="invite-person cohost-option"><input type="checkbox" name="hosts" value="${p.id}" ${selected.has(p.id)?'checked':''}><span>${avatar(p,'sm')}<b>${safe(p.display_name)}</b>${!p.can_login?`<small class="fz-child-host-tag">Kind</small>`:''}</span></label>`).join('')}</div></fieldset>`;
}
function futureDate(days){const d=new Date();d.setDate(d.getDate()+days);return iso(d.getFullYear(),d.getMonth()+1,d.getDate());}
function pollOptionRow(i,date='',time='15:00'){
 return `<div class="poll-option-entry" data-poll-row="${i}"><span class="poll-option-number">${i+1}</span>
 <label class="field">Datum<input class="input" type="date" name="poll_date_${i}" value="${safe(date)}" min="${localDate()}" required></label>
 <label class="field">Uhrzeit<input class="input" type="time" name="poll_time_${i}" value="${safe(time)}" required></label>
 <button type="button" class="poll-remove-option" data-action="remove-poll-option" data-index="${i}" aria-label="Vorschlag entfernen">${icon('x',18)}</button></div>`;
}
function wizardHostPicker(){
 const own=me();
 return `<fieldset class="wizard-hosts-fieldset"><legend>Gastgeber</legend>
 <details class="wizard-hosts-details" id="wizard-hosts-details">
  <summary class="wizard-hosts-summary">${icon('users',25)}<span><strong>Gastgeber</strong><small id="wizard-hosts-selected">${safe(own?.display_name||'Du')}</small></span>${icon('down',20)}</summary>
  <div class="wizard-hosts-list">
   <label class="wizard-host-locked">${avatar(own,'sm')}<b>${safe(own?.display_name||'Du')}</b><input type="checkbox" checked disabled aria-label="Du bist der Ersteller und automatisch Gastgeber"><span class="wizard-host-lock">Fest</span></label>
   ${data.people.filter(p=>p.id!==own?.id).map(p=>`<label class="wizard-host-choice">${avatar(p,'sm')}<b>${safe(p.display_name)}</b>${!p.can_login?'<small>Kind</small>':''}<input type="checkbox" name="hosts" value="${p.id}"></label>`).join('')}
  </div>
 </details>
 <p class="wizard-hosts-note">Du bist automatisch Gastgeber. Weitere Gastgeber sind ebenfalls dabei; Kinder erhalten keine Adminrechte.</p>
 </fieldset>`;
}
function updateWizardHostSummary(form){
 if(!form)return;
 const summary=form.querySelector('#wizard-hosts-selected');if(!summary)return;
 const names=[me()?.display_name||'Du',...[...form.querySelectorAll('input[name="hosts"]:checked')].map(x=>person(x.value)?.display_name).filter(Boolean)];
 summary.textContent=names.join(', ');
}
const WIZARD_STEPS=[{name:'Was',hint:'Worum geht es?',ico:'gift'},{name:'Wann',hint:'Wann soll es stattfinden?',ico:'calendar'},{name:'Wo',hint:'Wo treffen wir uns?',ico:'map'},{name:'Wer',hint:'Wer ist dabei?',ico:'users'},{name:'Weiteres',hint:'Letzte Details & Kontrolle',ico:'check'}];
let wizardStep=0;
function wizardStepBar(){return `<div class="wizard-progress" aria-label="Fortschritt bei der Terminplanung">${WIZARD_STEPS.map((item,i)=>`<button class="wizard-step-btn ${i===wizardStep?'active':i<wizardStep?'done':''}" type="button" data-action="wizard-jump" data-step="${i}" aria-label="Schritt ${i+1}: ${item.name}" ${i>wizardStep?'disabled':''}><span class="wizard-step-marker">${i<wizardStep?icon('check',15):i+1}</span><small>${item.name}</small></button>`).join('')}</div>`;}
function newEventForm(){
 const draft=birthdayDraft,pFor=draft?person(draft.personId):null;
 const defaultDate=draft?.date||futureDate(14),title=draft?`Geburtstag von ${pFor.display_name}`:'',kind=draft?'birthday':'gathering';
 const pollEnd=futureDate(5)+'T18:00';
 return `<form id="new-event-form" class="stack wizard-form" novalidate>
 ${wizardStepBar()}
 <div class="wizard-panel" data-wizard-panel="0">
   <div class="wizard-intro"><span class="wizard-kicker">SCHRITT 1 VON 5</span><h3>Was habt ihr vor?</h3><p>Wähle einen Anlass und gib eurem Treffen einen Namen.</p></div>
   ${categoryPicker(kind,true).replace('Was habt ihr vor?','Anlass auswählen')}
   ${wizardHostPicker()}
   <label class="field">Wie heißt euer Treffen?<input class="input" name="title" maxlength="120" placeholder="z. B. Familienfrühstück" value="${safe(title)}" required></label>
   ${colorPicker(draft?'apricot':'blue')}
 </div>
 <div class="wizard-panel" data-wizard-panel="1" hidden>
   <div class="wizard-intro"><span class="wizard-kicker">SCHRITT 2 VON 5</span><h3>Wann findet es statt?</h3><p>Ein fester Termin oder eine Abstimmung mit mehreren Vorschlägen.</p></div>
   <fieldset class="field-group"><legend>Wie möchtet ihr planen?</legend><div class="plan-type-choice">
   <label class="plan-type"><input type="radio" name="plan_mode" value="fixed" checked><span>${icon('calendar',25)}<b>Fester Termin</b><small>Datum steht schon fest</small></span></label>
   <label class="plan-type"><input type="radio" name="plan_mode" value="poll"><span>${icon('users',25)}<b>Terminabstimmung</b><small>Gemeinsam Datum finden</small></span></label></div></fieldset>
   <fieldset class="mode-field" data-mode-only="fixed"><legend>Datum und Uhrzeit</legend>
   <label class="field">Datum<input class="input" type="date" name="date" value="${defaultDate}" min="${localDate()}" required></label>
   <div class="two-fields"><label class="field">Beginn / Treffzeit<input class="input" type="time" name="time" value="15:00" required></label><label class="field"><span class="wizard-inline-label">Ende <small>(optional)</small></span><input class="input" type="time" name="end_time" aria-label="Endzeit optional"></label></div>
   <label class="field">Bitte antworten bis<input class="input" type="date" name="deadline" value="${localDate()}" required></label></fieldset>
   <fieldset class="mode-field" data-mode-only="poll" hidden disabled><legend>Welche Termine stehen zur Wahl?</legend>
   <p class="form-help">Trage mindestens zwei Möglichkeiten ein. Jede Person kann mehrere Termine auswählen.</p>
   <div id="poll-option-list">${[14,21,28].map((d,i)=>pollOptionRow(i,futureDate(d))).join('')}</div>
   <input name="poll_row_count" type="hidden" value="3"><button type="button" class="btn secondary wide" data-action="add-poll-option">${icon('plus',18)} Weiteren Vorschlag hinzufügen</button>
   <label class="field">Abstimmung endet am<input class="input" type="datetime-local" name="poll_deadline" value="${pollEnd}" required></label>
   <p class="form-help">Der meistgewählte Termin gewinnt nach Fristablauf. Danach können alle verbindlich zusagen.</p></fieldset>
 </div>
 <div class="wizard-panel" data-wizard-panel="2" hidden>
   <div class="wizard-intro"><span class="wizard-kicker">SCHRITT 3 VON 5</span><h3>Wo treffen wir uns?</h3><p>„Bei uns zu Hause“ reicht aus. Alternativ kannst du einen Ort suchen oder eine Adresse eingeben.</p></div>
   ${meetingPlacePicker('',true)}
 </div>
 <div class="wizard-panel" data-wizard-panel="3" hidden>
   <div class="wizard-intro"><span class="wizard-kicker">SCHRITT 4 VON 5</span><h3>Wen möchtest du einladen?</h3><p>Wähle nur die Personen aus, die eine Einladung bekommen sollen.</p></div>
   <div class="wizard-self-host">${icon('check',23)} <span><strong>Gastgeber sind automatisch dabei.</strong><small>Sie wurden bereits im ersten Schritt ausgewählt.</small></span></div>
   <fieldset class="field-group"><legend>Gäste auswählen</legend><p class="form-help guest-picker-help">Alle zunächst abgewählt. Gastgeber erscheinen hier nicht erneut.</p>${inviteePicker(new Set())}</fieldset>
 </div>
 <div class="wizard-panel" data-wizard-panel="4" hidden>
   <div class="wizard-intro"><span class="wizard-kicker">SCHRITT 5 VON 5</span><h3>Fast geschafft!</h3><p>Noch ein paar freiwillige Angaben – dann kannst du euren Termin erstellen.</p></div>
   <label class="field">Einladungssatz <small>(optional)</small><input class="input" name="teaser" maxlength="90" placeholder="Ein kleiner Vorgeschmack …" value="${draft?'Wir freuen uns auf einen schönen Tag zusammen!':''}"></label>
   <label class="field">Das solltest du wissen <small>(optional)</small><textarea class="input" name="description" maxlength="3000" rows="3" placeholder="Was sollen die anderen mitbringen?"></textarea></label>
   <section class="wizard-recap" aria-label="Deine Angaben"><h4>${icon('check',19)} Dein Termin auf einen Blick</h4><div id="wizard-recap-lines"></div></section>
   <p class="draft-safe-note">${icon('shield',17)} Vor dem Erstellen kannst du jeden Schritt erneut öffnen.</p>
 </div>
 <div class="wizard-footer"><button class="btn secondary" type="button" data-action="wizard-back" id="wizard-back" hidden>${icon('left',18)} Zurück</button><span class="wizard-page-count" id="wizard-page-count">1 / 5</span><button class="btn primary" type="button" data-action="wizard-next" id="wizard-next">Weiter ${icon('arrow',18)}</button><button class="btn primary" type="submit" id="wizard-save" hidden>${icon('check',19)} <span class="submit-plan-label">Einladung erstellen</span></button></div>
 <p class="wizard-autosave">${icon('check',16)} Dein Entwurf bleibt beim Zurückgehen erhalten.</p>
 </form>`;
}
function wizardRecap(form){
 const v=n=>form.querySelector('[name="'+n+'"]')?.value||'',mode=form.querySelector('input[name="plan_mode"]:checked')?.value||'fixed';
 const chosenHosts=[...form.querySelectorAll('input[name="hosts"]:checked')].map(x=>person(x.value)?.display_name).filter(Boolean);
 const invites=[...form.querySelectorAll('input[name="invitees"]:checked')].map(x=>person(x.value)?.display_name).filter(Boolean);
 const occasion=typeName(form.querySelector('input[name="kind"]:checked')?.value);
 const location=meetingPlaceValue(form)||'Nicht eingetragen';
 const when=mode==='poll'?`${[...form.querySelectorAll('[data-poll-row]')].length} Terminvorschläge · Abstimmung`:((v('date')?fmt(v('date'),{day:'numeric',month:'long',year:'numeric'}):'–')+' · '+(v('time')||'–')+(v('end_time')?'–'+v('end_time'):'')+' Uhr');
 const lines=[['Was',v('title')||'Ohne Titel'],['Anlass',occasion],['Wann',when],['Wo',location],['Gastgeber',[me()?.display_name||'Du',...chosenHosts].join(', ')],['Eingeladen',invites.length?invites.join(', '):'Keine weiteren']];
 const output=form.querySelector('#wizard-recap-lines');if(output)output.innerHTML=lines.map(([label,val])=>`<div><span>${safe(label)}</span><strong>${safe(val)}</strong></div>`).join('');
}
function wizardValid(form,step){
 const val=n=>form.querySelector('[name="'+n+'"]')?.value?.trim()||'';
 if(step===0){if(!val('title')){toast('Bitte gib deinem Termin einen Namen.');form.querySelector('[name="title"]')?.focus();return false;}return true;}
 if(step===1){const isPoll=form.querySelector('input[name="plan_mode"]:checked')?.value==='poll';
  if(isPoll){const rows=[...form.querySelectorAll('[data-poll-row]')];const opts=rows.map(row=>({d:row.querySelector('input[type="date"]')?.value,t:row.querySelector('input[type="time"]')?.value}));
   if(opts.length<2||opts.some(x=>!isFutureStart(x.d,x.t))||new Set(opts.map(x=>x.d+'T'+x.t)).size!==opts.length){toast('Bitte mindestens zwei unterschiedliche Terminvorschläge eintragen.');return false;}
   const expiry=new Date(val('poll_deadline')),earliest=new Date(opts.map(o=>o.d+'T'+o.t).sort()[0]);if(!val('poll_deadline')||expiry<=new Date()||expiry>=earliest){toast('Bitte eine Abstimmungsfrist vor dem ersten Termin wählen.');return false;}
  }else{if(!val('date')||!val('time')||!val('deadline')){toast('Bitte Datum, Beginn und Antwortfrist angeben.');return false;}
   if(!isFutureStart(val('date'),val('time'))){toast('Der Beginn muss in der Zukunft liegen.');return false;}
   if(val('deadline')>val('date')){toast('Die Antwortfrist muss spätestens am Termintag sein.');return false;}
   if(val('end_time')&&val('end_time')<=val('time')){toast('Das Ende muss nach dem Beginn liegen.');return false;}}
  return true;}
 if(step===2){if(!meetingPlaceValue(form)){toast('Bitte wähle „Bei uns zu Hause“ oder trage einen Treffpunkt ein.');return false;}return true;}
 return true;
}
let wizardTransitioning=false;
function setWizardStep(step,scroll=true){
 const form=$('#new-event-form');if(!form)return;
 const target=Math.max(0,Math.min(4,step));
 if(wizardTransitioning)return;
 const from=wizardStep;
 const finish=()=>{
  if(!document.contains(form)){wizardTransitioning=false;return;}
  wizardStep=target;
  for(const panel of form.querySelectorAll('[data-wizard-panel]'))panel.hidden=Number(panel.dataset.wizardPanel)!==wizardStep;
  form.querySelector('#wizard-back').hidden=wizardStep===0;
  form.querySelector('#wizard-next').hidden=wizardStep===4;
  form.querySelector('#wizard-save').hidden=wizardStep!==4;
  form.querySelector('#wizard-page-count').textContent=`${wizardStep+1} / 5`;
  for(const [i,button] of [...form.querySelectorAll('[data-action="wizard-jump"]')].entries()){
   button.disabled=i>wizardStep;
   button.classList.toggle('active',i===wizardStep);
   button.classList.toggle('done',i<wizardStep);
   button.querySelector('.wizard-step-marker').innerHTML=i<wizardStep?icon('check',15):String(i+1);
  }
  if(wizardStep===4)wizardRecap(form);
  if(scroll){
   const sheet=form.closest('.sheet');if(sheet)sheet.scrollTop=0;
   const incoming=form.querySelector(`[data-wizard-panel="${wizardStep}"]`);
   if(incoming){incoming.classList.remove('wizard-enter');incoming.classList.add(target>from?'fz-step-in-forward':'fz-step-in-back');
    incoming.addEventListener('animationend',()=>incoming.classList.remove('fz-step-in-forward','fz-step-in-back'),{once:true});}
   const marker=form.querySelector(`[data-action="wizard-jump"][data-step="${wizardStep}"] .wizard-step-marker`);
   if(marker){marker.classList.add('fz-marker-pop');marker.addEventListener('animationend',()=>marker.classList.remove('fz-marker-pop'),{once:true});}
  }
  wizardTransitioning=false;
  storeEventDraft();
 };
 if(!scroll||target===from||window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
 wizardTransitioning=true;
 const outgoing=form.querySelector(`[data-wizard-panel="${from}"]`);
 if(outgoing){
  outgoing.classList.remove('wizard-enter','fz-step-in-forward','fz-step-in-back');
  outgoing.classList.add(target>from?'fz-step-out-forward':'fz-step-out-back');
 }
 // 78 ms departure and ~182 ms arrival = 260 ms total, no waiting screen.
 setTimeout(()=>{
  outgoing?.classList.remove('fz-step-out-forward','fz-step-out-back');
  finish();
 },78);
}
function toggleNewEventMode(form){
 if(!form)return;
 const mode=form.querySelector('input[name="plan_mode"]:checked')?.value||'fixed';
 for(const group of form.querySelectorAll('[data-mode-only]')){
  const visible=group.dataset.modeOnly===mode;group.hidden=!visible;group.disabled=!visible;
 }
 const title=form.querySelector('.submit-plan-label');if(title)title.textContent=mode==='poll'?'Abstimmung starten':'Einladung erstellen';
}

function reminderPreference(eventId){return data.event_reminder_preferences.find(p=>p.event_id===eventId&&p.user_id===user?.id)||null;}
function reminderSummary(eventId){
 const pref=reminderPreference(eventId);if(!pref)return 'Keine persönliche Erinnerung';
 const days=[...(pref.days_before||[])].sort((a,b)=>b-a),pieces=days.map(d=>d===0?'am Termintag':d===1?'1 Tag vorher':d+' Tage vorher');
 if(pref.repeat_every_days)pieces.unshift(pref.repeat_every_days===7?'wöchentlich':pref.repeat_every_days===14?'alle 2 Wochen':'alle 30 Tage');
 if(pref.exact_at)pieces.push('eigener Zeitpunkt');
 return pieces.length?pieces.join(' · '):'Keine persönliche Erinnerung';
}
function remindLocalInput(date){if(!date)return '';const d=new Date(date),pad=n=>String(n).padStart(2,'0');if(Number.isNaN(d.getTime()))return '';return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
function personalReminderForm(e){
 const pref=reminderPreference(e.id),selected=pref?.days_before||[],time=String(pref?.remind_time||'09:00').slice(0,5);
 const periods=[[14,'14 Tage vorher'],[7,'7 Tage vorher'],[3,'3 Tage vorher'],[1,'1 Tag vorher'],[0,'Am Termintag']];
 return `<div class="reminder-intro"><div class="reminder-intro-icon">${icon('bell',24)}</div><div><strong>${safe(e.title)}</strong><span>${safe(fmt(e.event_date))} · ${safe(String(e.event_time).slice(0,5))} Uhr</span></div></div>
 <form id="reminder-form" data-id="${safe(e.id)}" class="stack reminder-form">
 <details class="reminder-dropdown" ${selected.length?'open':''}><summary>${icon('calendar',20)} <span><strong>Erinnere mich vor dem Termin</strong><small>${selected.length?selected.length+' Zeitpunkte ausgewählt':'Zeitpunkte auswählen'}</small></span>${icon('down',20)}</summary>
 <div class="reminder-choices">${periods.map(([d,label])=>`<label class="reminder-choice"><input name="days_before" value="${d}" type="checkbox" ${selected.includes(d)?'checked':''}><span>${label}</span></label>`).join('')}</div></details>
 <label class="field">Zusätzlich regelmäßig erinnern
 <select class="input" name="repeat_every_days"><option value="">Keine Wiederholung</option>${[[7,'Einmal pro Woche'],[14,'Alle zwei Wochen'],[30,'Alle 30 Tage']].map(([n,label])=>`<option value="${n}" ${pref?.repeat_every_days===n?'selected':''}>${label}</option>`).join('')}</select></label>
 <label class="field">Uhrzeit für die ausgewählten Erinnerungen<input class="input" type="time" name="remind_time" value="${time}" required></label>
 <label class="field">Oder zusätzlich ein genauer Zeitpunkt <small>(optional)</small><input class="input" type="datetime-local" name="exact_at" value="${safe(remindLocalInput(pref?.exact_at))}"></label>
 <p class="form-help reminder-privacy">${icon('shield',17)} Die Intervalle lassen sich kombinieren. Regelmäßige Erinnerungen beginnen nach der ersten gewählten Zeitspanne und enden spätestens mit dem Termin. Nur du erhältst deine persönlichen Hinweise.</p>
 <button type="button" class="btn secondary wide" data-action="push-guide">${icon('bell',18)} Smartphone-Benachrichtigungen einrichten</button>
 <button class="btn primary wide" type="submit">${icon('check',19)} Erinnerung speichern</button>
 ${pref?`<button class="btn secondary wide" type="button" data-action="clear-reminders" data-id="${safe(e.id)}">${icon('x',18)} Alle Erinnerungen ausschalten</button>`:''}
 <button class="btn secondary wide" type="button" data-action="event" data-id="${safe(e.id)}">Zurück zum Termin</button></form>`;
}
function pollDetail(e){
 const invited=eventInvites(e.id).includes(me().id),admin=isEventAdmin(e),open=openPoll(e);
 const options=data.event_poll_options.filter(o=>o.event_id===e.id).sort((a,b)=>a.position-b.position);
 const stored=data.event_poll_votes.filter(v=>v.event_id===e.id&&v.voter_user_id===user.id).map(v=>v.option_id);
 const ballot=ballotFor(e),draft=modal?.pollSelection?.eventId===e.id?modal.pollSelection:null;
 const selected=draft?draft.ids:stored,none=draft?draft.cannot:!!ballot?.cannot_attend;
 const votesByOption=id=>data.event_poll_votes.filter(v=>v.option_id===id&&v.event_id===e.id).length;
 const notes=data.comments.filter(c=>c.event_id===e.id);
 return `<div class="detail-banner ${themeClass(e)} card-color-${safe(e.card_color||'blue')}"><span class="detail-banner-art">${icon('calendar',94)}</span><p>${icon('users',20)} TERMINABSTIMMUNG</p><h3>${safe(e.title)}</h3><span>${e.poll_state==='no_votes'?'Ohne Ergebnis':open?'Welche Termine passen euch?':'Die Abstimmung wird ausgewertet'}</span></div>
 ${e.teaser?`<p class="detail-teaser">${safe(e.teaser)}</p>`:''}
 <div class="detail-facts"><div class="detail-host-leader">${icon('users',21)} <span><b>Organisiert von ${safe(hostNames(e))}</b><small>Erstellt von ${safe(accountsByUser.get(e.creator_user_id)?.display_name||'Familie')}</small></span></div>
 <div>${icon('clock',21)} <span>Abstimmung bis <b>${safe(new Date(e.poll_deadline).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'}))} Uhr</b></span></div>
 ${e.location_text?`<div>${icon('map',21)} <span>${safe(e.location_text)}</span></div>`:''}
 ${e.description?`<div>${icon('info',21)} <span>${safe(e.description)}</span></div>`:''}</div>
 ${e.poll_state==='no_votes'?`<section class="detail-panel"><h3>Keine Stimmen abgegeben</h3><p class="form-help">Die Frist ist abgelaufen und es konnte kein Termin festgelegt werden. Bitte startet bei Bedarf eine neue Abstimmung.</p></section>`:''}
 <section class="detail-panel poll-vote-panel"><h3>${icon('calendar',21)} Terminvorschläge</h3><p class="form-help">${open?'Wähle einen, mehrere oder alle passenden Termine. Du kannst bis zur Frist deine Auswahl ändern.':'Die bisher abgegebenen Stimmen sind unten sichtbar.'}</p>
 ${open&&invited?`<form id="poll-vote-form" data-id="${safe(e.id)}" class="stack"><div class="poll-vote-options">${options.map(o=>`<label class="poll-vote-option"><input type="checkbox" name="poll_choice" value="${o.id}" ${selected.includes(o.id)?'checked':''}><span class="poll-vote-copy"><strong>${safe(fmt(o.option_date,{weekday:'short',day:'numeric',month:'long',year:'numeric'}))}</strong><small>${safe(String(o.option_time).slice(0,5))} Uhr</small></span><span class="poll-vote-count">${votesByOption(o.id)} ${votesByOption(o.id)===1?'Stimme':'Stimmen'}</span></label>`).join('')}</div>
 <label class="poll-none-option"><input type="checkbox" name="poll_cannot" value="yes" ${none?'checked':''}><span>Keiner der Termine passt mir</span></label>
 <button type="submit" class="btn primary wide">${icon('check',19)} ${ballot?'Abstimmung ändern':'Auswahl speichern'}</button></form>`:
 `<div class="poll-vote-options poll-readonly">${options.map(o=>`<div class="poll-vote-option"><span class="poll-vote-copy"><strong>${safe(fmt(o.option_date,{weekday:'short',day:'numeric',month:'long',year:'numeric'}))}</strong><small>${safe(String(o.option_time).slice(0,5))} Uhr</small></span><b>${votesByOption(o.id)} ${votesByOption(o.id)===1?'Stimme':'Stimmen'}</b></div>`).join('')}</div>`}
 <p class="form-help poll-voted-summary">${data.event_poll_ballots.filter(b=>b.event_id===e.id).length} Personen haben abgestimmt.${ballot?` Deine Auswahl ist gespeichert${none?' (keiner passt)':''}.`:''}</p></section>
 ${admin&&e.status==='active'?`<section class="detail-panel host-actions"><h3>Abstimmung verwalten</h3><button class="btn secondary wide" data-action="edit-event" data-id="${e.id}">${icon('edit',19)} Details & Gastgeber bearbeiten</button><button class="btn danger wide" data-action="cancel-event" data-id="${e.id}">${icon('x',19)} Abstimmung absagen</button></section>`:''}
 <section class="detail-panel"><h3>${icon('message',21)} Kommentare · ${notes.length}</h3>
 ${notes.length?notes.map(c=>`<div class="comment-row">${avatar(accountsByUser.get(c.author_user_id)||{id:'',display_name:'?'},'sm')}<div><b>${safe(accountsByUser.get(c.author_user_id)?.display_name||'Familie')}</b><small>${new Date(c.created_at).toLocaleDateString('de-DE')}</small><p>${safe(c.body)}</p></div></div>`).join(''):'<p class="form-help">Noch keine Kommentare.</p>'}
 ${e.status==='active'&&invited?`<form id="comment-form" data-id="${e.id}" class="stack"><label class="field">Kommentar<textarea class="input" name="message" rows="2" maxlength="2000" required></textarea></label><button class="btn primary" type="submit">${icon('send',18)} Kommentar senden</button></form>`:''}</section>`;
}
function eventDetail(e){
 if(isPoll(e))return pollDetail(e);
 const host=accountsByUser.get(e.creator_user_id),own=me(),invited=eventInvites(e.id).includes(own.id),ownResponse=responseFor(e.id,own.id),hostSelf=isEventAdmin(e);
 const yes=data.rsvps.filter(r=>r.event_id===e.id&&r.revision===e.revision&&r.status==='yes'),confirmed=new Set([...allHosts(e).map(p=>p.id),...yes.flatMap(r=>guestsFor(e.id,r.responder_user_id,r.revision))]);
 const notes=data.comments.filter(c=>c.event_id===e.id);
 const alternatives=data.alternatives.filter(a=>a.event_id===e.id);
 const yourGuests=ownResponse?.status==='yes'?guestsFor(e.id,user.id,e.revision):[];
 const missing=eventInvites(e.id).map(id=>person(id)).filter(p=>p?.can_login&&p.auth_user_id&&!allHosts(e).some(h=>h.id===p.id)&&!responseFor(e.id,p.id));
 const location=String(e.location_text||'').trim();
 const mapsHref=routeUrl(e);
 const hostIds=new Set(allHosts(e).map(p=>p.id));
 const localCompanions=data.people.filter(p=>p.id!==own.id&&p.household_key===own.household_key&&!hostIds.has(p.id));
 const dateLabel=fmt(e.event_date,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 return `<div class="fz-detail-demo">
  <div class="fz-detail-hero ${themeClass(e)} card-color-${safe(e.card_color||'blue')}">
    <span class="fz-detail-art" aria-hidden="true">${icon(typeIcon(e.kind),120)}</span>
    <span class="fz-detail-category">${icon(typeIcon(e.kind),22)} ${safe(typeName(e.kind))}</span>
    <h3 class="fz-detail-title">${safe(e.title)}</h3>
    <div class="fz-detail-timebox"><span>${icon('calendar',25)} <b>${safe(dateLabel)}</b></span><span>${icon('clock',25)} <b>${safe(appointmentTime(e))}</b></span></div>
  </div>
  ${e.poll_state==='resolved'?`<div class="poll-finalized-banner">${icon('check',21)} Durch Abstimmung festgelegt – jetzt verbindlich antworten.</div>`:''}
  ${e.status==='cancelled'?`<div class="cancelled-warning">${icon('x',23)} <span>Dieser Termin wurde abgesagt.${e.cancellation_reason?`<br><small>Grund: ${safe(e.cancellation_reason)}</small>`:''}</span></div>`:''}
  ${e.teaser?`<p class="fz-detail-teaser">${safe(e.teaser)}</p>`:''}
  <div class="fz-detail-topics">
    <section class="fz-detail-topic fz-detail-host"><span class="fz-detail-topic-icon">${icon('users',25)}</span><div><small>Gastgeber</small><strong>${safe(hostNames(e))}</strong></div>${host?avatar(host,'md'):''}</section>
    <section class="fz-detail-topic fz-detail-address"><span class="fz-detail-topic-icon">${icon('map',25)}</span><div><small>Wo treffen wir uns?</small><strong>${safe(location||'Treffpunkt noch nicht angegeben')}</strong></div>${mapsHref?`<a class="fz-detail-route" href="${mapsHref}" target="_blank" rel="noopener noreferrer" title="Route nach ${safe(location)} in Google Maps anzeigen" aria-label="Route nach ${safe(location)} öffnen"><img class="fz-gmaps-real" src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="" loading="lazy" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none'"><span class="fz-maps-fallback" aria-hidden="true" style="display:block">${icon('map',23)}</span> <span>Route</span></a>`:''}</section>
  </div>
  ${e.description?`<section class="fz-detail-panel fz-detail-notes"><h3>Wichtige Hinweise</h3><p>${safe(e.description)}</p></section>`:''}
  ${e.status==='active'?`<button type="button" class="fz-detail-reminder" data-action="reminders" data-id="${safe(e.id)}"><span class="fz-detail-reminder-icon">${icon('bell',26)}</span><span><strong>Mich erinnern</strong><small>${safe(reminderSummary(e.id))}</small></span>${icon('chevron',23)}</button>`:''}
  ${e.status==='active'&&hostSelf?`<section class="fz-detail-panel fz-admin-quick"><header><h3>${icon('shield',23)} Du bist Gastgeber</h3><span class="fz-detail-approval">Automatisch dabei</span></header><p class="fz-detail-lead">Du verwaltest diesen Termin. Alle weiteren Gastgeber sind ebenfalls automatisch dabei.</p><div class="fz-admin-quick-actions"><button class="btn secondary wide" type="button" data-action="move-event" data-id="${e.id}">${icon('calendar',22)} Termin verschieben</button><button class="btn danger wide" type="button" data-action="cancel-event" data-id="${e.id}">${icon('x',22)} Termin absagen</button></div><p class="fz-detail-lead">Bei beiden Aktionen kannst du einen Grund angeben. Alle Eingeladenen werden benachrichtigt.</p></section>`:''}
  ${e.status==='active'&&invited&&!hostSelf?`<section class="fz-detail-panel fz-detail-rsvp"><header><h3>Meine Teilnahme</h3><span class="fz-detail-approval">${safe(ownResponse?responseLabel(ownResponse):'Noch offen')}</span></header>
    <p class="fz-detail-lead">${ownResponse?'Du kannst deine Antwort jederzeit ändern.':'Kannst du dabei sein?'}</p>
    <div class="rsvp-actions fz-detail-rsvp-options"><button class="rsvp-btn yes ${ownResponse?.status==='yes'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="yes">${icon('check',27)} <span>Zusagen</span></button><button class="rsvp-btn maybe ${ownResponse?.status==='maybe'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="maybe">${icon('info',26)} <span>Vielleicht</span></button><button class="rsvp-btn no ${ownResponse?.status==='no'?'selected':''}" data-action="respond" data-id="${e.id}" data-response="no">${icon('x',27)} <span>Absagen</span></button></div>
    ${ownResponse?.status==='yes'?`<div class="fz-detail-companion"><h4>Wer kommt mit?</h4><p>Du bist schon dabei. Wähle weitere Personen aus deinem Haushalt.</p><div class="companion-list">${localCompanions.map(p=>`<label class="companion-person">${avatar(p,'sm')}<span>${safe(p.display_name)}</span><input type="checkbox" data-action="companion" data-event="${e.id}" data-person="${p.id}" ${yourGuests.includes(p.id)?'checked':''}></label>`).join('')||'<p>Keine weiteren Personen hinterlegt.</p>'}</div></div>`:''}
   </section>`:''}
  <section class="fz-detail-panel fz-detail-attendees fz-invite-status-panel"><header><h3>${icon('users',23)} Eingeladen & Rückmeldungen</h3><span class="fz-detail-attendee-count">${confirmed.size} zugesagt</span></header>
    <p class="fz-detail-lead">Alle Eingeladenen auf einen Blick. Farbige Bilder mit Haken bedeuten eine Zusage.</p>
    <div class="fz-invite-grid" role="list" aria-label="Eingeladene Personen und ihr Status">
    ${[...new Set([...eventInvites(e.id),...allHosts(e).map(p=>p.id)])].map(pid=>{
      const p=person(pid),isHost=hostIds.has(pid),answer=responseFor(e.id,pid);
      const hasYes=confirmed.has(pid)||answer?.status==='yes';
      const declined=!hasYes&&answer?.status==='no';
      const uncertain=!hasYes&&answer?.status==='maybe';
      const label=hasYes?'Zugesagt':declined?'Abgesagt':uncertain?'Vielleicht':'Noch offen';
      const state=hasYes?'confirmed':declined?'declined':uncertain?'maybe':'pending';
      const symbol=hasYes?icon('check',13):declined?icon('x',12):uncertain?icon('info',12):icon('clock',12);
      return `<div class="fz-invite-person is-${state}" role="listitem" title="${safe(p.display_name)}: ${label}"><span class="fz-invite-avatar">${avatar(p,'md')}<span class="fz-invite-state-symbol" aria-hidden="true">${symbol}</span></span><span class="fz-invite-person-name">${safe(p.display_name)}</span><small>${isHost?'Gastgeber · ':''}${label}</small></div>`;
    }).join('')}
    </div>
    ${hostSelf&&e.status==='active'&&localCompanions.length&&ownResponse?.status==='yes'?`<details class="fz-host-companions"><summary>Weitere Begleitung aus deinem Haushalt</summary><p class="fz-detail-lead">Andere Gastgeber sind automatisch dabei.</p><div class="companion-list">${localCompanions.map(p=>`<label class="companion-person">${avatar(p,'sm')}<span>${safe(p.display_name)}</span><input type="checkbox" data-action="companion" data-event="${e.id}" data-person="${p.id}" ${yourGuests.includes(p.id)?'checked':''}></label>`).join('')}</div></details>`:''}
    ${hostSelf&&missing.length&&e.status==='active'?`<div class="nudge-list">${missing.map(p=>`<button class="btn secondary small" data-action="nudge" data-id="${e.id}" data-person="${p.id}">${icon('bell',18)} ${safe(p.display_name)} erinnern</button>`).join('')}</div>`:''}
  </section>
  <section class="fz-detail-panel fz-detail-comments"><header><h3>${icon('message',24)} Kommentare</h3><span class="fz-detail-comments-count">${notes.length}</span></header>
   ${notes.length?notes.map(c=>`<div class="comment-row">${avatar(accountsByUser.get(c.author_user_id)||{id:'',display_name:'?'},'sm')}<div><b>${safe(accountsByUser.get(c.author_user_id)?.display_name||'Familie')}</b><small>${new Date(c.created_at).toLocaleDateString('de-DE')}</small><p>${safe(c.body)}</p></div></div>`).join(''):'<p class="fz-detail-lead">Noch keine Kommentare.</p>'}
   ${e.status==='active'&&invited?`<form id="comment-form" data-id="${e.id}" class="stack"><label class="field">Nachricht an die Familie<textarea class="input" name="message" rows="2" maxlength="2000" placeholder="Schreib etwas …" required></textarea></label><button class="btn primary wide" type="submit">${icon('send',22)} Kommentar senden</button></form>`:''}
  </section>
  <details class="fz-detail-more"><summary>${icon('info',23)} <span>Weitere Informationen & Optionen</span>${icon('chevron',21)}</summary><div class="fz-detail-more-body">
    <section><h4>Antwortfrist</h4><p>${safe(fmt(e.response_deadline||e.event_date))}</p></section>
    ${alternatives.length?`<section><h4>Alternative Termine</h4>${alternatives.map(a=>`<div class="alternative-row"><span><b>${safe(fmt(a.proposed_date))} · ${safe(String(a.proposed_time).slice(0,5))} Uhr</b><small>von ${safe(accountsByUser.get(a.author_user_id)?.display_name||'Familie')}</small></span>${hostSelf&&e.status==='active'?`<button class="btn secondary small" data-action="accept-alternative" data-id="${e.id}" data-alt="${a.id}">Übernehmen</button>`:''}</div>`).join('')}</section>`:''}
    ${e.status==='active'?`<button class="btn secondary wide" data-action="alternative" data-id="${e.id}">${icon('calendar',21)} Alternativtermin vorschlagen</button>`:''}
    ${hostSelf&&e.status==='active'?`<section class="fz-detail-admin"><h4>Termin verwalten</h4><button class="btn secondary wide" data-action="edit-event" data-id="${e.id}">${icon('edit',21)} Einladung bearbeiten</button><p>Für Terminverschiebung und Absage nutze die großen Schaltflächen oben. Gäste müssen nach einer Verschiebung erneut antworten.</p></section>`:''}
   </div></details>
  </div>`;
}

function editEventForm(e){if(!e)return '';
 return `<form id="edit-event-form" data-id="${e.id}" class="stack"><p class="form-help">${isPoll(e)?'Abstimmungstermine und Frist bleiben während einer laufenden Abstimmung unverändert.':'Den Zeitpunkt änderst du über „Verschieben“.'} Alle werden über wichtige Änderungen informiert.</p>${categoryPicker(e.kind)}${colorPicker(e.card_color||'blue')}
 <label class="field">Titel<input class="input" name="title" maxlength="120" required value="${safe(e.title)}"></label>
 <label class="field">Einladungssatz<input class="input" name="teaser" maxlength="90" value="${safe(e.teaser)}"></label>
 ${!isPoll(e)?`<label class="field">Endzeit <small>(optional)</small><input class="input" name="end_time" type="time" value="${safe(e.end_time?String(e.end_time).slice(0,5):'')}"></label>`:''}
 ${meetingPlacePicker(e.location_text,false)}
 <label class="field">Beschreibung<textarea class="input" rows="3" name="description" maxlength="3000">${safe(e.description)}</textarea></label>
 ${hostPicker(new Set(cohostIds(e.id)))}
 <fieldset class="field-group"><legend>Wer ist eingeladen?</legend><p class="form-help guest-picker-help">Gastgeber sind automatisch dabei.</p>${inviteePicker(new Set(eventInvites(e.id)),new Set(cohostIds(e.id)))}</fieldset>
 ${!isPoll(e)?`<label class="field">Antwortfrist<input type="date" class="input" name="deadline" value="${e.response_deadline||e.event_date}" required></label>`:''}
 <button class="btn primary wide" type="submit">${icon('check',19)} Änderungen speichern</button></form>`;
}
function moveEventForm(e){if(!e)return '';return `<form id="move-event-form" data-id="${e.id}" class="stack"><p class="form-help">Die Gäste werden über die Verschiebung informiert und müssen erneut antworten. Gastgeber bleiben automatisch zugesagt.</p><div class="two-fields"><label class="field">Neues Datum<input class="input" type="date" name="date" value="${e.event_date}" min="${localDate()}" required></label><label class="field">Neuer Beginn<input class="input" type="time" name="time" value="${String(e.event_time).slice(0,5)}" required></label></div><label class="field">Neues Ende <small>(optional)</small><input class="input" type="time" name="end_time" value="${safe(e.end_time?String(e.end_time).slice(0,5):'')}"></label><label class="field">Neue Antwortfrist<input class="input" type="date" name="deadline" value="${e.response_deadline||localDate()}" required></label><label class="field">Grund für die Verschiebung <small>(optional)</small><textarea class="input" name="reason" maxlength="500" rows="3" placeholder="z. B. Wir sind an dem Tag verhindert"></textarea></label><button class="btn primary wide" type="submit">${icon('refresh',20)} Verschiebung bestätigen</button></form>`;}
function cancelEventForm(e){if(!e||!isEventAdmin(e)||e.status!=='active')return '<p>Dieser Termin kann nicht abgesagt werden.</p>';return `<form id="cancel-event-form" class="stack" data-id="${safe(e.id)}"><div class="cancel-event-note">${icon('info',24)} <span><strong>${safe(e.title)}</strong><br>Alle Eingeladenen erhalten eine Nachricht über die Absage.</span></div><label class="field">Grund für die Absage <small>(optional)</small><textarea class="input" name="reason" maxlength="500" rows="4" placeholder="z. B. Wir müssen den Termin leider absagen"></textarea></label><button type="submit" class="btn danger wide">${icon('x',22)} Termin endgültig absagen</button><button type="button" class="btn secondary wide" data-action="event" data-id="${safe(e.id)}">Zurück zum Termin</button></form>`;}
function alternativeForm(e){if(!e)return '';return `<form id="alternative-form" data-id="${e.id}" class="stack"><p class="form-help">Dein Vorschlag ändert noch nichts am eigentlichen Termin. Der Gastgeber entscheidet.</p><div class="two-fields"><label class="field">Anderes Datum<input class="input" type="date" name="date" value="${e.event_date}" min="${localDate()}" required></label><label class="field">Uhrzeit<input class="input" type="time" name="time" value="${String(e.event_time).slice(0,5)}" required></label></div><button class="btn primary wide" type="submit">${icon('send',18)} Vorschlag senden</button></form>`;}
function personDetail(p){
 const b=nextBirthday(p),canEdit=canManage(p.id);
 return `<div class="profile-cover"><div class="profile-big">${avatar(p,'xxl')}</div><div><h3>${safe(p.display_name)}</h3><span>${p.can_login?'App-Nutzer':'Familienmitglied ohne Login'}</span></div></div>
 ${p.birth_date?`<div class="profile-birthday">${icon('gift',26)}<span><b>Geburtstag am ${safe(fmt(p.birth_date,{day:'numeric',month:'long'}))}</b><small>${b.days===0?'Heute ist es so weit!':b.days===1?'Schon morgen!':`In ${b.days} Tagen`}</small></span></div>`:`<div class="profile-birthday">${icon('gift',25)}<span><b>Noch kein Geburtstag eingetragen</b><small>${canEdit?'Du kannst ihn unten ergänzen.':'Die berechtigte Person kann ihn ergänzen.'}</small></span></div>`}
 ${p.birth_date?`<button class="btn primary wide" data-action="birthday-event" data-id="${p.id}">${icon('plus',20)} Einladung zum Geburtstag erstellen</button>`:''}
 ${canEdit?`<section class="detail-panel"><h3>${icon('edit',20)} Profil bearbeiten</h3><form id="profile-form" data-id="${p.id}" class="stack"><label class="field">Geburtstag<input class="input" type="date" name="birthdate" max="${localDate()}" value="${p.birth_date||''}"></label><p class="form-help">Du kannst einen Geburtstag jederzeit nachtragen oder ändern.</p><label class="field">Profilbild <small>(optional)</small><input class="input file-input" type="file" name="avatar" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"></label><p class="form-help" id="avatar-file-status" aria-live="polite">${selectedAvatarFiles.get(p.id)?'Ausgewählt: '+safe(selectedAvatarFiles.get(p.id).name):'Noch kein Foto ausgewählt.'}</p><p class="form-help">Das Bild wird quadratisch zugeschnitten und privat gespeichert. Maximal 8 MB Originalgröße.</p><button class="btn primary wide" type="submit">${icon('check',19)} Profil speichern</button></form></section>`:''}`;
}
function accountView(){const own=me(),supported=('Notification' in window);return `<div class="account-profile">${avatar(own,'xl')}<div><h3>${safe(own.display_name)}</h3><p>${safe(user?.email||'Persönlich angemeldet')}</p></div></div><div class="account-section"><button class="account-link" data-action="person" data-id="${own.id}">${icon('camera',23)} <span>Mein Profil & Bild</span>${icon('chevron',20)}</button><button class="account-link" data-action="install-guide">${icon('plus',23)} <span>App auf diesem Gerät installieren <small>Android & iPhone – direkt auf den Startbildschirm</small></span>${icon('chevron',20)}</button><button class="account-link" data-action="push-guide">${icon('bell',23)} <span>Push-Benachrichtigungen <small>${pushEnabled?'Auf diesem Gerät eingerichtet':supported?Notification.permission==='denied'?'In den Geräteeinstellungen freigeben':'Jetzt einrichten':'Browser unterstützt keine Benachrichtigungen'}</small></span>${icon('chevron',20)}</button></div><p class="form-help notice">In der Glocke siehst du Einladungen, Kommentare und Erinnerungen. Mit eingerichteten Push-Benachrichtigungen können Hinweise auch bei geschlossener App ankommen.</p><p class="group-proof">${icon('users',17)} Gemeinsamer Familienkalender · ${data.people.length} Personen</p><p class="app-version">Familienzeit Version 1.9.1</p><button class="btn secondary wide" data-action="logout">${icon('logout',19)} Abmelden</button>`;}
function notificationActor(n){
 const e=data.events.find(e=>e.id===n.event_id);
 return accountsByUser.get(n.actor_user_id)||accountsByUser.get(n.kind==='invited'||n.kind==='rescheduled'||n.kind==='cancelled'?e?.creator_user_id:null)||null;
}
function notificationHeading(n){
 const name=notificationActor(n)?.display_name;
 if(n.kind==='comment')return name?name+' hat kommentiert':'Neuer Kommentar';
 if(n.kind==='poll_invited')return name?name+' fragt nach einem Termin':'Neue Terminabstimmung';
 if(n.kind==='poll_finalized')return 'Abstimmung entschieden';
 if(n.kind==='poll_no_votes')return 'Abstimmung ohne Ergebnis';
 if(n.kind==='invited')return name?name+' hat eingeladen':'Neue Einladung';
 if(n.kind==='rescheduled')return name?name+' hat verschoben':'Termin verschoben';
 if(n.kind==='cancelled')return name?name+' hat abgesagt':'Termin abgesagt';
 if(n.kind==='updated')return name?name+' hat den Termin geändert':'Termin geändert';
 if(n.related_person_id)return 'Geburtstag';
 if(n.kind==='deadline_reminder')return 'Antwortfrist läuft ab';
 if(n.kind==='nudge')return 'Erinnerung';
 if(n.kind?.startsWith('personal_event_'))return 'Deine Terminerinnerung';
 return 'Neuigkeit aus der Familie';
}
let showReadNotifications=false;
function notificationsView(){const unreads=unread(),shown=showReadNotifications?visibleNotifications():unreads;return `<div class="notification-inbox-actions"><strong>${unreads.length?unreads.length+' ungelesen':'Alles gelesen'}</strong><button type="button" data-action="notifications-history">${showReadNotifications?'Nur ungelesene':'Verlauf anzeigen'}</button></div>${shown.length?shown.map(n=>`<button class="notification-row ${!n.read_at?'unread':''}" data-action="notification-open" data-id="${n.id}"><span class="notification-symbol">${icon(n.related_person_id?'gift':n.kind==='comment'?'message':n.kind==='nudge'?'bell':'calendar',24)}</span><span><strong>${safe(notificationHeading(n))}</strong><p>${safe(n.message)}</p><small>${new Date(n.created_at).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}</small></span>${icon('chevron',18)}</button>`).join(''):'<div class="empty-state compact">Hier erscheinen Einladungen, Kommentare und Erinnerungen.</div>'}<p class="form-help notice">Persönliche Erinnerungen enden automatisch nach dem Termin. Für Hinweise auf dem Sperrbildschirm kannst du die Geräte-Benachrichtigungen aktivieren.</p>`;}

function pendingView(){const list=pendingEvents();return `<p class="form-help">${list.length?'Diese Einladungen und Abstimmungen warten noch auf deine Rückmeldung.':'Du hast aktuell alle Einladungen beantwortet.'}</p><div class="event-list">${list.map(eventCard).join('')}</div>`;}

function currentForm(){return $('#modal-root form');}
function formValues(form){const f=new FormData(form);return {f,date:String(f.get('date')||''),time:String(f.get('time')||''),deadline:String(f.get('deadline')||'')};}
function isFutureStart(date,time){return !!date&&!!time&&new Date(date+'T'+time+':00').getTime()>Date.now();}
function formValidDates(date,deadline){if(!date||!deadline||deadline>date){toast('Die Antwortfrist muss spätestens am Termintag liegen.');return false;}if(date<localDate()){toast('Der Termin muss heute oder in der Zukunft liegen.');return false;}return true;}
function invitedFromForm(form){const ids=[...form.querySelectorAll('input[name="invitees"]:checked')].map(x=>x.value);ids.push(me().id);return [...new Set(ids)];}
async function saveNewEvent(form){
 const f=new FormData(form),planMode=String(f.get('plan_mode')||'fixed');
 const title=String(f.get('title')||'').trim(),teaser=String(f.get('teaser')||'').trim();
 if(!title||teaser.length>90){toast('Titel oder Einladungssatz überprüfen.');return;}
 if(!meetingPlaceValue(form)){toast('Bitte einen Treffpunkt auswählen oder eine Adresse eintragen.');form.querySelector('[name="location"]')?.focus();return;}
 const hosts=[...form.querySelectorAll('input[name="hosts"]:checked')].map(x=>x.value);
 const payload={p_mode:planMode,p_title:title,p_kind:String(f.get('kind')||'gathering'),p_teaser:teaser,
  p_location:meetingPlaceValue(form),p_description:String(f.get('description')||'').trim(),
  p_invitees:invitedFromForm(form),p_hosts:hosts,p_card_color:String(f.get('card_color')||'blue'),
  p_event_date:null,p_event_time:null,p_deadline:null,p_poll_deadline:null,p_options:[],p_end_time:null};
 if(planMode==='poll'){
  const fields=[...form.querySelectorAll('[data-poll-row]')];
  const choices=fields.map(row=>({date:row.querySelector('input[type="date"]')?.value||'',time:row.querySelector('input[type="time"]')?.value||''}));
  if(choices.length<2||choices.length>8||choices.some(c=>!isFutureStart(c.date,c.time))){toast('Bitte zwei bis acht gültige Termine auswählen.');return;}
  const keys=new Set(choices.map(c=>c.date+'T'+c.time));if(keys.size!==choices.length){toast('Jeder Vorschlag muss unterschiedlich sein.');return;}
  const end=String(f.get('poll_deadline')||''),deadline=new Date(end),earliest=choices.map(c=>new Date(c.date+'T'+c.time)).sort((a,b)=>a-b)[0];
  if(!end||Number.isNaN(deadline.getTime())||deadline.getTime()<Date.now()+10*60*1000||deadline>=earliest){toast('Die Abstimmung muss frühestens in 10 Minuten und vor dem ersten Vorschlag enden.');return;}
  payload.p_poll_deadline=deadline.toISOString();payload.p_options=choices.map(c=>({date:c.date,time:c.time}));
 }else{
  const {date,time,deadline}=formValues(form);if(!formValidDates(date,deadline))return;
  const endTime=String(f.get('end_time')||'');if(!time){toast('Bitte eine Start- bzw. Treffzeit eingeben.');return;}if(!isFutureStart(date,time)){toast('Der Terminbeginn muss in der Zukunft liegen.');return;}if(endTime&&endTime<=time){toast('Die Endzeit muss nach der Startzeit liegen.');return;}
  payload.p_event_date=date;payload.p_event_time=time;payload.p_deadline=deadline;payload.p_end_time=endTime||null;
 }
 await work(()=>API.createEvent(payload),planMode==='poll'?'Terminabstimmung gestartet.':'Einladung erstellt.',async id=>{birthdayDraft=null;showModal('event',id);clearEventDraft();});
}

async function saveExistingEvent(form){const id=form.dataset.id,e=data.events.find(x=>x.id===id);if(!e||!isEventAdmin(e))return;
 const f=new FormData(form),deadline=String(f.get('deadline')||'');
 if(!meetingPlaceValue(form)){toast('Bitte einen Treffpunkt auswählen oder eine Adresse eintragen.');return;}
 if(!isPoll(e)&&deadline>e.event_date){toast('Die Antwortfrist liegt nach dem Termin.');return;}
 const newHosts=[...form.querySelectorAll('input[name="hosts"]:checked')].map(x=>x.value);
 const oldHosts=cohostIds(id),hostsAdd=newHosts.filter(x=>!oldHosts.includes(x)),hostsRemove=oldHosts.filter(x=>!newHosts.includes(x));
 const invited=[...new Set([...invitedFromForm(form),...newHosts])],old=eventInvites(id);
 const add=invited.filter(x=>!old.includes(x)),remove=old.filter(x=>!invited.includes(x));
 const fields={title:String(f.get('title')).trim(),teaser:String(f.get('teaser')).trim(),kind:String(f.get('kind')),
  card_color:String(f.get('card_color')||'blue'),location_text:meetingPlaceValue(form),description:String(f.get('description')).trim()};
 if(!isPoll(e)){const endTime=String(f.get('end_time')||'');const start=String(e.event_time).slice(0,5);if(endTime&&endTime<=start){toast('Die Endzeit muss nach dem Beginn liegen.');return;}fields.response_deadline=deadline;fields.end_time=endTime||null;}
 await work(async()=>{
  await API.updateEvent(id,fields);
  await API.replaceInvitees(id,add,remove);
  await API.syncCohosts(id,hostsAdd,hostsRemove);
 },'Termindetails und Gastgeber aktualisiert.',async()=>showModal('event',id));
}

async function moveEvent(form){const id=form.dataset.id,{date,time,deadline}=formValues(form),e=data.events.find(x=>x.id===id);if(!e||!isEventAdmin(e)||isPoll(e)||!formValidDates(date,deadline))return;
 const endTime=String(new FormData(form).get('end_time')||'');if(endTime&&endTime<=time){toast('Die Endzeit muss nach dem Beginn liegen.');return;}
 if(date===e.event_date&&time===String(e.event_time).slice(0,5)){toast('Bitte ein anderes Datum oder eine andere Uhrzeit auswählen.');return;}
 if(!confirm('Termin verschieben? Alle bisherigen Zusagen müssen danach erneut bestätigt werden.'))return;
 await work(()=>API.updateEvent(id,{event_date:date,event_time:time,end_time:endTime||null,response_deadline:deadline,last_move_reason:String(new FormData(form).get('reason')||'').trim()}),'Termin verschoben. Die Gäste müssen erneut antworten.',async()=>showModal('event',id));
}
async function saveAlternative(form){const id=form.dataset.id,{date,time}=formValues(form),e=data.events.find(x=>x.id===id);if(!e||!date||date<localDate())return;
 if(date===e.event_date&&time===String(e.event_time).slice(0,5)){toast('Wähle bitte eine echte Alternative.');return;}
 await work(()=>API.addAlternative(id,user.id,date,time),'Terminvorschlag übermittelt.',async()=>showModal('event',id));
}
async function croppedBlob(file){
 if(file.size>8*1024*1024)throw Error('Das Foto ist größer als 8 MB.');
 if(!['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type))throw Error('Bitte ein JPG-, PNG-, WebP- oder unterstütztes HEIC-Foto wählen.');
 let bitmap=null,objectUrl=null,source=null;
 try{
  // Some mobile browsers expose createImageBitmap but cannot decode a particular file.
  if('createImageBitmap' in window){try{bitmap=await createImageBitmap(file);source=bitmap;}catch{}}
  if(!source){
   objectUrl=URL.createObjectURL(file);source=new Image();
   await new Promise((res,rej)=>{source.onload=res;source.onerror=()=>rej(Error('Dieses Bildformat kann der Browser nicht öffnen. Bitte das Foto als JPG wählen.'));source.src=objectUrl;});
  }
  const w=source.width,h=source.height,s=Math.min(w,h);
  if(!w||!h)throw Error('Foto konnte nicht gelesen werden.');
  const canvas=document.createElement('canvas');canvas.width=384;canvas.height=384;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Bildverarbeitung nicht verfügbar');
  ctx.drawImage(source,(w-s)/2,(h-s)/2,s,s,0,0,384,384);
  const blob=await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(Error('Foto konnte nicht verarbeitet werden')),'image/webp',.83));
  if(!['image/webp','image/jpeg','image/png'].includes(blob.type))throw Error('Bildformat nach Verarbeitung nicht unterstützt.');
  return blob;
 }finally{bitmap?.close?.();if(objectUrl)URL.revokeObjectURL(objectUrl);}
}
async function saveProfile(form){
 const id=form.dataset.id;if(!canManage(id))return;
 const formdata=new FormData(form),date=String(formdata.get('birthdate')||'');
 if(date&&date>localDate()){toast('Der Geburtstag darf nicht in der Zukunft liegen.');return;}
 await work(async()=>{
  const fields={birth_date:date||null};
  // Use the detached file reference first; it survives focus-triggered refreshes.
  const fromInput=form.querySelector('input[name="avatar"]')?.files?.[0]||null;
  const file=selectedAvatarFiles.get(id)||fromInput;
  if(file&&file.size){
   const blob=await croppedBlob(file);
   fields.avatar_path=await API.uploadAvatar(id,blob);
   avatarCache.delete(id);
  }
  await API.savePerson(id,fields);
  selectedAvatarFiles.delete(id);
 },'Profil gespeichert.',async()=>showModal('person',id));
}
async function applyResponse(id,status){const e=data.events.find(x=>x.id===id);if(!e||e.status!=='active'||isPoll(e)||isEventAdmin(e))return;
 const old=responseFor(id,me().id),hosts=new Set(allHosts(e).map(p=>p.id)),persons=status==='yes'?[...new Set([me().id,...(old?.status==='yes'?guestsFor(id,user.id,e.revision).filter(x=>!hosts.has(x)):[])])]:[];
 await work(()=>API.respond(id,status,persons),'Deine Rückmeldung wurde gespeichert.',async()=>showModal('event',id));
}
async function updateCompanions(input){const id=input.dataset.event,e=data.events.find(x=>x.id===id);if(!e)return;
 const alreadyHost=new Set(allHosts(e).map(p=>p.id));const allowed=new Set(data.people.filter(p=>p.household_key===me().household_key&&(!alreadyHost.has(p.id)||p.id===me().id)).map(p=>p.id));
 const ids=[me().id,...[...$('#modal-root').querySelectorAll('input[data-action="companion"]:checked')].map(x=>x.dataset.person)].filter(x=>allowed.has(x));
 await work(()=>API.respond(id,'yes',[...new Set(ids)]),'Begleitpersonen aktualisiert.',async()=>showModal('event',id));
}
async function readNotification(id){const n=data.notifications.find(x=>x.id===id);if(!n)return;
 await work(()=>API.markRead([id]),null,async()=>{if(n.related_person_id)showModal('person',n.related_person_id);else if(n.event_id&&data.events.some(e=>e.id===n.event_id))showModal('event',n.event_id);else showModal('notifications');});
}
async function openNotifications(){showReadNotifications=false;showModal('notifications');}
function toPushKey(base64){const pad='='.repeat((4-base64.length%4)%4);const raw=atob((base64+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
async function enableNotifications(){
 if(!('Notification' in window)||!('serviceWorker' in navigator)||!('PushManager' in window)){
  toast('Dieser Browser unterstützt keine Push-Benachrichtigungen.');return;
 }
 if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!isInstalled()){
  toast('Bitte Familienzeit auf dem iPhone zuerst zum Home-Bildschirm hinzufügen.');showModal('push-guide');return;
 }
 try{
  if(Notification.permission==='denied'){showModal('push-guide');toast('Bitte Benachrichtigungen zuerst in den Geräteeinstellungen erlauben.');return;}
  const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
  if(permission!=='granted'){toast('Die Erlaubnis wurde nicht erteilt.');showModal('push-guide');return;}
  const cfg=await API.getPushConfig();
  const reg=await navigator.serviceWorker.ready;
  let sub=await reg.pushManager.getSubscription();
  if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:toPushKey(cfg.public_key)});
  const json=sub.toJSON();
  if(!json.endpoint||!json.keys?.p256dh||!json.keys?.auth)throw Error('Der Browser hat keine gültige Push-Verbindung zurückgegeben.');
  await API.savePushSubscription(user.id,json);
  pushEnabled=true;localStorage.setItem('fz13-hide-push','yes');
  toast('Push-Benachrichtigungen auf diesem Gerät eingerichtet.');
  if(modal?.type==='push-guide'||modal?.type==='account')renderModal();else render();
 }catch(e){console.error(e);toast('Push konnte nicht eingerichtet werden: '+(e?.message||'Unbekannter Fehler'));}
}
async function notifyWhileOpen(newNotifications){newNotifications=newNotifications.filter(n=>!isReminderExpired(n));if(!('Notification' in window)||Notification.permission!=='granted'||!('serviceWorker' in navigator))return;
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
function pushGuide(){
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent),installed=isInstalled();
 const permission=typeof Notification==='undefined'?'unsupported':Notification.permission;
 const supported=('serviceWorker' in navigator)&&('PushManager' in window)&&permission!=='unsupported';
 return `<div class="push-guide"><div class="push-guide-heading">${icon('bell',27)}<b>Einladungen, Kommentare und Termine im Blick</b></div><p>Familienzeit kann dich auf deinem Smartphone benachrichtigen, auch wenn die App geschlossen ist. Das muss jedes Familienmitglied einmal auf dem eigenen Gerät erlauben.</p>
 ${ios&&!installed?`<p class="push-guide-warning">Auf dem iPhone zuerst Familienzeit über Safari zum Home-Bildschirm hinzufügen und über das neue Symbol öffnen.</p><button class="btn primary wide" type="button" data-action="install-guide">${icon('plus',18)} Installation anzeigen</button>`:''}
 ${permission==='denied'?`<p class="push-guide-warning">Benachrichtigungen sind blockiert. ${ios?'Öffne Einstellungen → Mitteilungen → Familienzeit und erlaube die Mitteilungen.':'Öffne Einstellungen → Apps → Familienzeit (oder Chrome) → Benachrichtigungen → Zulassen.'} Danach erneut hier aktivieren.</p>`:''}
 ${!supported?`<p class="push-guide-warning">Dieser Browser bietet derzeit keine vollständige Push-Unterstützung. Bitte Chrome auf Android oder die installierte Familienzeit-App auf iOS verwenden.</p>`:''}
 ${supported&&!(ios&&!installed)?`<button class="btn primary wide" type="button" data-action="enable-notifications">${icon('bell',19)} ${pushEnabled?'Push erneut prüfen':'Benachrichtigungen aktivieren'}</button>`:''}
 <p class="form-help">Die Freigabe erfolgt über den Systemdialog deines Geräts. Du kannst sie später in den Einstellungen widerrufen.</p></div>`;
}
function installGuide(){const ios=/iPad|iPhone|iPod/.test(navigator.userAgent),installed=isInstalled();return `<div class="install-steps">${installed?`<div class="install-complete">${icon('check',24)} Familienzeit ist auf diesem Gerät bereits als App geöffnet.</div>`:ios?`<p>Auf dem iPhone dauert die Installation nur wenige Sekunden:</p><div><b>1</b><span>Link in Safari öffnen.</span></div><div><b>2</b><span>Auf <strong>Teilen</strong> (Quadrat mit Pfeil) tippen.</span></div><div><b>3</b><span><strong>Zum Home-Bildschirm</strong> → <strong>Hinzufügen</strong>.</span></div>`:`<p>Installiere Familienzeit direkt auf deinem Android-Smartphone:</p><div><b>1</b><span>In Chrome das Menü <strong>⋮</strong> öffnen.</span></div><div><b>2</b><span><strong>App installieren</strong> oder <strong>Zum Startbildschirm hinzufügen</strong> wählen.</span></div><div><b>3</b><span>Bestätigen und anschließend das Familienzeit-Symbol öffnen.</span></div>`}<p class="form-help">Keine App-Store-Anmeldung nötig. Dein Konto und eure Termine werden synchronisiert.</p>${!installed?`<button class="btn primary wide" data-action="install-now">${icon('plus',20)} ${ios?'Anleitung verstanden':'Jetzt installieren'}</button>`:''}</div>`;}
function draftKey(){return 'familienzeit-draft-v11-'+(user?.id||'local');}
function storeEventDraft(){const form=$('#new-event-form');if(!form||!user)return;const d={};for(const el of form.querySelectorAll('[name]')){if(el.type==='checkbox'){(d[el.name]??=[]).push([el.value,!!el.checked]);}else if(el.type==='radio'){if(el.checked)d[el.name]=el.value;}else d[el.name]=el.value;}try{localStorage.setItem(draftKey(),JSON.stringify({at:Date.now(),schemaVersion:17,fields:d}));}catch{}}
function restoreEventDraft(){const form=$('#new-event-form');if(!form||!user||birthdayDraft)return;let draft=null;try{draft=JSON.parse(localStorage.getItem(draftKey())||'null');}catch{}if(!draft||Date.now()-draft.at>30*24*3600*1000)return;
 const list=form.querySelector('#poll-option-list');if(list){
  const count=Math.min(8,Math.max(3,Number(draft.fields?.poll_row_count)||3));
  for(let i=3;i<count;i++)list.insertAdjacentHTML('beforeend',pollOptionRow(i,futureDate(14+7*i)));
 }
 for(const el of form.querySelectorAll('[name]')){const val=draft.fields?.[el.name];if(val===undefined||el.name==='invitees'&&draft.schemaVersion!==17)continue;if(el.type==='checkbox'){const picked=val.find?.(x=>x[0]===el.value);if(picked)el.checked=picked[1];}else if(el.type==='radio')el.checked=val===el.value;else el.value=val;}}
function clearEventDraft(){try{localStorage.removeItem(draftKey());}catch{}}
document.addEventListener('click',async ev=>{
 const el=ev.target.closest('[data-action]');if(!el)return;
 const a=el.dataset.action,id=el.dataset.id;
 if(a==='close-backdrop'){return;} // Outside taps never discard a draft.
 if(a==='pick-place'){const form=el.closest('form'),input=form?.querySelector('input[name="location"]');if(input){input.value=el.dataset.place||'';input.dispatchEvent(new Event('change',{bubbles:true}));clearPlaceResults(form);input.focus();if(form.id==='new-event-form')storeEventDraft();}return;}
 if(a==='wizard-next'){const form=$('#new-event-form');if(form&&wizardValid(form,wizardStep))setWizardStep(wizardStep+1);return;}
 if(a==='wizard-back'){setWizardStep(wizardStep-1);return;}
 if(a==='wizard-jump'){const requested=Number(el.dataset.step);if(requested<=wizardStep)setWizardStep(requested);return;}
 if(a==='close'){closeModal();return;}
 if(a==='apply-update'){await applyAvailableUpdate();return;}
 if(a==='retry'){boot();return;}
 if(a==='begin-invite'){mode='register';render();return;}
 if(a==='back-to-login'){mode='login';render();return;}
 if(a==='install-guide'){localStorage.setItem('fz11-show-install','no');showModal('install');return;}
 if(a==='push-guide'){showModal('push-guide');return;}
 if(a==='push-dismiss'){localStorage.setItem('fz13-hide-push','yes');render();return;}
 if(a==='install-dismiss'){localStorage.setItem('fz11-show-install','no');render();return;}
 if(a==='install-now'){if(installEvent){installEvent.prompt();await installEvent.userChoice;installEvent=null;closeModal();}else if(/iPad|iPhone|iPod/.test(navigator.userAgent))toast('Teilen → Zum Home-Bildschirm → Hinzufügen');else toast('Chrome-Menü ⋮ → App installieren');return;}
 if(a==='logout'){await work(async()=>{unsubscribe?.();unsubscribe=null;await API.logout();user=null;mode='login';closeModal();render();});return;}
 if(mode!=='ready')return;
 if(a==='page'){page=el.dataset.page;closeModal();render();window.scrollTo(0,0);return;}
 if(a==='new-event'){birthdayDraft=null;showModal('new');return;}
 if(a==='add-poll-option'){
  const form=$('#new-event-form'),list=form?.querySelector('#poll-option-list');if(!list)return;
  if(list.children.length>=8){toast('Maximal acht Vorschläge.');return;}
  const next=1+Math.max(-1,...[...list.children].map(x=>Number(x.dataset.pollRow)));
  list.insertAdjacentHTML('beforeend',pollOptionRow(next,futureDate(14+7*next)));
  form.querySelector('[name="poll_row_count"]').value=String(next+1);storeEventDraft();return;
 }
 if(a==='remove-poll-option'){
  const form=$('#new-event-form'),list=form?.querySelector('#poll-option-list');if(!list)return;
  if(list.children.length<=2){toast('Mindestens zwei Vorschläge sind erforderlich.');return;}
  el.closest('[data-poll-row]')?.remove();
  [...list.children].forEach((row,i)=>{row.dataset.pollRow=String(i);row.querySelector('.poll-option-number').textContent=String(i+1);row.querySelector('input[type="date"]').name='poll_date_'+i;row.querySelector('input[type="time"]').name='poll_time_'+i;row.querySelector('[data-action="remove-poll-option"]').dataset.index=String(i);});
  form.querySelector('[name="poll_row_count"]').value=String(list.children.length);
  storeEventDraft();return;
 }
 if(a==='birthdays'){showModal('birthdays');return;}
 if(a==='home-view'){setHomeViewMode(homeViewMode()==='cards'?'list':'cards');render();return;}
 if(a==='home-filter'){homeFilter=homeFilter==='all'?'mine':homeFilter==='mine'?'pending':'all';render();return;}
 if(a==='pending'){const list=pendingEvents();if(list.length===1){showModal('event',list[0].id);}else if(list.length>1){showModal('pending');}else{toast('Alle Einladungen sind beantwortet.');}return;}
 if(a==='event'){showModal('event',id);return;}
 if(a==='reminders'){showModal('reminders',id);return;}
 if(a==='clear-reminders'){await work(()=>API.deleteReminders(id),'Erinnerungen ausgeschaltet.',async()=>showModal('event',id));return;}
 if(a==='person'){showModal('person',id);return;}
 if(a==='birthday-event'){birthdayDraft={personId:id,date:nextBirthday(person(id))?.date};showModal('new');return;}
 if(a==='invite-code'){if(!me()?.can_invite||!person(id).can_login)return;if(!confirm('Einen persönlichen Einladungslink für '+person(id).display_name+' erzeugen? Ein früherer Link für diese Person würde ungültig.'))return;await work(()=>API.createInviteCode(id),null,async code=>{showModal('invite',id);modal.code=code;renderModal();});return;}
 if(a==='copy-invite'||a==='share-invite'){const code=modal?.code;if(!code)return;const url=invitationLink(code);try{if(a==='share-invite'&&navigator.share)await navigator.share({title:'Familienzeit-Einladung',text:'Dein persönlicher Zugang zu unserem Familienkalender',url});else{await navigator.clipboard.writeText(url);toast('Persönlicher Einladungslink kopiert.');}}catch(err){if(err?.name!=='AbortError')toast('Bitte den Link markieren und kopieren.');}return;}
 if(a==='account'){showModal('account');return;}
 if(a==='notifications'){await openNotifications();return;}
 if(a==='notifications-history'){showReadNotifications=!showReadNotifications;renderModal();return;}
 if(a==='notification-open'){await readNotification(id);return;}
 if(a==='enable-notifications'){await enableNotifications();return;}
 if(a==='calendar-day'){selectedDay=el.dataset.date;render();return;}
 if(a==='calendar-today'){selectedDay=localDate();const today=new Date();month=new Date(today.getFullYear(),today.getMonth(),1);render();return;}
 if(a==='add-poll-option'){setTimeout(()=>installInAppPickers($('#new-event-form')),0);}
 if(a==='month-prev'||a==='month-next'){month.setDate(1);month.setMonth(month.getMonth()+(a==='month-next'?1:-1));selectedDay=iso(month.getFullYear(),month.getMonth()+1,1);render();return;}
 if(a==='respond'){await applyResponse(id,el.dataset.response);return;}
 if(a==='nudge'){await work(()=>API.nudge(id,el.dataset.person),'Persönliche Erinnerung in der App verschickt.',async()=>showModal('event',id));return;}
 if(a==='alternative'){showModal('alternative',id);return;}
 if(a==='edit-event'){showModal('edit',id);return;}
 if(a==='move-event'){showModal('move',id);return;}
 if(a==='cancel-event'){const e=data.events.find(x=>x.id===id);if(!e||!isEventAdmin(e)||e.status!=='active')return;showModal('cancel',id);return;}
 if(a==='accept-alternative'){const e=data.events.find(x=>x.id===id),alt=data.alternatives.find(a=>a.id===el.dataset.alt&&a.event_id===id);if(!e||!isEventAdmin(e)||!alt)return;
  if((e.response_deadline||e.event_date)>alt.proposed_date){toast('Antwortfrist liegt nach dem vorgeschlagenen Termin. Bitte über „Verschieben“ anpassen.');return;}
  showModal('move',id);const form=$('#move-event-form');if(form){form.querySelector('[name="date"]').value=alt.proposed_date;form.querySelector('[name="time"]').value=String(alt.proposed_time).slice(0,5);if(form.querySelector('[name="deadline"]').value>alt.proposed_date)form.querySelector('[name="deadline"]').value=alt.proposed_date;}return;}
});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Enter'&&ev.target.matches('#new-event-form .place-query')){
  ev.preventDefault();ev.stopImmediatePropagation();
  toast('Ortssuche: Bitte einen Vorschlag auswählen oder auf „Weiter“ tippen.');
 }
},true);
document.addEventListener('submit',async ev=>{
 const form=ev.target;ev.preventDefault();const id=form.id;
 if(id==='register-form'){const d=new FormData(form),code=String(d.get('code')||'').trim(),email=String(d.get('email')||'').trim(),password=String(d.get('password')||'');if(password.length<10){toast('Passwort mindestens 10 Zeichen');return;}await work(async()=>{await API.registerWithInvite(code,email,password);await API.login(email,password);user=await API.getUser();if(!user)throw Error('Anmeldung nach Registrierung fehlgeschlagen');await fetchData();if(mode!=='ready')throw Error('Familienprofil konnte nicht zugeordnet werden');localStorage.setItem('fz11-show-install','yes');unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);inviteCode='';history.replaceState(null,'',location.pathname);},'Willkommen in Familienzeit!');return;}
 if(id==='claim-form'){const code=String(new FormData(form).get('code')||'').trim();if(!code)return;await work(()=>API.claimInviteCode(code),'Dein Familienprofil ist aktiviert.',async()=>{closeModal();render();});return;}
 if(id==='login-form'){const d=new FormData(form);await work(async()=>{await API.login(String(d.get('email')).trim(),String(d.get('password')));user=await API.getUser();if(!user)throw Error('Anmeldung fehlgeschlagen');await fetchData();if(mode==='ready'){unsubscribe?.();unsubscribe=API.subscribe(scheduleRefresh);await openDeeplink();}},'Angemeldet.');return;}
 if(mode!=='ready')return;
 if(id==='poll-vote-form'){
  const e=data.events.find(x=>x.id===form.dataset.id);if(!e||!openPoll(e)){toast('Die Abstimmung ist bereits beendet.');return;}
  const checked=[...form.querySelectorAll('input[name="poll_choice"]:checked')].map(el=>el.value);
  const cannot=!!form.querySelector('input[name="poll_cannot"]:checked');
  if(!checked.length&&!cannot){toast('Bitte einen Termin oder „Keiner passt“ auswählen.');return;}
  await work(()=>API.votePoll(e.id,cannot?[]:checked,cannot),'Deine Abstimmung wurde gespeichert.',async()=>showModal('event',e.id));return;
 }
 if(id==='reminder-form'){
  const eventId=form.dataset.id,e=data.events.find(x=>x.id===eventId);if(!e)return;
  const values=new FormData(form);
  const days=[...form.querySelectorAll('input[name="days_before"]:checked')].map(x=>Number(x.value));
  const remindTime=String(values.get('remind_time')||'09:00');
  const repeatDays=Number(values.get('repeat_every_days')||0)||null;
  const exact=String(values.get('exact_at')||'');
  const when=exact?new Date(exact):null;
  const eventTime=new Date(e.event_date+'T'+String(e.event_time).slice(0,5)+':00');
  if(exact&&(!when||Number.isNaN(when.getTime())||when<=new Date()||when>=eventTime)){toast('Der eigene Erinnerungszeitpunkt muss in der Zukunft und vor dem Termin liegen.');return;}
  if(days.includes(0)&&remindTime>=String(e.event_time).slice(0,5)){toast('Die Erinnerung am Termintag muss vor Beginn des Termins liegen.');return;}
  if(!days.length&&!exact&&!repeatDays){await work(()=>API.deleteReminders(eventId),'Erinnerungen ausgeschaltet.',async()=>showModal('event',eventId));return;}
  await work(()=>API.saveReminders(eventId,user.id,{days_before:days,repeat_every_days:repeatDays,remind_time:remindTime,exact_at:when?.toISOString()||null,updated_at:new Date().toISOString()}),'Deine Erinnerungen wurden gespeichert.',async()=>showModal('event',eventId));
 }
 else if(id==='new-event-form'){if(wizardStep!==4){toast('Bitte alle Schritte bis zur Zusammenfassung durchgehen.');return;}if(![0,1,2,3].every(i=>wizardValid(form,i)))return;await saveNewEvent(form);}
 else if(id==='edit-event-form')await saveExistingEvent(form);
 else if(id==='move-event-form')await moveEvent(form);
 else if(id==='cancel-event-form'){const evObj=data.events.find(e=>e.id===form.dataset.id);if(!isEventAdmin(evObj)||evObj?.status!=='active')return;const reason=String(new FormData(form).get('reason')||'').trim();if(!confirm('Termin endgültig absagen? Alle Eingeladenen werden informiert.'))return;await work(()=>API.updateEvent(evObj.id,{status:'cancelled',cancellation_reason:reason}),'Termin abgesagt. Die Familie wurde informiert.',async()=>showModal('event',evObj.id));}
 else if(id==='alternative-form')await saveAlternative(form);
 else if(id==='profile-form')await saveProfile(form);
 else if(id==='comment-form'){const text=String(new FormData(form).get('message')||'').trim();if(!text)return;await work(()=>API.addComment(form.dataset.id,user.id,text),'Kommentar gespeichert.',async()=>showModal('event',form.dataset.id));}
});
let invitePreviewTimer=null;document.addEventListener('input',ev=>{if(ev.target.name==='location'&&ev.target.matches('.place-query'))searchPlace(ev.target);if(ev.target.closest('#new-event-form'))storeEventDraft();if(ev.target.name==='code'&&ev.target.closest('#register-form')){inviteCode=ev.target.value.trim().toLowerCase();clearTimeout(invitePreviewTimer);if(/^[0-9a-f]{24}$/.test(inviteCode))invitePreviewTimer=setTimeout(loadInvitePreview,500);}});
document.addEventListener('change',async ev=>{
 if(ev.target.name==='plan_mode'&&ev.target.closest('#new-event-form'))toggleNewEventMode(ev.target.closest('form'));
 if(ev.target.name==='meet_kind'){syncMeetingPlace(ev.target.closest('form'));clearPlaceResults(ev.target.closest('form'));}
 if(ev.target.name==='hosts'){syncGuestPicker(ev.target.closest('form'));updateWizardHostSummary(ev.target.closest('form'));}
 if(ev.target.closest('#new-event-form'))storeEventDraft();
 const poll=ev.target.closest('#poll-vote-form');
 if(poll&&(ev.target.name==='poll_cannot'||ev.target.name==='poll_choice')){
  if(ev.target.name==='poll_cannot'&&ev.target.checked)poll.querySelectorAll('input[name="poll_choice"]').forEach(x=>x.checked=false);
  if(ev.target.name==='poll_choice'&&ev.target.checked){const none=poll.querySelector('input[name="poll_cannot"]');if(none)none.checked=false;}
  modal.pollSelection={eventId:poll.dataset.id,ids:[...poll.querySelectorAll('input[name="poll_choice"]:checked')].map(x=>x.value),cannot:!!poll.querySelector('input[name="poll_cannot"]:checked')};
 }
 const input=ev.target;
 if(input.name==='avatar'&&input.type==='file'&&input.closest('#profile-form')){
  const profileId=input.closest('#profile-form').dataset.id;
  const file=input.files?.[0];
  if(file){
   selectedAvatarFiles.set(profileId,file);
   const status=document.getElementById('avatar-file-status');
   if(status)status.textContent='Ausgewählt: '+file.name;
  }
 }
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
const APP_VERSION=document.querySelector('meta[name="familienzeit-version"]')?.content||'1.4';
let checkingVersion=false,availableVersion='',lastVersionCheckAt=0;
const UPDATE_CHECK_INTERVAL=15000;
function updateNotice(version){
 availableVersion=version;
 let box=document.querySelector('#app-update-notice');
 if(!box){box=document.createElement('div');box.id='app-update-notice';document.body.appendChild(box);}
 box.className='app-update-notice';
 box.setAttribute('role','status');
 box.innerHTML=`<span class="update-notice-icon">${icon('refresh',22)}</span><span class="update-notice-text"><strong>Update verfügbar</strong><small>Neue Version ${safe(version)} bereit</small></span><button type="button" data-action="apply-update">Aktualisieren</button>`;
}
async function checkForAppUpdate(force=false){
 // GitHub Pages kann wenige Sekunden oder Minuten fuer die Bereitstellung brauchen.
 // Waehrend der App-Nutzung alle 15 Sekunden pruefen, im Hintergrund keine Abfragen.
 if(checkingVersion||document.visibilityState==='hidden'||!navigator.onLine)return;
 if(!force&&Date.now()-lastVersionCheckAt<UPDATE_CHECK_INTERVAL-1000)return;
 checkingVersion=true;lastVersionCheckAt=Date.now();
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),9000);
 try{
  const url=new URL('./index.html',location.href);
  url.searchParams.set('update-check',String(Date.now()));
  const res=await fetch(url,{cache:'no-store',signal:controller.signal});
  if(!res.ok)return;
  const html=await res.text();
  const version=html.match(/<meta\s+name=["']familienzeit-version["']\s+content=["']([^"']+)["']/i)?.[1];
  if(version&&version!==APP_VERSION&&version!==availableVersion){
   updateNotice(version);
   // Neue SW-URL erzwingt einen frischen Versionsabruf statt der alten ?v=...-Adresse.
   if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js?v='+encodeURIComponent(version),{updateViaCache:'none'})
     .then(reg=>reg.update()).catch(e=>console.info('Update wird beim Laden nachgeholt',e));
   }
  }
 }catch(e){if(e?.name!=='AbortError')console.info('Update-Pruefung wird wiederholt',e)}
 finally{clearTimeout(timeout);checkingVersion=false;}
}
async function applyAvailableUpdate(){
 // Formularinhalte und ausgewaehlte Profilbilder niemals ungefragt verlieren.
 const editing=$('#new-event-form, #profile-form, #reminder-form, #register-form, #login-form, #claim-form');
 if(editing&&!window.confirm('Aktualisieren? Ungespeicherte Eingaben in diesem Formular koennen verloren gehen.'))return;
 const button=document.querySelector('#app-update-notice button');if(button){button.disabled=true;button.textContent='Lade …';}
 try{
  const reg=await navigator.serviceWorker?.register('./sw.js?v='+encodeURIComponent(availableVersion||APP_VERSION),{updateViaCache:'none'});
  await reg?.update();
  if(reg?.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
 }catch(e){console.info('Service Worker aktualisiert sich beim Aufruf',e)}
 const target=new URL('./index.html',location.href);
 target.searchParams.set('v',availableVersion||String(Date.now()));
 target.searchParams.set('fresh',String(Date.now()));
 location.replace(target.href);
}
const checkOnReturn=()=>checkForAppUpdate(true);
window.addEventListener('pageshow',()=>setTimeout(checkOnReturn,350));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkOnReturn();});
window.addEventListener('focus',checkOnReturn);
window.addEventListener('online',checkOnReturn);
window.setInterval(()=>checkForAppUpdate(),UPDATE_CHECK_INTERVAL);
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
 navigator.serviceWorker.register('./sw.js?v=202',{updateViaCache:'none'})
  .then(reg=>{
   reg.update().catch(()=>{});
   // Falls der SW das Update unabhaengig entdeckt, sofort den Hinweis aktualisieren.
   reg.addEventListener('updatefound',()=>{
    const installing=reg.installing;
    installing?.addEventListener('statechange',()=>{
     if(installing.state==='installed'&&navigator.serviceWorker.controller)checkForAppUpdate(true);
    });
   });
  }).catch(console.warn);
}
navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='APP_UPDATED'&&e.data.version!==APP_VERSION)updateNotice(e.data.version);});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;});
boot();
