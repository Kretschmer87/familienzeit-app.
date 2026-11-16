/* Familienzeit 0.8 · Supabase-Browserzugang · nur öffentlicher Publishable Key */
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
export async function getUser(){const result=await db().auth.getUser();if(result.error)return null;return result.data.user;}
export async function login(email,password){ok(await db().auth.signInWithPassword({email,password}));}
export async function logout(){ok(await db().auth.signOut());}
export async function readAll(){
  const names=['people','person_managers','events','event_invites','rsvps','rsvp_attendees','comments','alternatives','notifications'];
  const pairs=await Promise.all(names.map(async name=>{
    let q=db().from(name).select('*');
    if(name==='notifications')q=q.order('created_at',{ascending:false}).limit(200);
    if(name==='comments')q=q.order('created_at',{ascending:true});
    return [name,ok(await q)];
  }));
  return Object.fromEntries(pairs);
}
export async function createEvent(record){return ok(await db().rpc('create_family_event_styled',record));}
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
 for(const table of ['people','events','event_invites','rsvps','rsvp_attendees','comments','alternatives','notifications'])
   channel.on('postgres_changes',{event:'*',schema:'public',table},callback);
 channel.subscribe();
 return ()=>db().removeChannel(channel);
}
export async function createInviteCode(personId){return ok(await db().rpc('create_family_invite_code',{p_person_id:personId}));}
export async function claimInviteCode(code){return ok(await db().rpc('claim_family_profile',{p_code:code}));}
