const CACHE_NAME = 'orari-treni-v3';
const ASSETS = [
  './index.html',
  './manifest-treni.json',
  './icon-treni.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(r=>{
      if(r&&r.status===200){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));}
      return r;
    }).catch(()=>cached);
  }));
});
