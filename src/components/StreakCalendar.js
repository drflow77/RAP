// StreakCalendar Component — anillo de constancia y calendario del mes
import { storage } from '../state/storage.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export function renderStreakCalendar(container, { selectedDate, onSelectDate }) {
  const streakInfo = storage.getStreakInfo();
  const allEntries = storage.getAllDailyEntries();

  const viewYear = selectedDate.getFullYear();
  const viewMonth = selectedDate.getMonth();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingCells = new Date(viewYear, viewMonth, 1).getDay(); // domingo = 0
  const monthOnly = new Intl.DateTimeFormat('es-ES', { month: 'long' })
    .format(new Date(viewYear, viewMonth, 1));
  const monthName = `${monthOnly.charAt(0).toUpperCase()}${monthOnly.slice(1)} ${viewYear}`;

  const todayStr = (() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  })();

  const dateStrFor = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  let prayedThisMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (allEntries[dateStrFor(d)]?.completed) prayedThisMonth++;
  }

  const ringPercent = Math.round((prayedThisMonth / daysInMonth) * 100);

  container.innerHTML = `
    <div class="stack-14 view-enter">
      <div class="streak-hero">
        <div class="streak-ring" style="background: conic-gradient(var(--acc) 0 ${ringPercent}%, var(--surf2) ${ringPercent}% 100%)">
          <div class="streak-ring-inner">
            <div>
              <div class="streak-ring-number">${streakInfo.currentStreak}</div>
              <div class="streak-ring-label">Días</div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="streak-hero-title">Tu constancia</h2>
          <p class="streak-hero-text">
            ${prayedThisMonth} de ${daysInMonth} días de ${esc(monthOnly)}. Tu mejor racha: ${streakInfo.maxStreak} ${streakInfo.maxStreak === 1 ? 'día' : 'días'}.
          </p>
        </div>
      </div>

      <div class="calendar-card">
        <div class="calendar-head">
          <span class="calendar-month">${esc(monthName)}</span>
          <div class="calendar-nav">
            <button id="cal-prev-month" class="date-nav-btn" aria-label="Mes anterior">${icons.chevronLeft}</button>
            <button id="cal-next-month" class="date-nav-btn" aria-label="Mes siguiente">${icons.chevronRight}</button>
          </div>
        </div>

        <div class="calendar-grid">
          ${WEEKDAYS.map((w) => `<div class="calendar-day-header">${w}</div>`).join('')}
          ${Array.from({ length: leadingCells }).map(() => `<div class="calendar-day-cell empty"></div>`).join('')}
          ${Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const dateStr = dateStrFor(d);
            const isPrayed = !!allEntries[dateStr]?.completed;
            const isToday = dateStr === todayStr;
            return `
              <div class="calendar-day-cell ${isPrayed ? 'prayed' : ''} ${isToday ? 'today' : ''}" data-date="${dateStr}">${d}</div>
            `;
          }).join('')}
        </div>

        <p class="calendar-legend" style="margin-top: 12px; text-align: right;">Oré · Hoy</p>
      </div>
    </div>
  `;

  container.querySelector('#cal-prev-month')?.addEventListener('click', () => {
    renderStreakCalendar(container, { selectedDate: new Date(viewYear, viewMonth - 1, 1), onSelectDate });
  });

  container.querySelector('#cal-next-month')?.addEventListener('click', () => {
    renderStreakCalendar(container, { selectedDate: new Date(viewYear, viewMonth + 1, 1), onSelectDate });
  });

  container.querySelectorAll('.calendar-day-cell:not(.empty)').forEach((cell) => {
    cell.addEventListener('click', () => {
      const [y, m, d] = cell.getAttribute('data-date').split('-').map(Number);
      onSelectDate(new Date(y, m - 1, d));
    });
  });
}
