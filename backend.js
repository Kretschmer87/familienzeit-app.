/* Familienzeit 1.9.1 · Supabase-Browserzugang · nur öffentlicher Publishable Key */
const PROJECT_URL='https://lzkousocxlswizkycrai.supabase.co';
const PUBLIC_KEY='sb_publishable_W3sSqSCfTTc152DrXPPXSQ_QoSoLpGS';
let client=null;
function ok(value){if(value.error)throw value.error;return value.data;}
export async function connect(){
  if(client)return client;
  const sdk=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm');
  client=sdk.createClient(PROJECT_URL,PUBLIC_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}
export function db(){if(!client)throw Error('Datenbankverbindung ist nicht bereit.');return client;}
export async function getUser(){const result=await db().auth.getUser();if(result.error){if(/Auth session missing|session missing/i.test(result.error.message||''))return null;throw result.error;}return result.data.user;}
export async function login(email,password){ok(await db().auth.signInWithPassword({email,password}));}
export async function logout(){ok(await db().auth.signOut());}
export async function readAll(){
  const names=['people','person_managers','events','event_invites','rsvps','rsvp_attendees','comments','alternatives','notifications','event_reminder_preferences','event_cohosts','event_poll_options','event_poll_ballots','event_poll_votes'];
  const pairs=await Promise.all(names.map(async name=>{
    let q=db().from(name).select('*');
    if(name==='notifications')q=q.order('created_at',{ascending:false}).limit(200);
    if(name==='comments')q=q.order('created_at',{ascending:true});
    return [name,ok(await q)];
  }));
  return Object.fromEntries(pairs);
}
export async function createEvent(record){return ok(await db().rpc('create_family_plan_v18',record));}
export async function votePoll(event_id,option_ids,cannot){return ok(await db().rpc('vote_family_poll',{p_event_id:event_id,p_option_ids:option_ids,p_cannot:cannot}));}
export async function syncCohosts(event_id,add,remove){
 if(add.length)ok(await db().from('event_cohosts').insert(add.map(person_id=>({event_id,person_id}))));
 if(remove.length)ok(await db().from('event_cohosts').delete().eq('event_id',event_id).in('person_id',remove));
}
export async function updateEvent(id,fields){return ok(await db().from('events').update(fields).eq('id',id).select('id').single());}
export async function replaceInvitees(id,add,remove){
  for(const person_id of remove)ok(await db().from('event_invites').delete().eq('event_id',id).eq('person_id',person_id));
  if(add.length)ok(await db().from('event_invites').insert(add.map(person_id=>({event_id:id,person_id}))));
}
export async function respond(event_id,status,attendees){ok(await db().rpc('answer_family_event',{p_event_id:event_id,p_status:status,p_attendees:attendees}));}
export async function nudge(event_id,person_id){ok(await db().rpc('send_family_nudge',{p_event_id:event_id,p_person_id:person_id}));}
export async function addComment(event_id,author_user_id,body){ok(await db().from('comments').insert({event_id,author_user_id,body}));}
export async function addAlternative(event_id,author_user_id,date,time){ok(await db().from('alternatives').insert({event_id,author_user_id,proposed_date:date,proposed_time:time}));}
export async function markRead(ids){if(ids.length)ok(await db().from('notifications').update({read_at:new Date().toISOString()}).in('id',ids));}
export async function savePerson(id,fields){return ok(await db().from('people').update(fields).eq('id',id).select('id').single());}
export async function uploadAvatar(personId,blob){
  const ext=blob.type==='image/webp'?'webp':blob.type==='image/png'?'png':'jpg';
  const path=personId+'/avatar-'+Date.now()+'.'+ext;
  ok(await db().storage.from('family-avatars').upload(path,blob,{contentType:blob.type,cacheControl:'3600',upsert:false}));
  return path;
}
export async function avatarUrl(path){return ok(await db().storage.from('family-avatars').createSignedUrl(path,3600)).signedUrl;}
export function subscribe(callback){
 const channel=db().channel('familienzeit-live-v08');
 for(const table of ['people','events','event_invites','rsvps','rsvp_attendees','comments','alternatives','notifications','event_cohosts','event_poll_options','event_poll_ballots','event_poll_votes'])
   channel.on('postgres_changes',{event:'*',schema:'public',table},callback);
 channel.subscribe();
 return ()=>db().removeChannel(channel);
}
export async function createInviteCode(personId){return ok(await db().rpc('create_family_invite_code',{p_person_id:personId}));}
export async function claimInviteCode(code){return ok(await db().rpc('claim_family_profile',{p_code:code}));}

// Public onboarding endpoint contains NO secret browser credentials. Registration requires a
// one-time family code, validated and consumed on the server.
const ONBOARDING_URL=PROJECT_URL+'/functions/v1/family-onboarding';
async function onboarding(payload){
  const response=await fetch(ONBOARDING_URL,{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  let data=null;try{data=await response.json();}catch{}
  if(!response.ok)throw Error(data?.error||'Einladungsserver nicht erreichbar');
  return data;
}
export async function previewInvite(code){return onboarding({action:'preview',code});}
export async function registerWithInvite(code,email,password){return onboarding({action:'register',code,email,password});}

export async function saveReminders(event_id,user_id,settings){
 return ok(await db().from('event_reminder_preferences').upsert({event_id,user_id,...settings},{onConflict:'event_id,user_id'}).select('event_id').single());
}
export async function deleteReminders(event_id){
 return ok(await db().from('event_reminder_preferences').delete().eq('event_id',event_id));
}

const PUSH_ENDPOINT=PROJECT_URL+'/functions/v1/family-push';
export async function getPushConfig(){
 const session=ok(await db().auth.getSession())?.session;
 if(!session?.access_token)throw Error('Bitte erneut anmelden.');
 const res=await fetch(PUSH_ENDPOINT,{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},body:JSON.stringify({action:'config'})});
 const payload=await res.json().catch(()=>({}));
 if(!res.ok||!payload.public_key)throw Error(payload.error||'Push-Dienst nicht erreichbar');
 return payload;
}
export async function savePushSubscription(userId,sub){
 return ok(await db().from('push_subscriptions').upsert({user_id:userId,endpoint:sub.endpoint,p256dh:sub.keys.p256dh,auth_secret:sub.keys.auth},{onConflict:'endpoint'}));
}
export async function isPushSubscribed(){
 if(!('serviceWorker' in navigator)||!('PushManager' in window))return false;
 const reg=await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();
 if(!sub)return false;const r=await db().from('push_subscriptions').select('id').eq('endpoint',sub.endpoint).maybeSingle();
 return !r.error&&!!r.data;
}
