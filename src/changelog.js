// Historial de versiones. La primera entrada es la versión actual: se muestra
// en Ajustes y en la barra lateral. Súbela (y añade sus cambios) con cada
// publicación, y mantén igual package.json y el CACHE_NAME de public/sw.js.
export const CHANGELOG = [
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
