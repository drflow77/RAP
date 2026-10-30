// Historial de versiones. La primera entrada es la versión actual: se muestra
// en Ajustes y en la barra lateral. Súbela (y añade sus cambios) con cada
// publicación, y mantén igual package.json y el CACHE_NAME de public/sw.js.
export const CHANGELOG = [
  {
    version: '1.3.2',
    date: '2026-10-29',
    changes: ['Ajustes: se quitó la opción «Voz del devocional», que solo ofrecía «Automática»']
  },
  {
    version: '1.3.1',
    date: '2026-10-28',
    changes: ['Android: «Escuchar devocional» ahora lee en voz alta con la voz del teléfono (antes decía que no se podía)']
  },
  {
    version: '1.3.0',
    date: '2026-10-28',
    changes: [
      'Ajustes: nueva sección «Acerca de» con la descripción de RAP, la versión, la política de privacidad y las novedades',
      'Ajustes: se quitó la fila «Modo», que solo repetía si el color elegido es claro u oscuro'
    ]
  },
  {
    version: '1.2.2',
    date: '2026-10-25',
    changes: ['Política de privacidad publicada, con enlace al final de Ajustes']
  },
  {
    version: '1.2.1',
    date: '2026-10-24',
    changes: ['Devocional de noviembre: «La vida de David», del 4 al 30 (los días 1 al 3 siguen con los días apartados para Dios)']
  },
  {
    version: '1.2.0',
    date: '2026-10-18',
    changes: ['Preparada la versión nativa de Android (genérica, con el logo de la llama) para Google Play']
  },
  {
    version: '1.1.2',
    date: '2026-10-05',
    changes: ['Ajustes: la paleta de color muestra solo los círculos, sin nombres']
  },
  {
    version: '1.1.1',
    date: '2026-10-05',
    changes: ['Logo del canal en el botón Biblia de la versión PC']
  },
  {
    version: '1.1.0',
    date: '2026-10-05',
    changes: [
      'Plan de lectura bíblica del día, con casillas y acceso directo a la Biblia',
      'Biblia Reina-Valera 1909 sin conexión',
      'Nuevo tema de color: Negro',
      'Número de versión y novedades en Ajustes'
    ]
  },
  {
    version: '1.0.0',
    date: '2026-09-01',
    changes: ['Primera versión: devocional, 3 personas, petición, racha y respondidas']
  }
];

export const APP_VERSION = CHANGELOG[0].version;
