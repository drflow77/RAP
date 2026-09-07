// Subir la versión invalida la caché anterior al activarse.
// v3: iconos nuevos, contenido real de septiembre y arreglos de offline.
const CACHE_NAME = 'rap-app-v3';
// Caché aparte para las fuentes de Google: no se borra al subir de versión,
// porque su contenido no cambia y volver a descargarlas es caro.
const FONT_CACHE = 'rap-fonts-v1';

// Rutas relativas al propio sw.js: funcionan igual en la raíz ('/') que en
// una subcarpeta como GitHub Pages ('/RAP/').
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './brand/logo-faa.png',
  './data/devotionals.json'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// El servidor manda 'Vary: Origin', y una petición guardada con cabeceras
// distintas a las de la búsqueda no haría match: sin ignoreVary la app se
// quedaba en blanco sin conexión aunque el archivo estuviera en la caché.
const MATCH_OPTS = { ignoreVary: true };

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Uno a uno en vez de addAll: addAll es atómico, así que un solo 404
      // dejaba la caché entera vacía y la app sin modo offline.
      return Promise.allSettled(ASSETS_TO_CACHE.map((url) => cache.add(url)))
        .then((results) => {
          const fallidos = results
            .map((r, i) => (r.status === 'rejected' ? ASSETS_TO_CACHE[i] : null))
            .filter(Boolean);
          if (fallidos.length) console.warn('No se pudieron cachear:', fallidos);
        });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== FONT_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function esFuente(url) {
  return FONT_HOSTS.includes(url.hostname);
}

// Sirve lo que haya en caché al instante y refresca por detrás. Se usa para el
// JSON de devocionales: la app abre siempre rápido y sin conexión, y cuando se
// publica contenido nuevo entra solo en la siguiente apertura.
function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) => {
    return cache.match(request, MATCH_OPTS).then((cached) => {
      const red = fetch(request).then((res) => {
        if (res && res.status === 200) cache.put(request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || red;
    });
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo GET: el resto se deja pasar tal cual.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Fuentes de Google: caché primero, y se guardan aunque la respuesta sea
  // opaca. Sin esto la tipografía se caía a la del sistema sin conexión.
  if (esFuente(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(request, MATCH_OPTS).then((cached) => cached || fetch(request).then((res) => {
          if (res && (res.status === 200 || res.type === 'opaque')) {
            cache.put(request, res.clone());
          }
          return res;
        }))
      ).catch(() => fetch(request))
    );
    return;
  }

  // Navegación: red primero (para que un despliegue nuevo llegue enseguida),
  // guardando copia, y si no hay conexión se sirve el index cacheado.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copia));
          return res;
        })
        .catch(() => caches.match('./index.html', MATCH_OPTS)
          .then((cached) => cached || caches.match('./', MATCH_OPTS)))
    );
    return;
  }

  // Devocionales: se sirven al instante y se refrescan por detrás.
  if (url.pathname.endsWith('/data/devotionals.json')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
    return;
  }

  // Resto de estáticos (JS y CSS con hash en el nombre, iconos): caché primero.
  event.respondWith(
    caches.match(request, MATCH_OPTS).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copia = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        return res;
      });
    })
  );
});

// Support for local notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
            break;
          }
        }
        return client.focus();
      }
      return clients.openWindow(self.registration.scope);
    })
  );
});
