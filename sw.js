const VERSION='2.0.2';
const CACHE='familienzeit-app-'+VERSION;
const CORE=['./','./index.html','./app.js?v=202','./backend.js?v=202','./styles.css?v=202','./manifest.webmanifest?v=191','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
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
 if(url.searchParams.has('invite')||url.searchParams.has('event')||url.searchParams.has('person'))return;
 const scope=new URL('./',self.registration.scope),pathname=url.pathname;
 if(!pathname.startsWith(scope.pathname))return;
 const allowed=new Set(['','index.html','app.js','backend.js','styles.css','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png']);
 const relative=pathname.slice(scope.pathname.length);
 if(!allowed.has(relative))return;
 e.respondWith((async()=>{
  try{
   const response=await fetch(request,{cache:'no-store'});
   if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
   return response;
  }catch(error){
   const cached=await caches.match(request);
   if(cached)return cached;
   if(relative===''||relative==='index.html'){
    const shell=await caches.match(new URL('./index.html',scope).href);
    if(shell)return shell;
   }
   throw error;
  }
 })());
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
