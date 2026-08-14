// MonthlyMemoryVerse Component — 12 citas bíblicas para memorizar al año (una por mes)
import { esc } from './escape.js';

export const MONTHLY_MEMORY_VERSES = [
  {
    month: 1,
    monthName: "Enero",
    theme: "Fe y Visión",
    passage: "Jeremías 29:11",
    verse: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis."
  },
  {
    month: 2,
    monthName: "Febrero",
    theme: "El Amor",
    passage: "1 Corintios 13:13",
    verse: "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor."
  },
  {
    month: 3,
    monthName: "Marzo",
    theme: "Fuerzas Nuevas",
    passage: "Isaías 40:31",
    verse: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán."
  },
  {
    month: 4,
    monthName: "Abril",
    theme: "Nueva Criatura",
    passage: "2 Corintios 5:17",
    verse: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas."
  },
  {
    month: 5,
    monthName: "Mayo",
    theme: "Confianza en Dios",
    passage: "Proverbios 3:5-6",
    verse: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas."
  },
  {
    month: 6,
    monthName: "Junio",
    theme: "Paz en la Oración",
    passage: "Filipenses 4:6-7",
    verse: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios guardará vuestros corazones."
  },
  {
    month: 7,
    monthName: "Julio",
    theme: "Valentía y Esfuerzo",
    passage: "Josué 1:9",
    verse: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas."
  },
  {
    month: 8,
    monthName: "Agosto",
    theme: "Propósito Eterno",
    passage: "Romanos 8:28",
    verse: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados."
  },
  {
    month: 9,
    monthName: "Septiembre",
    theme: "Orar sin Cesar",
    passage: "1 Tesalonicenses 5:16-18",
    verse: "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús."
  },
  {
    month: 10,
    monthName: "Octubre",
    theme: "El Fruto del Espíritu",
    passage: "Gálatas 5:22-23",
    verse: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza; contra tales cosas no hay ley."
  },
  {
    month: 11,
    monthName: "Noviembre",
    theme: "Gratitud y Alabanza",
    passage: "Salmos 100:4",
    verse: "Entrad por sus puertas con acción de gracias, por sus atrios con alabanza; alabadle, bendecid su nombre."
  },
  {
    month: 12,
    monthName: "Diciembre",
    theme: "Príncipe de Paz",
    passage: "Isaías 9:6",
    verse: "Porque un niño nos es nacido, hijo nos es dado... y se llamará su nombre Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz."
  }
];

export function getMemorizedMap() {
  try {
    return JSON.parse(localStorage.getItem('rap_memorized_months_v1') || '{}');
  } catch (e) {
    return {};
  }
}

export function getMemoryVerseForMonth(month) {
  return MONTHLY_MEMORY_VERSES.find((m) => m.month === month) || MONTHLY_MEMORY_VERSES[0];
}

// Modo práctica: oculta 1 de cada 3 palabras de más de 3 letras.
function toPracticeText(text) {
  return text
    .split(' ')
    .map((w, i) => (i % 3 === 1 && w.length > 3
      ? `<span class="blank">${'_'.repeat(Math.min(w.length, 7))}</span>`
      : esc(w)))
    .join(' ');
}

export function renderMonthlyMemoryVerse(container, { currentDate, onMemorizedToggle }) {
  const currentMonth = currentDate.getMonth() + 1;
  const item = getMemoryVerseForMonth(currentMonth);

  const memorizedMap = getMemorizedMap();
  const isMemorized = !!memorizedMap[currentMonth];
  const isPracticing = container.dataset.practiceMode === 'true';

  container.innerHTML = `
    <div class="memory-verse-card">
      <div class="memory-verse-header">
        <span class="memory-tag">Cita del mes · ${esc(item.monthName)}</span>
        <button id="btn-toggle-memorized" class="memory-status-badge ${isMemorized ? 'memorized' : ''}">
          ${isMemorized ? '✓ Memorizada' : 'Por memorizar'}
        </button>
      </div>

      <p class="memory-verse-quote">${isPracticing ? toPracticeText(item.verse) : `“${esc(item.verse)}”`}</p>

      <div class="memory-actions">
        <span class="memory-verse-passage">${esc(item.passage)}</span>
        <button id="btn-practice-hide" class="link-btn">
          ${isPracticing ? 'Ver completo' : 'Modo práctica'}
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-toggle-memorized')?.addEventListener('click', () => {
    const updated = !isMemorized;
    memorizedMap[currentMonth] = updated;
    localStorage.setItem('rap_memorized_months_v1', JSON.stringify(memorizedMap));
    if (updated && onMemorizedToggle) onMemorizedToggle(true);
    renderMonthlyMemoryVerse(container, { currentDate, onMemorizedToggle });
  });

  container.querySelector('#btn-practice-hide')?.addEventListener('click', () => {
    container.dataset.practiceMode = isPracticing ? 'false' : 'true';
    renderMonthlyMemoryVerse(container, { currentDate, onMemorizedToggle });
  });
}
