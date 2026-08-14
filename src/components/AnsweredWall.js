// AnsweredWall Component — Oraciones respondidas
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

function today() {
  return new Date().toISOString().split('T')[0];
}

export function renderAnsweredWall(container, props) {
  // Más recientes primero por fecha de respuesta, que ahora puede ser retroactiva
  const list = storage.getAnsweredPrayers()
    .slice()
    .sort((a, b) => String(b.answeredDate || '').localeCompare(String(a.answeredDate || '')));

  const isFormOpen = props?.isFormOpen || false;
  const rerender = (state) => renderAnsweredWall(container, { ...props, ...state });

  container.innerHTML = `
    <div class="stack-14 view-enter">
      <div class="screen-head">
        <h2 class="screen-title">Oraciones respondidas</h2>
        <p class="section-subtitle">El registro de lo que Dios ya contestó.</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">${list.length}</div>
          <div class="stat-label">${list.length === 1 ? 'Respondida' : 'Respondidas'}</div>
        </div>
      </div>

      ${isFormOpen ? `
        <div class="answered-form">
          <div class="answered-form-title">Registrar una respuesta</div>

          <label class="field">
            <span class="field-label">¿Qué te respondió Dios?</span>
            <input type="text" id="af-title" class="field-input" placeholder="Ej. Sanidad de mi mamá" />
          </label>

          <label class="field">
            <span class="field-label">¿Cómo lo hizo? (opcional)</span>
            <textarea id="af-detail" class="field-input field-textarea" placeholder="Cuenta brevemente cómo respondió"></textarea>
          </label>

          <label class="field">
            <span class="field-label">¿Cuándo la respondió?</span>
            <input type="date" id="af-date" class="field-input" value="${today()}" max="${today()}" />
          </label>

          <div class="answered-form-actions">
            <button id="af-cancel" class="ghost-btn">Cancelar</button>
            <button id="af-save" class="cta-btn cta-compact">Guardar respuesta</button>
          </div>
        </div>
      ` : `
        <div class="testimony-tools">
          <button id="btn-add-testimony-manual" class="ghost-btn accent">${icons.plus} Registrar una respuesta</button>
        </div>
      `}

      ${list.length === 0 && !isFormOpen ? `
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
    rerender({ isFormOpen: true });
    container.querySelector('#af-title')?.focus();
  });

  container.querySelector('#af-cancel')?.addEventListener('click', () => rerender({ isFormOpen: false }));

  container.querySelector('#af-save')?.addEventListener('click', () => {
    const titleEl = container.querySelector('#af-title');
    const title = titleEl.value.trim();
    if (!title) {
      titleEl.classList.add('field-error');
      titleEl.focus();
      return;
    }

    storage.addAnsweredPrayer({
      title,
      request: container.querySelector('#af-detail').value.trim(),
      answeredDate: container.querySelector('#af-date').value || today(),
      category: 'Testimonio'
    });

    rerender({ isFormOpen: false });
  });

  container.querySelector('#af-title')?.addEventListener('input', (e) => {
    e.target.classList.remove('field-error');
  });

  container.querySelectorAll('.btn-delete-testimony').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('¿Eliminar este registro?')) {
        storage.deleteAnsweredPrayer(id);
        rerender({ isFormOpen: false });
      }
    });
  });
}
