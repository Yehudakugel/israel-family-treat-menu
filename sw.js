/* Bernshtein hub service worker: instant repeat visits, offline browsing. Audio is never cached here. */
var V='bh-v7',SHELL=['./','index.html','hub/app.js?v=7','data/songs.json?v=7','data/trips.json?v=7','images/brand/monogram.svg','images/hero/hero-480.webp','images/hero/hero-800.webp'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V&&k!==V+'-img'}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function swr(req,name){return caches.open(name).then(function(c){return c.match(req).then(function(hit){var net=fetch(req).then(function(r){if(r.ok&&r.status===200)c.put(req,r.clone());return r}).catch(function(){return hit});return hit||net})})}
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
  if(/\.(mp3|m4a|mp4|mov)$/i.test(u.pathname)||r.headers.has('range'))return; /* stream audio/video from the network */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(V).then(function(x){x.put('index.html',c)});return res}).catch(function(){return caches.match('index.html')}));return}
  if(u.origin===location.origin&&/\.(webp|jpg|jpeg|png|svg)$/i.test(u.pathname)){e.respondWith(caches.open(V+'-img').then(function(c){return c.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res.ok)c.put(r,res.clone());return res})})}));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(swr(r,V));return}
});
