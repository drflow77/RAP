// Header Component — logo, saludo y píldora de racha (persistente en todas las pestañas)
// Ajustes vive en el menú inferior (móvil) y en la barra lateral (escritorio).
import { icons } from './icons.js';
import { esc } from './escape.js';

function greetingForHour(hour) {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function renderHeader(container, { streakInfo, userName, onOpenStreak }) {
  const greeting = greetingForHour(new Date().getHours());
  const name = (userName || '').trim();

  container.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <div class="brand-section">
          <div class="brand-logo">RAP</div>
          <div class="brand-copy">
            <div class="brand-title">${name ? `${greeting}, ${esc(name)}` : greeting}</div>
          </div>
        </div>

        <div class="header-actions">
          <button id="btn-streak" class="streak-pill" title="Ver tu racha">
            ${icons.flame}
            <span>${esc(streakInfo.currentStreak)}</span>
          </button>
        </div>
      </div>
    </header>
  `;

  container.querySelector('#btn-streak')?.addEventListener('click', onOpenStreak);
}
