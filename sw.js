const CACHE = 'preguntas-nsdc-v1';
const ASSETS = [
  '/',
  '/remixed-0d6392aa.html',
  '/manifest.json',
  '/images/icono-app.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
