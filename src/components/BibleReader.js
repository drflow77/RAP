// BibleReader Component — la Biblia completa, sin conexión.
//
// Tiene cinco vistas: inicio (libros), capítulos de un libro, lectura, búsqueda
// y versículos guardados. El estado de navegación vive en este módulo para que
// sobreviva a los re-render de la app (cambiar de tema, abrir Ajustes…) y las
// vistas se redibujan solas, sin pasar por renderApp.
import { storage } from '../state/storage.js';
import { BIBLE_BOOKS, NT_START } from '../services/bibleBooks.js';
import {
  BIBLE_VERSIONS,
  EXTERNAL_VERSIONS,
  getVersion,
  loadVersion,
  getChapter,
  chapterCount,
  parseReference,
  formatReference,
  searchText,
  normalize,
  youVersionUrl
} from '../services/bibleService.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

const saved = storage.getBibleState();

const ui = {
  view: 'home', // 'home' | 'chapters' | 'reader' | 'search' | 'saved'
  testament: saved.lastBook >= NT_START ? 'nt' : 'ot',
  book: saved.lastBook,
  chapter: saved.lastChapter,
  query: '',
  selected: new Set(),
  focusVerses: null // versículos a los que llevar la vista al abrir el capítulo
};

let root = null;
let data = null;
let loadError = false;

export function renderBible(container, { target = null, onTargetConsumed } = {}) {
  root = container;

  // Viene de "Leer el capítulo" en el devocional
  if (target) {
    const ref = parseReference(target);
    if (ref?.chapter) openReader(ref.book, ref.chapter, rangeOf(ref), false);
    onTargetConsumed?.();
  }

  const versionId = storage.getBibleState().version;
  if (data && data.id === getVersion(versionId).id) {
    draw();
    return;
  }

  root.innerHTML = `
    <div class="empty-state view-enter">
      <p>Abriendo la Biblia…</p>
      <p>La primera vez tarda un poco; después funciona sin conexión.</p>
    </div>
  `;

  loadVersion(versionId)
    .then((json) => {
      data = json;
      loadError = false;
      if (root === container) draw();
    })
    .catch(() => {
      loadError = true;
      if (root === container) draw();
    });
}

function rangeOf(ref) {
  if (!ref.verse) return null;
  const end = Math.max(ref.verse, ref.verseEnd || ref.verse);
  const list = [];
  for (let v = ref.verse; v <= end; v++) list.push(v);
  return list;
}

function openReader(book, chapter, focusVerses = null, redraw = true) {
  ui.view = 'reader';
  ui.book = book;
  ui.chapter = chapter;
  ui.testament = book >= NT_START ? 'nt' : 'ot';
  ui.selected = new Set();
  ui.focusVerses = focusVerses;
  storage.saveBibleState({ lastBook: book, lastChapter: chapter });
  if (redraw) {
    draw();
    if (!focusVerses) window.scrollTo(0, 0);
  }
}

function go(view) {
  ui.view = view;
  ui.selected = new Set();
  draw();
  window.scrollTo(0, 0);
}

function versionBadge() {
  const v = getVersion(storage.getBibleState().version);
  if (BIBLE_VERSIONS.length < 2) {
    return `<span class="bible-version-chip">${esc(v.short)}</span>`;
  }
  return `
    <select class="bible-version-chip" id="bible-version" aria-label="Versión de la Biblia">
      ${BIBLE_VERSIONS.map((o) => `<option value="${esc(o.id)}" ${o.id === v.id ? 'selected' : ''}>${esc(o.short)}</option>`).join('')}
    </select>
  `;
}

function bindVersionSelect() {
  root.querySelector('#bible-version')?.addEventListener('change', (e) => {
    storage.saveBibleState({ version: e.target.value });
    data = null;
    renderBible(root);
  });
}

function draw() {
  if (!root) return;

  if (loadError || !data) {
    root.innerHTML = `
      <div class="empty-state view-enter">
        <p>No se pudo abrir la Biblia.</p>
        <p>Revisa tu conexión la primera vez; después queda guardada en el teléfono.</p>
        <button class="ghost-btn accent bible-retry" id="bible-retry">Intentar de nuevo</button>
      </div>
    `;
    root.querySelector('#bible-retry')?.addEventListener('click', () => renderBible(root));
    return;
  }

  if (ui.view === 'chapters') drawChapters();
  else if (ui.view === 'reader') drawReader();
  else if (ui.view === 'search') drawSearch();
  else if (ui.view === 'saved') drawSaved();
  else drawHome();
}

// ── Inicio: buscador, "seguir leyendo" y lista de libros ──
function drawHome() {
  const state = storage.getBibleState();
  const range = ui.testament === 'nt' ? [NT_START, BIBLE_BOOKS.length] : [0, NT_START];
  const books = BIBLE_BOOKS.slice(range[0], range[1]).map((b, i) => ({ ...b, index: range[0] + i }));

  root.innerHTML = `
    <div class="stack-14 view-enter">
      <div class="screen-head bible-head">
        <div>
          <h2 class="screen-title">Biblia</h2>
          <p class="section-subtitle">${esc(getVersion(state.version).name)}</p>
        </div>
        ${versionBadge()}
      </div>

      <form class="search-box" id="bible-search-form" role="search">
        ${icons.search}
        <input type="search" id="bible-search-input" enterkeyhint="search"
               placeholder="Busca una cita (Juan 3:16) o una palabra" value="${esc(ui.query)}" />
      </form>

      <button class="bible-continue" id="bible-continue">
        <span class="eyebrow">Seguir leyendo</span>
        <span class="bible-continue-ref">${esc(formatReference(state.lastBook, state.lastChapter))}</span>
        ${icons.chevronRight}
      </button>

      <div class="month-pills">
        <button class="month-pill ${ui.testament === 'ot' ? 'active' : ''}" data-testament="ot">Antiguo</button>
        <button class="month-pill ${ui.testament === 'nt' ? 'active' : ''}" data-testament="nt">Nuevo</button>
        <button class="month-pill" id="bible-open-saved">${icons.bookmark} Guardados${state.saved.length ? ` · ${state.saved.length}` : ''}</button>
      </div>

      <div class="bible-books">
        ${books.map((b) => `
          <button class="bible-book" data-book="${b.index}">
            <span class="bible-book-name">${esc(b.name)}</span>
            <span class="bible-book-ch">${b.ch}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  bindVersionSelect();

  root.querySelector('#bible-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = root.querySelector('#bible-search-input').value.trim();
    if (q) submitQuery(q);
  });

  root.querySelector('#bible-continue').addEventListener('click', () => {
    const s = storage.getBibleState();
    openReader(s.lastBook, s.lastChapter);
  });

  root.querySelectorAll('[data-testament]').forEach((btn) => {
    btn.addEventListener('click', () => {
      ui.testament = btn.getAttribute('data-testament');
      draw();
    });
  });

  root.querySelector('#bible-open-saved').addEventListener('click', () => go('saved'));

  root.querySelectorAll('.bible-book').forEach((btn) => {
    btn.addEventListener('click', () => {
      ui.book = parseInt(btn.getAttribute('data-book'), 10);
      go('chapters');
    });
  });
}

// Una cita va directo al pasaje; cualquier otra cosa se busca como texto
function submitQuery(q) {
  ui.query = q;
  const ref = parseReference(q);
  if (ref?.chapter) {
    openReader(ref.book, ref.chapter, rangeOf(ref));
  } else if (ref && ref.book >= 0 && !/\d/.test(q)) {
    // Solo el nombre del libro: "Romanos"
    ui.book = ref.book;
    go('chapters');
  } else {
    go('search');
  }
}

function backBar(label, extra = '') {
  return `
    <div class="bible-bar">
      <button class="date-nav-btn" id="bible-back" aria-label="Volver">${icons.chevronLeft}</button>
      <span class="bible-bar-title">${label}</span>
      ${extra}
    </div>
  `;
}

// ── Capítulos de un libro ──
function drawChapters() {
  const book = BIBLE_BOOKS[ui.book];
  const total = chapterCount(data, ui.book);

  root.innerHTML = `
    <div class="stack-14 view-enter">
      ${backBar(esc(book.name))}
      <p class="section-subtitle">Elige un capítulo</p>
      <div class="bible-chapters">
        ${Array.from({ length: total }, (_, i) => `
          <button class="bible-chapter ${ui.book === storage.getBibleState().lastBook && i + 1 === storage.getBibleState().lastChapter ? 'current' : ''}"
                  data-ch="${i + 1}">${i + 1}</button>
        `).join('')}
      </div>
    </div>
  `;

  root.querySelector('#bible-back').addEventListener('click', () => go('home'));
  root.querySelectorAll('.bible-chapter').forEach((btn) => {
    btn.addEventListener('click', () => openReader(ui.book, parseInt(btn.getAttribute('data-ch'), 10)));
  });
}

// ── Lectura de un capítulo ──
function drawReader() {
  const book = BIBLE_BOOKS[ui.book];
  const verses = getChapter(data, ui.book, ui.chapter);
  const total = chapterCount(data, ui.book);
  const version = getVersion(storage.getBibleState().version);
  const savedHere = new Set(
    storage.getBibleState().saved
      .filter((s) => s.book === ui.book && s.chapter === ui.chapter)
      .map((s) => s.verse)
  );

  const prev = ui.chapter > 1
    ? { book: ui.book, chapter: ui.chapter - 1 }
    : ui.book > 0 ? { book: ui.book - 1, chapter: chapterCount(data, ui.book - 1) } : null;
  const next = ui.chapter < total
    ? { book: ui.book, chapter: ui.chapter + 1 }
    : ui.book < BIBLE_BOOKS.length - 1 ? { book: ui.book + 1, chapter: 1 } : null;

  const focus = new Set(ui.focusVerses || []);

  root.innerHTML = `
    <div class="stack-14 view-enter">
      ${backBar(
        `<button class="bible-bar-ref" id="bible-pick-chapter">${esc(book.name)} ${ui.chapter} ${icons.chevronRight}</button>`,
        `<span class="bible-version-chip">${esc(version.short)}</span>`
      )}

      <article class="bible-text" id="bible-text">
        ${verses.map((text, i) => {
          const n = i + 1;
          const cls = [
            'bv',
            ui.selected.has(n) ? 'selected' : '',
            savedHere.has(n) ? 'saved' : '',
            focus.has(n) ? 'focus' : ''
          ].filter(Boolean).join(' ');
          return `<span class="${cls}" data-v="${n}"><sup>${n}</sup>${esc(text)} </span>`;
        }).join('')}
      </article>

      <div class="bible-pager">
        <button class="bible-pager-btn" id="bible-prev" ${prev ? '' : 'disabled'}>
          ${icons.chevronLeft}
          <span>${prev ? esc(formatReference(prev.book, prev.chapter)) : ''}</span>
        </button>
        <button class="bible-pager-btn next" id="bible-next" ${next ? '' : 'disabled'}>
          <span>${next ? esc(formatReference(next.book, next.chapter)) : ''}</span>
          ${icons.chevronRight}
        </button>
      </div>

      <div class="bible-compare">
        <span class="bible-compare-label">Leer este capítulo en</span>
        <div class="bible-compare-links">
          ${EXTERNAL_VERSIONS.map((ext) => `
            <a class="ghost-btn" href="${esc(youVersionUrl(ext, ui.book, ui.chapter))}" target="_blank" rel="noopener">
              ${esc(ext.short)} ${icons.external}
            </a>
          `).join('')}
        </div>
        <span class="bible-compare-note">Se abren en YouVersion (Bible.com).</span>
      </div>

      <p class="bible-license">${esc(version.name)} · ${esc(version.license)}</p>
    </div>
    ${selectionBar()}
  `;

  root.querySelector('#bible-back').addEventListener('click', () => go('home'));
  root.querySelector('#bible-pick-chapter').addEventListener('click', () => go('chapters'));
  root.querySelector('#bible-prev')?.addEventListener('click', () => prev && openReader(prev.book, prev.chapter));
  root.querySelector('#bible-next')?.addEventListener('click', () => next && openReader(next.book, next.chapter));

  root.querySelectorAll('.bv').forEach((el) => {
    el.addEventListener('click', () => {
      const n = parseInt(el.getAttribute('data-v'), 10);
      if (ui.selected.has(n)) ui.selected.delete(n);
      else ui.selected.add(n);
      el.classList.toggle('selected', ui.selected.has(n));
      refreshSelectionBar();
    });
  });

  bindSelectionBar();

  // Llevar la vista al versículo citado y resaltarlo un momento
  if (ui.focusVerses?.length) {
    const first = root.querySelector(`.bv[data-v="${ui.focusVerses[0]}"]`);
    ui.focusVerses = null;
    if (first) {
      requestAnimationFrame(() => first.scrollIntoView({ block: 'center' }));
    } else {
      window.scrollTo(0, 0);
    }
  }
}

function selectionBar() {
  if (!ui.selected.size) return '<div id="bible-selection"></div>';
  const verses = [...ui.selected];
  const allSaved = verses.every((v) => storage.isVerseSaved(ui.book, ui.chapter, v));
  return `
    <div id="bible-selection" class="bible-selection" role="toolbar" aria-label="Versículos seleccionados">
      <div class="bible-selection-head">
        <span class="bible-selection-ref">${esc(formatReference(ui.book, ui.chapter, verses))}</span>
        <button class="bible-sel-close" id="bible-sel-clear" aria-label="Quitar selección">${icons.close}</button>
      </div>
      <div class="bible-selection-actions">
        <button class="bible-sel-btn" id="bible-sel-copy" aria-label="Copiar">${icons.copy}<span>Copiar</span></button>
        <button class="bible-sel-btn" id="bible-sel-share" aria-label="Compartir">${icons.share}<span>Compartir</span></button>
        <button class="bible-sel-btn ${allSaved ? 'on' : ''}" id="bible-sel-save" aria-label="${allSaved ? 'Quitar de guardados' : 'Guardar'}">
          ${icons.bookmark}<span>${allSaved ? 'Guardado' : 'Guardar'}</span>
        </button>
      </div>
    </div>
  `;
}

function refreshSelectionBar() {
  const old = root.querySelector('#bible-selection');
  if (!old) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = selectionBar();
  old.replaceWith(tmp.firstElementChild);
  bindSelectionBar();
}

function selectionText() {
  const verses = [...ui.selected].sort((a, b) => a - b);
  const chapter = getChapter(data, ui.book, ui.chapter);
  const body = verses.length === 1
    ? chapter[verses[0] - 1]
    : verses.map((v) => `${v} ${chapter[v - 1]}`).join(' ');
  const version = getVersion(storage.getBibleState().version);
  return `“${body}”\n${formatReference(ui.book, ui.chapter, verses)} (${version.short})`;
}

function flashLabel(btn, text) {
  const span = btn.querySelector('span');
  if (!span) return;
  const original = span.textContent;
  span.textContent = text;
  setTimeout(() => { span.textContent = original; }, 1400);
}

function bindSelectionBar() {
  const bar = root.querySelector('#bible-selection');
  if (!bar || !ui.selected.size) return;

  bar.querySelector('#bible-sel-copy').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(selectionText());
      flashLabel(btn, 'Copiado');
    } catch (err) {
      flashLabel(btn, 'No se pudo');
    }
  });

  bar.querySelector('#bible-sel-share').addEventListener('click', async (e) => {
    const text = selectionText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        flashLabel(e.currentTarget, 'Copiado');
      } catch (err) {
        flashLabel(e.currentTarget, 'No se pudo');
      }
    }
  });

  bar.querySelector('#bible-sel-save').addEventListener('click', () => {
    const verses = [...ui.selected];
    const nowSaved = storage.toggleSavedVerses(ui.book, ui.chapter, verses);
    verses.forEach((v) => {
      root.querySelector(`.bv[data-v="${v}"]`)?.classList.toggle('saved', nowSaved);
    });
    refreshSelectionBar();
  });

  bar.querySelector('#bible-sel-clear').addEventListener('click', () => {
    ui.selected = new Set();
    root.querySelectorAll('.bv.selected').forEach((el) => el.classList.remove('selected'));
    refreshSelectionBar();
  });
}

// ── Búsqueda por palabras ──
function highlight(text, terms) {
  const norm = normalize(text);
  const marks = [];
  terms.forEach((t) => {
    let i = norm.indexOf(t);
    while (i >= 0) {
      marks.push([i, i + t.length]);
      i = norm.indexOf(t, i + t.length);
    }
  });
  if (!marks.length) return esc(text);

  marks.sort((a, b) => a[0] - b[0]);
  let out = '';
  let pos = 0;
  for (const [s, e] of marks) {
    if (s < pos) continue;
    out += esc(text.slice(pos, s)) + `<mark>${esc(text.slice(s, e))}</mark>`;
    pos = e;
  }
  return out + esc(text.slice(pos));
}

function drawSearch() {
  const versionId = storage.getBibleState().version;
  const { results, total, terms } = searchText(getVersion(versionId).id, data, ui.query);

  root.innerHTML = `
    <div class="stack-14 view-enter">
      ${backBar('Buscar')}

      <form class="search-box" id="bible-search-form" role="search">
        ${icons.search}
        <input type="search" id="bible-search-input" enterkeyhint="search"
               placeholder="Busca una cita (Juan 3:16) o una palabra" value="${esc(ui.query)}" />
      </form>

      ${total === 0 ? `
        <div class="empty-state">
          <p>Sin resultados.</p>
          <p>Prueba con otra palabra, o escribe una cita como “Salmos 23” o “Jn 3:16”.</p>
        </div>
      ` : `
        <p class="section-subtitle">${total === 1 ? '1 versículo' : `${total} versículos`}</p>
        ${results.map((r) => `
          <button class="bible-result" data-book="${r.book}" data-ch="${r.chapter}" data-v="${r.verse}">
            <span class="bible-result-ref">${esc(formatReference(r.book, r.chapter, [r.verse]))}</span>
            <span class="bible-result-text">${highlight(getChapter(data, r.book, r.chapter)[r.verse - 1], terms)}</span>
          </button>
        `).join('')}
        ${total > results.length ? `
          <p class="list-hint">Mostrando ${results.length} de ${total}. Agrega otra palabra para afinar.</p>
        ` : ''}
      `}
    </div>
  `;

  root.querySelector('#bible-back').addEventListener('click', () => go('home'));
  root.querySelector('#bible-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = root.querySelector('#bible-search-input').value.trim();
    if (q) submitQuery(q);
  });

  root.querySelectorAll('.bible-result').forEach((btn) => {
    btn.addEventListener('click', () => {
      openReader(
        parseInt(btn.getAttribute('data-book'), 10),
        parseInt(btn.getAttribute('data-ch'), 10),
        [parseInt(btn.getAttribute('data-v'), 10)]
      );
    });
  });
}

// ── Versículos guardados ──
function drawSaved() {
  const list = storage.getBibleState().saved;

  root.innerHTML = `
    <div class="stack-14 view-enter">
      ${backBar('Guardados')}

      ${list.length === 0 ? `
        <div class="empty-state">
          <p>Aún no guardas versículos.</p>
          <p>Mientras lees, toca un versículo y elige “Guardar”.</p>
        </div>
      ` : list.map((s, i) => `
        <div class="bible-result saved-item">
          <button class="bible-saved-open" data-i="${i}">
            <span class="bible-result-ref">${esc(formatReference(s.book, s.chapter, [s.verse]))}</span>
            <span class="bible-result-text">${esc(getChapter(data, s.book, s.chapter)[s.verse - 1] || '')}</span>
          </button>
          <button class="ghost-btn" data-remove="${i}" aria-label="Quitar de guardados">${icons.trash}</button>
        </div>
      `).join('')}
    </div>
  `;

  root.querySelector('#bible-back').addEventListener('click', () => go('home'));

  root.querySelectorAll('.bible-saved-open').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = list[parseInt(btn.getAttribute('data-i'), 10)];
      openReader(s.book, s.chapter, [s.verse]);
    });
  });

  root.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = list[parseInt(btn.getAttribute('data-remove'), 10)];
      storage.toggleSavedVerses(s.book, s.chapter, [s.verse]);
      draw();
    });
  });
}
