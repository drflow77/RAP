// Historial de versiones. La primera entrada es la versión actual: se muestra
// en Ajustes y en la barra lateral. Súbela (y añade sus cambios) con cada
// publicación, y mantén igual package.json y el CACHE_NAME de public/sw.js.
export const CHANGELOG = [
  {
    version: '1.5.0',
    date: '2026-11-14',
    changes: [
      'Biblia: nuevo botón «Escuchar capítulo» arriba del texto, con «Pausar», «Continuar» y ■ para detener, igual que el devocional (en Android, con la voz del teléfono)',
      'Biblia: al tocar uno o varios versículos, la barra trae «Escuchar» para oír solo esos versículos con su cita',
      'Botones de audio más grandes y fáciles de ver: verde para escuchar y continuar, contorno verde mientras suena y «Detener» en rojo (también en el devocional)'
    ]
  },
  {
    version: '1.4.0',
    date: '2026-11-12',
    changes: [
      'Ajustes › Acerca de: texto más corto, con la frase «Cada desafío se transforma en aprendizaje…» (Rom 8:28)',
      'Nueva hoja «Compartir RAP» con código QR para que otra persona la instale: Google Play en Android, y la versión web para iPhone y computadora; botones para compartir o copiar el enlace'
    ]
  },
  {
    version: '1.3.5',
    date: '2026-11-04',
    changes: [
      'Escuchar devocional: el botón está arriba, junto al título; «Pausar» y «Continuar» siguen donde se quedó la lectura, y ■ la detiene',
      'Devocional con una sola letra para reflexión, «Declaro hoy», «Para escribir» y declaración final; el versículo y la oración resaltan en cursiva',
      'Ajustes › Acerca de: nuevos «Términos y condiciones» y la «Política de privacidad», que ahora se leen dentro de la app con su mismo estilo',
      'Tarjeta del Salmo de hoy con el logo de YouTube en rojo; la cita del mes lleva contorno para distinguirse',
      'El logo de la Biblia late como un corazón con halo rojo: al pasar el cursor en computadora, y al entrar a la app o tocarlo en el teléfono'
    ]
  },
  {
    version: '1.3.4',
    date: '2026-11-03',
    changes: [
      'Nueva tarjeta «Escucha el Salmo de hoy» debajo del devocional: abre en YouTube el Short del día del canal Palabra Vida Abundante (solo con conexión)'
    ]
  },
  {
    version: '1.3.3',
    date: '2026-11-01',
    changes: [
      'Escuchar devocional: las citas se leen completas («Lucas capítulo 5, versículo 21») y ya no como una hora',
      'Android: la voz suena por el altavoz y pasa al Bluetooth del auto, en vez de sonar como llamada; baja la música mientras lee',
      'Recordatorio: al elegir la hora en Ajustes se pide permiso de avisos; en Android llega cada día aunque la app esté cerrada',
      'Cita del mes de noviembre: Proverbios 4:23',
      'Navegador e iPhone: la lectura usa sola la voz en español más natural del dispositivo; en Ajustes vuelve «Voz del devocional» con un ejemplo al elegir, e instrucciones para descargar una voz «Mejorada» en iPhone'
    ]
  },
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
