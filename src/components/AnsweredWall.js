// AnsweredWall Component — Muro de testimonios (oraciones respondidas)
import { storage } from '../state/storage.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

function formatDate(dateStr) {
  const [y, m, d] = String(dateStr || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d)
    .toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    .replace('.', '');
}

export function renderAnsweredWall(container, props) {
  const list = storage.getAnsweredPrayers();
  const entries = storage.getAllDailyEntries();
  const waitingCount = Object.values(entries).filter((e) => (e.personalPrayer || '').trim()).length;

  container.innerHTML = `
    <div class="stack-14 view-enter">
      <div class="screen-head">
        <h2 class="screen-title">Muro de testimonios</h2>
        <p class="section-subtitle">Oraciones que Dios ya respondió.</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">${list.length}</div>
          <div class="stat-label">Respondidas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${waitingCount}</div>
          <div class="stat-label">En espera</div>
        </div>
      </div>

      <div class="testimony-tools">
        <button id="btn-add-testimony-manual" class="ghost-btn accent">${icons.plus} Nueva respuesta</button>
      </div>

      ${list.length === 0 ? `
        <div class="empty-state">
          <p>Aún no has registrado oraciones respondidas.</p>
          <p>Cuando Dios responda una petición, guárdala aquí para recordar su fidelidad.</p>
        </div>
      ` : list.map((item) => `
        <div class="testimony-item">
          <div class="testimony-head">
            <span class="testimony-badge">Respondida</span>
            <span class="testimony-date">${esc(formatDate(item.answeredDate))}</span>
          </div>
          <p class="testimony-title">${esc(item.title)}</p>
          ${item.request ? `<p class="testimony-note">${esc(item.request)}</p>` : ''}
          ${item.testimony ? `<p class="testimony-note">${esc(item.testimony)}</p>` : ''}
          <div class="testimony-tools">
            <button class="ghost-btn btn-delete-testimony" data-id="${esc(item.id)}">${icons.trash} Eliminar</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelector('#btn-add-testimony-manual')?.addEventListener('click', () => {
    const title = prompt('¿Qué petición respondió Dios? (ej. Sanidad en mi familia, nuevo empleo)');
    if (!title || !title.trim()) return;

    const details = prompt('Detalles o testimonio de cómo respondió Dios:') || '';
    storage.addAnsweredPrayer({
      title: title.trim(),
      request: details.trim(),
      category: 'Testimonio'
    });
    renderAnsweredWall(container, props);
  });

  container.querySelectorAll('.btn-delete-testimony').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Eliminar este testimonio?')) {
        storage.deleteAnsweredPrayer(id);
        renderAnsweredWall(container, props);
      }
    });
  });
}
