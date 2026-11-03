// DailyShortCard — el Short del día del canal Palabra Vida Abundante.
// Se monta vacía y se rellena cuando llega la lista; sin conexión se queda
// vacía y el resto del paso R funciona igual.
import { shortsService } from '../services/shortsService.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

export function renderDailyShortCard(container, { dateStr }) {
  container.innerHTML = '';

  shortsService.getForDate(dateStr).then((short) => {
    // Si entretanto se volvió a pintar la app, este contenedor ya no está.
    if (!short || !container.isConnected) return;

    const titulo = short.titulo || short.pasaje;
    const pasaje = short.pasaje && short.pasaje !== titulo ? short.pasaje : '';

    // Un enlace normal: en la web abre una pestaña y en Android Capacitor lo
    // manda fuera de la app (la de YouTube si está instalada, o el navegador).
    container.innerHTML = `
      <a class="short-card" href="${esc(short.url)}" target="_blank" rel="noopener">
        <span class="short-play">${icons.play}</span>
        <span class="short-info">
          <span class="short-tag">Escucha el Salmo de hoy</span>
          <span class="short-title">${esc(titulo)}</span>
          <span class="short-meta">${pasaje ? `${esc(pasaje)} · ` : ''}YouTube · Palabra Vida Abundante</span>
        </span>
        <span class="short-go">${icons.external}</span>
      </a>
    `;
  });
}
