// ReadingPlanCard — plan de lectura bíblica del día, con casilla por lectura.
// Tocar la cita abre el primer capítulo en la Biblia de la app.
import { esc } from './escape.js';

// "Isaías 24 - 26" -> "Isaías 24"; "Isaías 66, Jer. 1" -> "Isaías 66"
export function firstChapterOf(reading) {
  return String(reading).split(/[-,]/)[0].trim();
}

export function renderReadingPlanCard(container, { readings, checked, onToggle, onOpen }) {
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
          <div class="reading-item ${checked[i] ? 'checked' : ''}">
            <button class="reading-check" data-i="${i}" role="checkbox" aria-checked="${checked[i] ? 'true' : 'false'}" aria-label="Marcar ${esc(r)} como leída">
              <span class="reading-box" aria-hidden="true">${checked[i] ? '✓' : ''}</span>
            </button>
            <button class="reading-ref" data-i="${i}" title="Abrir en la Biblia">${esc(r)}<span class="reading-go" aria-hidden="true">›</span></button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.reading-check').forEach((btn) => {
    btn.addEventListener('click', () => onToggle(parseInt(btn.dataset.i, 10)));
  });
  container.querySelectorAll('.reading-ref').forEach((btn) => {
    btn.addEventListener('click', () => onOpen?.(readings[parseInt(btn.dataset.i, 10)]));
  });
}
