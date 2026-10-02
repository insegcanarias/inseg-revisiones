/* Service worker de Inseg Revisiones: permite abrir la app sin cobertura. No guarda datos de clientes. */
const CACHE='inseg-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; const u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin) return;       // Microsoft (login y OneDrive) va siempre por red
  e.respondWith(fetch(r).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(u.search?new Request(u.origin+u.pathname):r,copy)); } return res; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
});
