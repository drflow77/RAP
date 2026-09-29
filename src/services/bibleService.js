// Texto bíblico: carga de versiones, búsqueda y lectura de citas.
import { BIBLE_BOOKS } from './bibleBooks.js';

// Versiones incluidas en la app. Para sumar otra (por ejemplo la RV1960 o la
// NTV cuando haya licencia) basta con dejar su JSON en public/data/biblia/,
// con el mismo formato que rv1909.json, y agregar aquí una línea. El selector
// de versión aparece solo cuando hay más de una.
export const BIBLE_VERSIONS = [
  {
    id: 'rv1909',
    name: 'Reina-Valera 1909',
    short: 'RV1909',
    file: 'data/biblia/rv1909.json',
    license: 'Dominio público'
  }
];

// Para comparar el pasaje en otras versiones se abre en YouVersion (Bible.com),
// que sí tiene licencia para mostrarlas. El número es el id de la versión allí.
export const EXTERNAL_VERSIONS = [
  { short: 'RV60', id: 149, code: 'RVR1960' },
  { short: 'NVI', id: 128, code: 'NVI' },
  { short: 'NTV', id: 127, code: 'NTV' }
];

export function youVersionUrl(ext, book, chapter) {
  const usfm = BIBLE_BOOKS[book].usfm;
  return `https://www.bible.com/es/bible/${ext.id}/${usfm}.${chapter}.${ext.code}`;
}

export function getVersion(id) {
  return BIBLE_VERSIONS.find((v) => v.id === id) || BIBLE_VERSIONS[0];
}

// Minúsculas y sin acentos, para buscar sin que importe cómo se escriba.
// Conserva la longitud del texto (cada letra acentuada es un solo carácter),
// así las posiciones encontradas sirven para resaltar sobre el original.
export function normalize(text) {
  return String(text)
    .normalize('NFC')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .normalize('NFC');
}

const loaded = new Map(); // id -> Promise<{ books }>
const searchIndex = new Map(); // id -> [{ book, chapter, verse, norm }]

export function loadVersion(id) {
  const version = getVersion(id);
  if (!loaded.has(version.id)) {
    const p = fetch(`${import.meta.env.BASE_URL}${version.file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        // Se olvida la promesa fallida para que el siguiente intento reintente
        loaded.delete(version.id);
        throw err;
      });
    loaded.set(version.id, p);
  }
  return loaded.get(version.id);
}

export function getChapter(data, book, chapter) {
  return data.books[book]?.[chapter - 1] || [];
}

export function chapterCount(data, book) {
  return data.books[book]?.length || 0;
}

// "Juan 3:16", "1 Co 13:4-7", "sal 23", "jn3.16", "Génesis". Devuelve
// { book, chapter, verse, verseEnd } (chapter y verses pueden faltar) o null.
export function parseReference(input) {
  let q = normalize(input).trim()
    .replace(/\s+/g, ' ')
    .replace(/^([123])\s*(?=[a-z])/, '$1 '); // "1corintios" -> "1 corintios"

  const m = q.match(/^((?:[123] )?[a-z][a-z ]*?)\.?\s*(?:(\d+)(?:\s*[:.,]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?)?$/);
  if (!m) return null;

  const book = findBook(m[1].trim());
  if (book < 0) return null;

  const ref = { book };
  if (m[2]) ref.chapter = parseInt(m[2], 10);
  if (m[3]) ref.verse = parseInt(m[3], 10);
  if (m[4]) ref.verseEnd = parseInt(m[4], 10);

  if (ref.chapter && (ref.chapter < 1 || ref.chapter > BIBLE_BOOKS[book].ch)) return null;
  return ref;
}

function findBook(name) {
  if (!name) return -1;
  const exact = BIBLE_BOOKS.findIndex((b) => normalize(b.name) === name || b.alias.includes(name));
  if (exact >= 0) return exact;

  // Un comienzo de nombre también vale ("filip", "apoc"), con al menos 3 letras
  if (name.replace(/[^a-z]/g, '').length < 3) return -1;
  return BIBLE_BOOKS.findIndex((b) => normalize(b.name).startsWith(name));
}

export function formatReference(book, chapter, verses = []) {
  const base = `${BIBLE_BOOKS[book].name} ${chapter}`;
  if (!verses.length) return base;

  // Agrupa los versículos seguidos: [16, 17, 18, 20] -> "16-18, 20"
  const sorted = [...new Set(verses)].sort((a, b) => a - b);
  const parts = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (const v of sorted.slice(1).concat(Infinity)) {
    if (v === prev + 1) {
      prev = v;
      continue;
    }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = v;
    prev = v;
  }
  return `${base}:${parts.join(', ')}`;
}

function getIndex(id, data) {
  if (!searchIndex.has(id)) {
    const index = [];
    data.books.forEach((chapters, book) => {
      chapters.forEach((verses, ci) => {
        verses.forEach((text, vi) => {
          index.push({ book, chapter: ci + 1, verse: vi + 1, norm: normalize(text) });
        });
      });
    });
    searchIndex.set(id, index);
  }
  return searchIndex.get(id);
}

// Busca versículos que contengan todas las palabras. Devuelve los primeros
// `limit` resultados y el total encontrado.
export function searchText(id, data, query, limit = 100) {
  const terms = normalize(query).split(/\s+/).filter((t) => t.length >= 2);
  if (!terms.length) return { results: [], total: 0, terms };

  const results = [];
  let total = 0;
  for (const item of getIndex(id, data)) {
    if (terms.every((t) => item.norm.includes(t))) {
      total++;
      if (results.length < limit) results.push(item);
    }
  }
  return { results, total, terms };
}
