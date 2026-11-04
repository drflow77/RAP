// Textos legales que se leen dentro de la app (Ajustes › Acerca de), con el
// mismo estilo que el resto de RAP. public/privacidad.html y
// public/terminos.html son la versión pública (la URL que pide Google Play):
// se generan desde aquí con `node scripts/build-legal.js`: si cambias un
// texto, vuelve a correrlo y actualiza la fecha.

export const LEGAL_CONTACT = 'privacidad@medicode-solutions.com';

export const LEGAL = {
  terminos: {
    title: 'Términos y condiciones',
    updated: '4 de noviembre de 2026',
    sections: [
      {
        h: 'Aceptación',
        p: ['Al instalar o usar la aplicación RAP Oración («RAP») aceptas estos términos. Si no estás de acuerdo con ellos, no utilices la aplicación. RAP es desarrollada y publicada por Medicode Solutions.']
      },
      {
        h: 'Qué es RAP',
        p: ['RAP es un diario de oración personal y gratuito basado en el método Relación, Amor y Petición. Incluye un devocional diario, la Biblia, un plan de lectura, una cita mensual para memorizar y herramientas para registrar tus oraciones.']
      },
      {
        h: 'Uso de la aplicación',
        p: ['RAP es una herramienta de crecimiento espiritual. Su contenido no sustituye el consejo pastoral, médico, psicológico ni legal. Si atraviesas una situación de crisis, busca la ayuda de un profesional o de tu comunidad de fe.'],
        li: [
          'Usa la aplicación con fines personales y no comerciales.',
          'No intentes alterar, copiar o redistribuir la aplicación ni su código.',
          'Eres responsable de lo que escribes en tus oraciones y notas.'
        ]
      },
      {
        h: 'Tus datos',
        p: ['Todo lo que registras se guarda solo en tu dispositivo, como se explica en la Política de privacidad. Por eso, si borras los datos, cambias de teléfono o desinstalas RAP sin haber hecho antes una «Copia» desde Ajustes, la información no se puede recuperar. Hacer y guardar esas copias es tu responsabilidad.']
      },
      {
        h: 'Contenido',
        p: ['Los devocionales se basan en la metodología de oración de Ensancha Guatemala y se comparten con fines de edificación, sin costo. El texto bíblico incluido es la Reina-Valera 1909, de dominio público. El diseño, el código y los textos propios de la aplicación pertenecen a Medicode Solutions.']
      },
      {
        h: 'Enlaces externos',
        p: ['RAP puede incluir enlaces a sitios y servicios de terceros, como YouTube o bible.com. Al abrirlos sales de la aplicación y aplican los términos y la política de privacidad de esos sitios. Medicode Solutions no controla ni se hace responsable de su contenido.']
      },
      {
        h: 'Disponibilidad y garantía',
        p: ['RAP se ofrece «tal cual», sin garantías de ningún tipo. Procuramos que funcione bien y que el contenido sea correcto, pero puede contener errores o dejar de estar disponible temporalmente. Medicode Solutions no será responsable por daños derivados del uso de la aplicación o de la pérdida de datos guardados en tu dispositivo.']
      },
      {
        h: 'Cambios',
        p: ['Podemos actualizar la aplicación y estos términos. Cuando lo hagamos, cambiará la fecha de «Última actualización». Seguir usando RAP después de un cambio significa que aceptas los términos actualizados.']
      },
      {
        h: 'Legislación aplicable',
        p: ['Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.']
      },
      {
        h: 'Contacto',
        p: [`Medicode Solutions · ${LEGAL_CONTACT}`]
      }
    ]
  },

  privacidad: {
    title: 'Política de privacidad',
    updated: '4 de noviembre de 2026',
    sections: [
      {
        h: 'Quién es el responsable',
        p: [`La aplicación RAP Oración («RAP») es desarrollada y publicada por Medicode Solutions. Para cualquier duda sobre esta política, escríbenos a ${LEGAL_CONTACT}.`]
      },
      {
        h: 'En resumen',
        p: ['RAP no te pide crear una cuenta, no pide tu correo ni tu teléfono y no envía lo que escribes a ningún servidor nuestro. Todo lo que registras en la aplicación se queda guardado en tu propio dispositivo.']
      },
      {
        h: 'Qué información se guarda en tu dispositivo',
        p: ['Mientras usas la aplicación, se guarda localmente en tu teléfono, tableta o navegador:'],
        li: [
          'Tus entradas diarias de oración, incluidos los nombres de las personas por las que oras, los motivos y tus notas personales.',
          'Tus peticiones personales, las oraciones contestadas y tu lista de personas frecuentes.',
          'Tu racha, tu progreso de lectura bíblica y los versículos que marcas como guardados.',
          'Tus preferencias: nombre que elijas mostrar, tema de color, tamaño de texto, voz de lectura y hora del recordatorio.'
        ],
        after: ['Esta información no sale de tu dispositivo y Medicode Solutions no tiene acceso a ella. Si borras los datos de la aplicación o del navegador, o la desinstalas, esa información se elimina y no podemos recuperarla.']
      },
      {
        h: 'Copia de seguridad',
        p: ['La opción «Copia» de Ajustes genera un archivo en tu dispositivo con tus datos, para que tú lo guardes donde quieras. Nosotros no recibimos ese archivo. Quien tenga acceso a él podrá leer su contenido, así que consérvalo en un lugar seguro.']
      },
      {
        h: 'Permisos',
        li: [
          'Notificaciones: solo si activas el recordatorio diario. Se programan en tu dispositivo y puedes desactivarlas en cualquier momento desde Ajustes o desde la configuración del sistema.',
          'La lectura en voz alta usa la voz de síntesis de tu propio dispositivo.',
          'RAP no usa tu ubicación, cámara, micrófono, contactos ni archivos.'
        ]
      },
      {
        h: 'Servicios de terceros',
        li: [
          'Google Fonts: la aplicación puede cargar tipografías desde los servidores de Google. Al hacerlo, Google puede recibir datos técnicos como tu dirección IP.',
          'Enlaces externos: algunos versículos enlazan a la Biblia en línea (bible.com) y la tarjeta del Salmo de hoy abre un video en YouTube. Si los abres, sales de RAP y aplica la política de ese sitio.'
        ],
        after: ['RAP no incluye publicidad, no usa herramientas de analítica y no comparte ni vende información a terceros.']
      },
      {
        h: 'Menores de edad',
        p: ['RAP no recopila datos personales de ningún usuario, incluidos los menores de edad. Los padres o tutores pueden revisar libremente lo que se guarda en el dispositivo de sus hijos.']
      },
      {
        h: 'Tus derechos',
        p: ['Como tus datos están solo en tu dispositivo, tú tienes el control total: puedes consultarlos, editarlos, exportarlos con «Copia» y borrarlos en cualquier momento eliminando los datos de la aplicación o desinstalándola.']
      },
      {
        h: 'Cambios a esta política',
        p: ['Si en el futuro la aplicación cambia la forma en que trata la información, actualizaremos esta política y la fecha de «Última actualización».']
      },
      {
        h: 'Contacto',
        p: [`Medicode Solutions · ${LEGAL_CONTACT}`]
      }
    ]
  }
};
