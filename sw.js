// Service Worker (عامل الخدمة = اللي بيخلي البرنامج يشتغل بدون نت)
// مهم: كل ما تحدّث index.html غيّر رقم النسخة تحت (v2 ← v3 ← v4...)
const CACHE = 'rep-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-v2-192.png', './icon-v2-512.png', './icon-v2-512-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') { // الصفحة: النسخة الجديدة من النت لو متاح، وإلا من الكاش
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(h => h || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
});
