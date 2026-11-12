// Textos de Ajustes › Acerca de y de «Compartir RAP». Los enlaces viven aquí
// para que el QR (scripts/build-qr.js) y el texto que se comparte digan lo mismo.

export const LINKS = {
  play: 'https://play.google.com/store/apps/details?id=app.rap.oracion',
  web: 'https://drflow77.github.io/RAP/'
};

// Frase final de «Acerca de» (la misma de RopiCalc).
export const ABOUT_QUOTE = '“Cada desafío se transforma en aprendizaje, cada rechazo en mejora. Porque sé que todo obra para bien (Rom 8:28).”';

export const SHARE_TEXT = [
  'Te comparto RAP Oración, un diario de oración para cada día: Relación, Amor y Petición.',
  `Android (Google Play): ${LINKS.play}`,
  `iPhone y computadora: ${LINKS.web}`
].join('\n\n');
