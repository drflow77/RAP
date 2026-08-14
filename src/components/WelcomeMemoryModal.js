// WelcomeMemoryModal Component — Portada: eslogan + versículo del mes a memorizar
import { MONTHLY_MEMORY_VERSES, getMemorizedMap, getMemoryVerseForMonth } from './MonthlyMemoryVerse.js';
import { esc } from './escape.js';

export function renderWelcomeMemoryModal(container, { currentDate, onClose }) {
  const currentMonth = currentDate.getMonth() + 1;
  const item = getMemoryVerseForMonth(currentMonth);

  const memorizedMap = getMemorizedMap();
  const memorizedCount = MONTHLY_MEMORY_VERSES.filter((m) => memorizedMap[m.month]).length;

  const dots = MONTHLY_MEMORY_VERSES.map((m) => {
    if (memorizedMap[m.month]) return 'done';
    if (m.month === currentMonth) return 'current';
    return '';
  });

  container.innerHTML = `
    <div class="welcome-overlay" id="welcome-overlay">
      <div class="welcome-inner">
        <div class="welcome-logo">RAP</div>

        <div>
          <div class="welcome-eyebrow">Relación · Amor · Petición</div>
          <h1 class="welcome-headline">Nunca estás demasiado ocupado para no orar</h1>
        </div>

        <div class="welcome-card">
          <div class="welcome-card-head">
            <span class="eyebrow">Versículo de ${esc(item.monthName)}</span>
            <span class="welcome-card-index">${currentMonth} de 12</span>
          </div>

          <p class="welcome-verse">“${esc(item.verse)}”</p>

          <div class="welcome-card-foot">
            <span class="welcome-card-passage">${esc(item.passage)}</span>
            <span class="welcome-card-progress">${memorizedCount} ${memorizedCount === 1 ? 'versículo memorizado' : 'versículos memorizados'} este año</span>
          </div>

          <div class="year-dots">
            ${dots.map((state) => `<div class="year-dot ${state}"></div>`).join('')}
          </div>
        </div>

        <button id="btn-enter-rap" class="cta-btn">Comenzar mi oración de hoy</button>
      </div>
    </div>
  `;

  container.querySelector('#btn-enter-rap')?.addEventListener('click', () => {
    sessionStorage.setItem('rap_welcome_seen', 'true');
    container.innerHTML = '';
    if (onClose) onClose();
  });
}
