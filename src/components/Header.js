// Header Component — logo, saludo, píldora de racha y ajustes (persistente en todas las pestañas)
import { icons } from './icons.js';
import { esc } from './escape.js';

function greetingForHour(hour) {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function renderHeader(container, { streakInfo, userName, onOpenStreak, onOpenSettings }) {
  const greeting = greetingForHour(new Date().getHours());
  const name = (userName || '').trim();

  container.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <div class="brand-section">
          <div class="brand-logo">RAP</div>
          <div class="brand-copy">
            <div class="brand-title">${name ? `${greeting}, ${esc(name)}` : greeting}</div>
            <div class="brand-subtitle">Tu tiempo de oración</div>
          </div>
        </div>

        <div class="header-actions">
          <button id="btn-streak" class="streak-pill" title="Ver tu racha">
            ${icons.flame}
            <span>${esc(streakInfo.currentStreak)}</span>
          </button>

          <button id="btn-settings" class="icon-btn" title="Ajustes" aria-label="Ajustes">
            ${icons.gear}
          </button>
        </div>
      </div>
    </header>
  `;

  container.querySelector('#btn-streak')?.addEventListener('click', onOpenStreak);
  container.querySelector('#btn-settings')?.addEventListener('click', onOpenSettings);
}
