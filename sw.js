/* يحفظ التطبيق على الجهاز ليفتح دون أنترنت. غيّر رقم النسخة عند كل تحديث. */
const V='economat-v3',SHELL=['./','./index.html','./config.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./files/nizam-dakhili.txt'];
const CDN=['www.gstatic.com','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){const fresh=r.mode==='navigate'||/(\/|index\.html|config\.js)$/.test(u.pathname);
    if(fresh){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r.mode==='navigate'?'./index.html':r,c));return res}).catch(()=>caches.match(r.mode==='navigate'?'./index.html':r,{ignoreSearch:true}).then(x=>x||caches.match('./index.html'))));return}
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(x=>x||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(y=>y.put(r,c));return res})));return}
  if(CDN.includes(u.hostname)){e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}))}});
