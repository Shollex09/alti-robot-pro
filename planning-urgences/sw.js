// Planning Secrétaires Urgences — Service Worker
// L'application doit rester utilisable sans réseau : tout est mis en cache.
const CACHE = 'planning-urgences-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(url => c.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache d'abord : le planning doit s'ouvrir instantanément, même hors ligne.
// La mise à jour se fait en arrière-plan pour la visite suivante.
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cache => {
      const reseau = fetch(e.request).then(r => {
        if(r && r.status === 200){
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(() => cache);
      return cache || reseau;
    })
  );
});
