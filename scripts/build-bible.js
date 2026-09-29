// Genera public/data/biblia/rv1909.json a partir del texto de dominio público
// de la Reina-Valera 1909 publicado por scrollmapper/bible_databases
// (formats/json/SpaRV.json, rama 2025).
//
//   node scripts/build-bible.js ruta/a/SpaRV.json
//
// Además de compactar el formato, moderniza la ortografía de 1909 a la
// actual, sin tocar palabras ni sentido: "á Jonás" → "a Jonás", "fué" → "fue",
// y quita las mayúsculas de la primera palabra de cada capítulo.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BIBLE_BOOKS } from '../src/services/bibleBooks.js';

const src = process.argv[2];
if (!src) {
  console.error('Uso: node scripts/build-bible.js ruta/a/SpaRV.json');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'public/data/biblia/rv1909.json');

// Nombres de las letras hebreas que encabezan las estrofas del Salmo 119:
// van en mayúsculas a propósito y se dejan tal cual.
const HEBREW_LETTERS = new Set(['ALEPH']);

// Monosílabos que en 1909 llevaban tilde y hoy no
const MONOSILABOS = { 'fué': 'fue', 'fuí': 'fui', 'dió': 'dio', 'vió': 'vio' };

function capitalize(word) {
  return word.charAt(0) + word.slice(1).toLowerCase();
}

// La primera palabra de cada capítulo viene en mayúsculas ("EN el principio",
// "Y FUÉ palabra", "Salmo de David. JEHOVÁ es mi pastor"). Se pasa a la forma
// normal: con inicial mayúscula si abre la frase y en minúsculas si va detrás
// de una conjunción de una letra ("Y fue palabra").
function fixChapterStart(text) {
  const re = /(?<![\p{L}])\p{Lu}{2,}(?![\p{L}])/gu;
  let m;
  while ((m = re.exec(text))) {
    if (HEBREW_LETTERS.has(m[0])) continue;
    const before = text.slice(0, m.index);
    const afterSingleLetter = /(^|[.:;!?¡¿]\s*)\p{Lu}\s$/u.test(before);
    const word = afterSingleLetter ? m[0].toLowerCase() : capitalize(m[0]);
    // A veces son dos palabras seguidas: "LA SEGUNDA suerte", "HE AQUÍ que"
    const rest = text.slice(m.index + m[0].length)
      .replace(/^\s+\p{Lu}{2,}(?![\p{L}])/u, (w) => w.toLowerCase());
    return before + word + rest;
  }
  return text;
}

function modernize(text) {
  return text
    // La preposición "á" y la conjunción "ó" ya no llevan tilde
    .replace(/(?<![\p{L}])á(?![\p{L}])/gu, 'a')
    .replace(/(?<![\p{L}])Á(?![\p{L}])/gu, 'A')
    .replace(/(?<![\p{L}])ó(?![\p{L}])/gu, 'o')
    .replace(/(?<![\p{L}])Ó(?![\p{L}])/gu, 'O')
    .replace(/(?<![\p{L}])(fué|fuí|dió|vió)(?![\p{L}])/giu, (w) => {
      const fixed = MONOSILABOS[w.toLowerCase()];
      return w[0] === w[0].toUpperCase() ? fixed[0].toUpperCase() + fixed.slice(1) : fixed;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

const data = JSON.parse(readFileSync(src, 'utf8'));
if (data.books.length !== BIBLE_BOOKS.length) {
  throw new Error(`Se esperaban ${BIBLE_BOOKS.length} libros y hay ${data.books.length}`);
}

let total = 0;
const books = data.books.map((book, bi) => {
  const meta = BIBLE_BOOKS[bi];
  if (book.chapters.length !== meta.ch) {
    throw new Error(`${meta.name}: ${book.chapters.length} capítulos, se esperaban ${meta.ch}`);
  }

  return book.chapters.map((chapter) => {
    const verses = chapter.verses.map((v, i) => {
      if (v.verse !== i + 1) throw new Error(`${meta.name} ${chapter.chapter}: numeración salteada`);
      let t = v.text.trim();
      if (i === 0) t = fixChapterStart(t);
      return modernize(t);
    });

    // La fuente sigue la numeración inglesa y deja vacíos los versículos que en
    // español caen en el capítulo siguiente (Jonás 1:17 es aquí Jonás 2:1).
    // Siempre están al final del capítulo, así que se recortan sin correr números.
    while (verses.length && !verses[verses.length - 1]) verses.pop();
    if (verses.some((t) => !t)) throw new Error(`${meta.name} ${chapter.chapter}: versículo vacío en medio`);

    total += verses.length;
    return verses;
  });
});

const result = {
  id: 'rv1909',
  name: 'Reina-Valera 1909',
  license: 'Dominio público',
  books
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result));
console.log(`${out}: ${books.length} libros, ${total} versículos`);
