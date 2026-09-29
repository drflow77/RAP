// Los 66 libros en el orden protestante, comunes a todas las versiones.
// Cada versión (data/biblia/<id>.json) guarda solo el texto, en este mismo
// orden, así que agregar una versión nueva no toca esta tabla.
//
// · name:  nombre para mostrar
// · abbr:  abreviatura corta para las citas
// · usfm:  código estándar del libro (lo usa YouVersion en sus enlaces)
// · alias: otras formas de escribirlo al buscar una cita (sin acentos, en minúsculas)
// · ch:    número de capítulos, para validar el texto al generarlo

export const BIBLE_BOOKS = [
  // Antiguo Testamento
  { name: 'Génesis', abbr: 'Gn', usfm: 'GEN', ch: 50, alias: ['gen', 'gn', 'ge'] },
  { name: 'Éxodo', abbr: 'Éx', usfm: 'EXO', ch: 40, alias: ['ex', 'exo', 'exod'] },
  { name: 'Levítico', abbr: 'Lv', usfm: 'LEV', ch: 27, alias: ['lv', 'lev'] },
  { name: 'Números', abbr: 'Nm', usfm: 'NUM', ch: 36, alias: ['nm', 'num'] },
  { name: 'Deuteronomio', abbr: 'Dt', usfm: 'DEU', ch: 34, alias: ['dt', 'deut'] },
  { name: 'Josué', abbr: 'Jos', usfm: 'JOS', ch: 24, alias: ['jos'] },
  { name: 'Jueces', abbr: 'Jue', usfm: 'JDG', ch: 21, alias: ['jue', 'jc'] },
  { name: 'Rut', abbr: 'Rt', usfm: 'RUT', ch: 4, alias: ['rt', 'ruth'] },
  { name: '1 Samuel', abbr: '1 S', usfm: '1SA', ch: 31, alias: ['1 s', '1 sam', '1sam', '1s', 'i samuel'] },
  { name: '2 Samuel', abbr: '2 S', usfm: '2SA', ch: 24, alias: ['2 s', '2 sam', '2sam', '2s', 'ii samuel'] },
  { name: '1 Reyes', abbr: '1 R', usfm: '1KI', ch: 22, alias: ['1 r', '1 re', '1 rey', '1re', '1r', 'i reyes'] },
  { name: '2 Reyes', abbr: '2 R', usfm: '2KI', ch: 25, alias: ['2 r', '2 re', '2 rey', '2re', '2r', 'ii reyes'] },
  { name: '1 Crónicas', abbr: '1 Cr', usfm: '1CH', ch: 29, alias: ['1 cr', '1 cro', '1cr', 'i cronicas'] },
  { name: '2 Crónicas', abbr: '2 Cr', usfm: '2CH', ch: 36, alias: ['2 cr', '2 cro', '2cr', 'ii cronicas'] },
  { name: 'Esdras', abbr: 'Esd', usfm: 'EZR', ch: 10, alias: ['esd'] },
  { name: 'Nehemías', abbr: 'Neh', usfm: 'NEH', ch: 13, alias: ['neh', 'ne'] },
  { name: 'Ester', abbr: 'Est', usfm: 'EST', ch: 10, alias: ['est'] },
  { name: 'Job', abbr: 'Job', usfm: 'JOB', ch: 42, alias: ['jb'] },
  { name: 'Salmos', abbr: 'Sal', usfm: 'PSA', ch: 150, alias: ['sal', 'salmo', 'sl', 'ps'] },
  { name: 'Proverbios', abbr: 'Pr', usfm: 'PRO', ch: 31, alias: ['pr', 'prov', 'pro'] },
  { name: 'Eclesiastés', abbr: 'Ec', usfm: 'ECC', ch: 12, alias: ['ec', 'ecl', 'ecles'] },
  { name: 'Cantares', abbr: 'Cnt', usfm: 'SNG', ch: 8, alias: ['cnt', 'cant', 'cantar de los cantares'] },
  { name: 'Isaías', abbr: 'Is', usfm: 'ISA', ch: 66, alias: ['is', 'isa'] },
  { name: 'Jeremías', abbr: 'Jer', usfm: 'JER', ch: 52, alias: ['jer', 'jr'] },
  { name: 'Lamentaciones', abbr: 'Lm', usfm: 'LAM', ch: 5, alias: ['lm', 'lam'] },
  { name: 'Ezequiel', abbr: 'Ez', usfm: 'EZK', ch: 48, alias: ['ez', 'eze'] },
  { name: 'Daniel', abbr: 'Dn', usfm: 'DAN', ch: 12, alias: ['dn', 'dan'] },
  { name: 'Oseas', abbr: 'Os', usfm: 'HOS', ch: 14, alias: ['os'] },
  { name: 'Joel', abbr: 'Jl', usfm: 'JOL', ch: 3, alias: ['jl'] },
  { name: 'Amós', abbr: 'Am', usfm: 'AMO', ch: 9, alias: ['am'] },
  { name: 'Abdías', abbr: 'Abd', usfm: 'OBA', ch: 1, alias: ['abd'] },
  { name: 'Jonás', abbr: 'Jon', usfm: 'JON', ch: 4, alias: ['jon'] },
  { name: 'Miqueas', abbr: 'Mi', usfm: 'MIC', ch: 7, alias: ['mi', 'miq'] },
  { name: 'Nahúm', abbr: 'Nah', usfm: 'NAM', ch: 3, alias: ['nah'] },
  { name: 'Habacuc', abbr: 'Hab', usfm: 'HAB', ch: 3, alias: ['hab'] },
  { name: 'Sofonías', abbr: 'Sof', usfm: 'ZEP', ch: 3, alias: ['sof'] },
  { name: 'Hageo', abbr: 'Hag', usfm: 'HAG', ch: 2, alias: ['hag'] },
  { name: 'Zacarías', abbr: 'Zac', usfm: 'ZEC', ch: 14, alias: ['zac'] },
  { name: 'Malaquías', abbr: 'Mal', usfm: 'MAL', ch: 4, alias: ['mal'] },

  // Nuevo Testamento
  { name: 'Mateo', abbr: 'Mt', usfm: 'MAT', ch: 28, alias: ['mt', 'mat'] },
  { name: 'Marcos', abbr: 'Mr', usfm: 'MRK', ch: 16, alias: ['mr', 'mc', 'mar'] },
  { name: 'Lucas', abbr: 'Lc', usfm: 'LUK', ch: 24, alias: ['lc', 'luc'] },
  { name: 'Juan', abbr: 'Jn', usfm: 'JHN', ch: 21, alias: ['jn', 'jua'] },
  { name: 'Hechos', abbr: 'Hch', usfm: 'ACT', ch: 28, alias: ['hch', 'hech', 'hechos de los apostoles'] },
  { name: 'Romanos', abbr: 'Ro', usfm: 'ROM', ch: 16, alias: ['ro', 'rom'] },
  { name: '1 Corintios', abbr: '1 Co', usfm: '1CO', ch: 16, alias: ['1 co', '1 cor', '1co', '1cor', 'i corintios'] },
  { name: '2 Corintios', abbr: '2 Co', usfm: '2CO', ch: 13, alias: ['2 co', '2 cor', '2co', '2cor', 'ii corintios'] },
  { name: 'Gálatas', abbr: 'Gá', usfm: 'GAL', ch: 6, alias: ['ga', 'gal'] },
  { name: 'Efesios', abbr: 'Ef', usfm: 'EPH', ch: 6, alias: ['ef', 'efe'] },
  { name: 'Filipenses', abbr: 'Fil', usfm: 'PHP', ch: 4, alias: ['fil', 'flp'] },
  { name: 'Colosenses', abbr: 'Col', usfm: 'COL', ch: 4, alias: ['col'] },
  { name: '1 Tesalonicenses', abbr: '1 Ts', usfm: '1TH', ch: 5, alias: ['1 ts', '1 tes', '1ts', '1tes', 'i tesalonicenses'] },
  { name: '2 Tesalonicenses', abbr: '2 Ts', usfm: '2TH', ch: 3, alias: ['2 ts', '2 tes', '2ts', '2tes', 'ii tesalonicenses'] },
  { name: '1 Timoteo', abbr: '1 Ti', usfm: '1TI', ch: 6, alias: ['1 ti', '1 tim', '1ti', '1tim', 'i timoteo'] },
  { name: '2 Timoteo', abbr: '2 Ti', usfm: '2TI', ch: 4, alias: ['2 ti', '2 tim', '2ti', '2tim', 'ii timoteo'] },
  { name: 'Tito', abbr: 'Tit', usfm: 'TIT', ch: 3, alias: ['tit'] },
  { name: 'Filemón', abbr: 'Flm', usfm: 'PHM', ch: 1, alias: ['flm', 'filem'] },
  { name: 'Hebreos', abbr: 'He', usfm: 'HEB', ch: 13, alias: ['he', 'heb'] },
  { name: 'Santiago', abbr: 'Stg', usfm: 'JAS', ch: 5, alias: ['stg', 'sant', 'st'] },
  { name: '1 Pedro', abbr: '1 P', usfm: '1PE', ch: 5, alias: ['1 p', '1 pe', '1 ped', '1pe', '1p', 'i pedro'] },
  { name: '2 Pedro', abbr: '2 P', usfm: '2PE', ch: 3, alias: ['2 p', '2 pe', '2 ped', '2pe', '2p', 'ii pedro'] },
  { name: '1 Juan', abbr: '1 Jn', usfm: '1JN', ch: 5, alias: ['1 jn', '1jn', 'i juan'] },
  { name: '2 Juan', abbr: '2 Jn', usfm: '2JN', ch: 1, alias: ['2 jn', '2jn', 'ii juan'] },
  { name: '3 Juan', abbr: '3 Jn', usfm: '3JN', ch: 1, alias: ['3 jn', '3jn', 'iii juan'] },
  { name: 'Judas', abbr: 'Jud', usfm: 'JUD', ch: 1, alias: ['jud'] },
  { name: 'Apocalipsis', abbr: 'Ap', usfm: 'REV', ch: 22, alias: ['ap', 'apoc', 'apocalipsis de juan'] }
];

// Mateo es el primer libro del Nuevo Testamento
export const NT_START = 39;
