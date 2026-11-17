const VERSION='1.1.1';
const CACHE='familienzeit-app-'+VERSION;
const CORE=['./','./index.html','./app.js?v=111','./backend.js?v=111','./styles.css?v=111','./manifest.webmanifest?v=111','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('familienzeit-app-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)client.postMessage({type:'APP_UPDATED',version:VERSION});
 })());
});
self.addEventListener('fetch',e=>{
 const request=e.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 // Never cache invite tokens, family deep links, private responses or data API calls.
 if(url.searchParams.has('invite')||url.searchParams.has('event')||url.searchParams.has('person'))return;
 const scope=new URL('./',self.registration.scope),pathname=url.pathname;
 if(!pathname.startsWith(scope.pathname))return;
 const allowed=new Set(['','index.html','app.js','backend.js','styles.css','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png']);
 const relative=pathname.slice(scope.pathname.length);
 if(!allowed.has(relative))return;
 e.respondWith((async()=>{
  try{
   const response=await fetch(request,{cache:'no-store'});
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
   return response;
  }catch(_){
   const saved=await caches.match(request);
   if(saved)return saved;
   if(request.mode==='navigate')return (await caches.match(new URL('./index.html',scope).href))||Response.error();
   return Response.error();
  }
 })());
});
self.addEventListener('notificationclick',e=>{
 e.notification.close();const d=e.notification.data||{},url=new URL('./index.html',self.registration.scope);
 if(d.event)url.searchParams.set('event',d.event);else if(d.person)url.searchParams.set('person',d.person);
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{
  const open=clients.find(c=>new URL(c.url).pathname===url.pathname);
  if(open){await open.navigate(url.href);return open.focus();}
  return self.clients.openWindow(url.href);
 }));
});
self.addEventListener('push',e=>{
 if(!e.data)return;let d;try{d=e.data.json()}catch{d={body:e.data.text()}};
 e.waitUntil(self.registration.showNotification('Familienzeit',{
  body:String(d.body||'Es gibt Neuigkeiten in der Familie.').slice(0,180),icon:'./icon-192.png',badge:'./icon-192.png',data:{event:d.event||null,person:d.person||null}
 }));
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
