/* Familienzeit 0.7: Öffentlicher Browser-Client. KEINE geheimen Schlüssel. */
const URL = 'https://lzkousocxlswizkycrai.supabase.co';
const PUBLIC_KEY = 'sb_publishable_W3sSqSCfTTc152DrXPPXSQ_QoSoLpGS';
let supabase;

export async function connect() {
  // Feste SDK-Version. Dynamischer Import erlaubt eine verständliche Offline-Fehlermeldung.
  const sdk = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm');
  supabase = sdk.createClient(URL, PUBLIC_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    realtime: { params: { eventsPerSecond: 5 } }
  });
  return supabase;
}
export const api = () => { if (!supabase) throw Error('Datenbank nicht verbunden'); return supabase; };

function assertOk(result) {
  if (result.error) throw result.error;
  return result.data;
}
const table = (name) => api().from(name);
export const auth = {
  async getUser() {const {data,error}=await api().auth.getUser(); if(error) return null; return data.user || null;},
  async login(email,password) {assertOk(await api().auth.signInWithPassword({email,password}));},
  async magic(email) {assertOk(await api().auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}}));},
  async logout() {await api().auth.signOut();},
  onChange(cb) {return api().auth.onAuthStateChange((_event,session)=>cb(session));}
};

// Getrennte Abfragen und deterministische Zusammenführung durch die Oberfläche.
export async function fetchAll() {
  const names=['people','events','event_invites','rsvps','rsvp_attendees','comments','alternatives','event_changes','notifications'];
  const promises=names.map(name=>{
    let q=table(name).select('*');
    if(name==='notifications') q=q.order('created_at',{ascending:false}).limit(300);
    return q.then(result=>[name,assertOk(result)]);
  });
  return Object.fromEntries(await Promise.all(promises));
}
export async function createEvent(fields) {
  return assertOk(await api().rpc('create_family_event',fields));
}
export async function respond(eventId,status,personIds) {
  assertOk(await api().rpc('answer_family_event',{p_event_id:eventId,p_status:status,p_attendees:personIds}));
}
export async function nudge(eventId,personId) {
  assertOk(await api().rpc('send_family_nudge',{p_event_id:eventId,p_person_id:personId}));
}
export async function editEvent(eventId,values) {
  assertOk(await table('events').update(values).eq('id',eventId).select('id').single());
}
export async function addComment(eventId,text,userId) {
  assertOk(await table('comments').insert({event_id:eventId,author_user_id:userId,body:text}));
}
export async function addAlternative(eventId,date,time,userId) {
  assertOk(await table('alternatives').insert({event_id:eventId,author_user_id:userId,proposed_date:date,proposed_time:time}));
}
export async function markRead(ids) {
  if(!ids.length)return;
  assertOk(await table('notifications').update({read_at:new Date().toISOString()}).in('id',ids));
}
export function watchChanges(callback) {
  const channel=api().channel('familienzeit-watch-0.7');
  for(const name of ['events','event_invites','rsvps','rsvp_attendees','comments','alternatives','notifications']) {
    channel.on('postgres_changes',{event:'*',schema:'public',table:name},callback);
  }
  channel.subscribe();
  return ()=>{api().removeChannel(channel);};
}
