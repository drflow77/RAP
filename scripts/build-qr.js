// Genera src/qrCodes.js con los códigos QR (SVG) de los enlaces de src/about.js,
// para que «Compartir RAP» los muestre sin conexión y sin librerías en la app.
//
//   node scripts/build-qr.js
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { LINKS } from '../src/about.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const out = {};
for (const [key, url] of Object.entries(LINKS)) {
  out[key] = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#111111', light: '#ffffff' }
  });
}

const file = `// Generado por scripts/build-qr.js — no editar a mano.
export const QR = ${JSON.stringify(out, null, 2)};
`;
writeFileSync(resolve(root, 'src/qrCodes.js'), file);
console.log('QR listos:', Object.keys(out).join(', '));
