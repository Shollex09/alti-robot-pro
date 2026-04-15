// ALTI Robot PRO — Service Worker
const CACHE = 'alti-v1';
const ASSETS = [
  './ALTI_Robot_PRO.html',
  './manifest.json',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'
];

// Installation — mise en cache des ressources statiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(ASSETS.map(url =>
        c.add(url).catch(() => {})
      ));
    })
  );
  self.skipWaiting();
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — stratégie : réseau d'abord, cache en fallback
self.addEventListener('fetch', e => {
  // Ne pas intercepter les requêtes API (WebSocket, données live)
  const url = e.request.url;
  if (url.includes('finnhub') || url.includes('binance') || url.includes('twelvedata')
    || url.includes('frankfurter') || url.includes('open.er-api') || url.startsWith('ws')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(r => {
        // Mettre en cache les réponses réussies
        if (r && r.status === 200 && e.request.method === 'GET') {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
