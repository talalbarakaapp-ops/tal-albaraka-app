const V='tal-v1',SH=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SH)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='tal-cdn').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request,u=new URL(q.url);if(q.method!=='GET')return;
if(/firebase|googleapis/.test(u.hostname))return;
if(u.hostname==='cdn.jsdelivr.net'){e.respondWith(caches.open('tal-cdn').then(async c=>{const m=await c.match(q);if(m)return m;const r=await fetch(q);if(r.ok||r.type==='opaque')c.put(q,r.clone());return r}));return}
if(u.origin===location.origin)e.respondWith(fetch(q).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(q,cp));return r}).catch(()=>caches.match(q).then(m=>m||caches.match('index.html'))))});
