// ExploreDevotionals Component — biblioteca de los 365 devocionales
import { devotionalService } from '../services/devotionalService.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const PAGE_SIZE = 40;

export function renderExploreDevotionals(container, { onSelectDevotional }) {
  let allDevotionals = [];
  let monthFilter = new Date().getMonth() + 1; // mes actual por defecto
  let searchQuery = '';

  function getFiltered() {
    const q = searchQuery.toLowerCase().trim();
    return allDevotionals.filter((d) => {
      const matchMonth = monthFilter === 0 || d.month === monthFilter;
      const matchQuery = !q || (
        d.title.toLowerCase().includes(q) ||
        d.passage.toLowerCase().includes(q) ||
        d.verse.toLowerCase().includes(q) ||
        d.theme.toLowerCase().includes(q)
      );
      return matchMonth && matchQuery;
    });
  }

  function render({ focusSearch = false } = {}) {
    const list = getFiltered();

    container.innerHTML = `
      <div class="stack-14 view-enter">
        <div class="screen-head">
          <h2 class="screen-title">365 devocionales</h2>
          <p class="section-subtitle">Un año completo de Relación, Amor y Petición.</p>
        </div>

        <div class="search-box">
          ${icons.search}
          <input
            type="text"
            id="explore-search-input"
            placeholder="Buscar por tema o versículo"
            value="${esc(searchQuery)}"
          />
        </div>

        <div class="month-pills">
          <button class="month-pill ${monthFilter === 0 ? 'active' : ''}" data-month="0">Todos</button>
          ${MONTHS_SHORT.map((m, i) => `
            <button class="month-pill ${monthFilter === i + 1 ? 'active' : ''}" data-month="${i + 1}">${m}</button>
          `).join('')}
        </div>

        ${list.length === 0 ? `
          <div class="empty-state">
            <p>Sin resultados.</p>
            <p>Prueba con otro tema, libro o versículo.</p>
          </div>
        ` : list.slice(0, PAGE_SIZE).map((d) => `
          <button class="devotional-row" data-dev-id="${d.id}">
            <div class="devotional-row-date">
              <div class="devotional-row-day">${d.day}</div>
              <div class="devotional-row-month">${MONTHS_SHORT[d.month - 1]}</div>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div class="devotional-row-title">${esc(d.title)}</div>
              <div class="devotional-row-passage">${esc(d.passage)}</div>
            </div>
          </button>
        `).join('')}

        ${list.length > PAGE_SIZE ? `
          <p class="list-hint">Mostrando ${PAGE_SIZE} de ${list.length}. Afina la búsqueda para ver más.</p>
        ` : ''}
      </div>
    `;

    const searchInput = container.querySelector('#explore-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render({ focusSearch: true });
    });

    if (focusSearch && searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(searchQuery.length, searchQuery.length);
    }

    container.querySelector('.month-pill.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });

    container.querySelectorAll('.month-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        monthFilter = parseInt(pill.getAttribute('data-month'));
        render();
      });
    });

    container.querySelectorAll('[data-dev-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const id = parseInt(row.getAttribute('data-dev-id'));
        const found = allDevotionals.find((d) => d.id === id);
        if (found) onSelectDevotional(found);
      });
    });
  }

  (async () => {
    allDevotionals = await devotionalService.loadAllDevotionals();
    render();
  })();
}
