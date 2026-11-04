// Genera public/terminos.html y public/privacidad.html a partir de
// src/legal.js, para que la versión pública (la URL que pide Google Play) diga
// lo mismo que la que se lee dentro de la app y se vea con su mismo estilo.
//
//   node scripts/build-legal.js
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LEGAL, LEGAL_CONTACT } from '../src/legal.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// El correo se vuelve enlace; el resto es texto plano
const text = (s) => esc(s).replace(LEGAL_CONTACT, `<a href="mailto:${LEGAL_CONTACT}">${LEGAL_CONTACT}</a>`);

const OTHER = { terminos: 'privacidad', privacidad: 'terminos' };

function page(key) {
  const doc = LEGAL[key];
  const other = LEGAL[OTHER[key]];
  const paras = (list = []) => list.map((t) => `      <p>${text(t)}</p>`).join('\n');
  const sections = doc.sections.map((s) => [
    `    <section>`,
    `      <h2>${esc(s.h)}</h2>`,
    paras(s.p),
    s.li ? `      <ul>\n${s.li.map((t) => `        <li>${text(t)}</li>`).join('\n')}\n      </ul>` : '',
    paras(s.after),
    `    </section>`
  ].filter(Boolean).join('\n')).join('\n');

  return `<!doctype html>
<!-- Generado por scripts/build-legal.js desde src/legal.js: no editar a mano -->
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.title)} — RAP Oración</title>
<meta name="description" content="${esc(doc.title)} de la aplicación RAP Oración.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  /* Tema Bosque de la app (oscuro) y Marfil cuando el sistema está en claro */
  :root {
    --bg: #0A1512; --surf: #222826; --line: rgba(255, 255, 255, .16);
    --ink: #EDF3EF; --ink2: #9DB3A9; --ink3: #69837A; --acc: #7FC8A0;
    --halo: radial-gradient(120% 80% at 50% -10%, rgba(127, 200, 160, .14), transparent 60%);
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #F5F2EA; --surf: #FFFFFF; --line: rgba(24, 30, 26, .12);
      --ink: #141A16; --ink2: #4F5A53; --ink3: #8A948D; --acc: #2E5D4B;
      --halo: radial-gradient(120% 80% at 50% -10%, rgba(46, 93, 75, .08), transparent 60%);
    }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--halo), var(--bg); background-attachment: fixed; color: var(--ink);
    font: 400 0.875rem/1.7 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  }
  main { max-width: 640px; margin: 0 auto; padding: 36px 16px 64px; }
  .tag { font-weight: 700; font-size: 0.6rem; letter-spacing: .2em; text-transform: uppercase; color: var(--acc); }
  h1 { font: 400 2rem/1.15 'Newsreader', Georgia, serif; letter-spacing: -.01em; margin: 10px 0 6px; }
  .meta { color: var(--ink3); font-size: 0.75rem; margin-bottom: 22px; }
  .card { background: var(--surf); border: 1px solid var(--line); border-radius: 22px; padding: 6px 20px 20px; }
  h2 { font-weight: 700; font-size: 0.65rem; letter-spacing: .14em; text-transform: uppercase; color: var(--acc); margin: 20px 0 6px; }
  p, li { color: var(--ink2); }
  p + p, ul + p { margin-top: 8px; }
  ul { padding-left: 1.1rem; margin-top: 4px; }
  li { margin: 4px 0; }
  a { color: var(--acc); font-weight: 600; }
  footer { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 0.8rem; }
</style>
</head>
<body>
<main>
  <div class="tag">RAP Oración</div>
  <h1>${esc(doc.title)}</h1>
  <p class="meta">Última actualización: ${esc(doc.updated)}</p>

  <div class="card">
${sections}
  </div>

  <footer>
    <a href="./${OTHER[key]}.html">${esc(other.title)}</a>
    <a href="./">Volver a RAP Oración</a>
  </footer>
</main>
</body>
</html>
`;
}

for (const key of Object.keys(LEGAL)) {
  writeFileSync(resolve(root, 'public', `${key}.html`), page(key));
  console.log(`public/${key}.html`);
}
