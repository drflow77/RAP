// Shorts del canal Palabra Vida Abundante. La lista vive en public/shorts.json
// y se descarga cada vez que se abre la app, así que un Short nuevo llega
// también a la app de Android sin publicar otra versión: basta con hacer push.
import { isNative } from '../platform.js';

// En Android la build lleva base './' y fetch leería la copia del paquete, que
// no cambia hasta la siguiente versión. Allí se pide siempre a GitHub Pages.
const SHORTS_URL = isNative
  ? 'https://drflow77.github.io/RAP/shorts.json'
  : `${import.meta.env.BASE_URL}shorts.json`;

// Solo enlaces a YouTube: un error al escribir la lista no debe abrir otra web.
const YOUTUBE_URL = /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//;

let shortsPromise = null;

function valido(s) {
  return s
    && /^\d{4}-\d{2}-\d{2}$/.test(s.fecha)
    && YOUTUBE_URL.test(s.url)
    // Las entradas de ejemplo solo se ven en desarrollo (npm run dev).
    && (!s.ejemplo || import.meta.env.DEV);
}

export const shortsService = {
  load() {
    if (!shortsPromise) {
      shortsPromise = fetch(SHORTS_URL, { cache: 'no-cache' })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to load shorts');
          return response.json();
        })
        .then((list) => (Array.isArray(list) ? list.filter(valido) : []))
        .catch((e) => {
          // Sin conexión no hay tarjeta. Se olvida el fallo para volver a
          // intentarlo en el siguiente render, por si vuelve la red.
          console.warn('Shorts no disponibles:', e.message);
          shortsPromise = null;
          return [];
        });
    }
    return shortsPromise;
  },

  // El Short de esa fecha ("AAAA-MM-DD") o, si no hay, el más reciente anterior.
  async getForDate(dateStr) {
    const list = await this.load();
    return list
      .filter((s) => s.fecha <= dateStr)
      .reduce((best, s) => (!best || s.fecha >= best.fecha ? s : best), null);
  }
};
