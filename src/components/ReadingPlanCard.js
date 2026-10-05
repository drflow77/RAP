// ReadingPlanCard — plan de lectura bíblica del día, con casilla por lectura.
import { esc } from './escape.js';

export function renderReadingPlanCard(container, { readings, checked, onToggle }) {
  if (!readings) {
    container.innerHTML = '';
    return;
  }

  const done = readings.filter((_, i) => checked[i]).length;
  const allDone = done === readings.length;

  container.innerHTML = `
    <div class="reading-card">
      <div class="reading-head">
        <span class="reading-title">Lectura bíblica de hoy</span>
        <span class="reading-count ${allDone ? 'done' : ''}">${allDone ? 'Completada' : `${done}/${readings.length}`}</span>
      </div>
      <div class="reading-list">
        ${readings.map((r, i) => `
          <button class="reading-item ${checked[i] ? 'checked' : ''}" data-i="${i}" role="checkbox" aria-checked="${checked[i] ? 'true' : 'false'}">
            <span class="reading-box" aria-hidden="true">${checked[i] ? '✓' : ''}</span>
            <span class="reading-ref">${esc(r)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.reading-item').forEach((btn) => {
    btn.addEventListener('click', () => onToggle(parseInt(btn.dataset.i, 10)));
  });
}
