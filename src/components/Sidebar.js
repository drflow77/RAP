// Sidebar Component — navegación lateral de escritorio.
// En móvil no se muestra: ahí sigue mandando la barra inferior.
//
// Como en el resto de componentes de la app, la plantilla se arma con esc()
// sobre todo lo que venga de fuera del módulo; los iconos son SVG constantes
// definidos en icons.js y los colores salen de THEMES.
import { icons } from './icons.js';
import { esc } from './escape.js';
import { THEMES } from '../state/themes.js';

const NAV_ITEMS = [
  { key: 'today', label: 'Hoy', icon: icons.book },
  { key: 'answered', label: 'Respondidas', icon: icons.starOutline },
  { key: 'streak', label: 'Racha', icon: icons.calendar },
  { key: 'explore', label: '365 Días', icon: icons.grid }
];

export function renderSidebar(container, {
  currentTab,
  streakInfo,
  theme,
  logoUrl,
  onSelectTab,
  onOpenSettings,
  onThemeChange
}) {
  const dias = Number(streakInfo?.currentStreak) || 0;
  const diasCopy = dias === 1 ? '1 día seguido' : `${dias} días seguidos`;

  const markup = `
    <aside class="app-side">
      <div class="side-brand">
        <div class="side-logo" role="img" aria-label="Fundación Amigos Axapusco"
             style="-webkit-mask-image:url('${esc(logoUrl)}');mask-image:url('${esc(logoUrl)}')"></div>
        <div class="side-brand-copy">
          <div class="side-wordmark">Diario de oración</div>
          <div class="side-tagline">Relación · Amor · Petición</div>
        </div>
      </div>

      <nav class="side-nav">
        ${NAV_ITEMS.map((t) => `
          <button class="side-nav-item ${currentTab === t.key ? 'active' : ''}" data-tab="${esc(t.key)}">
            ${t.icon}
            <span>${esc(t.label)}</span>
          </button>
        `).join('')}
      </nav>

      <button class="side-streak" id="side-streak" title="Ver tu racha">
        <span class="side-streak-num">${dias}</span>
        <span class="side-streak-copy">
          <span class="side-streak-label">Racha</span>
          <span class="side-streak-days">${esc(diasCopy)}</span>
        </span>
      </button>

      <div class="side-foot">
        <span class="side-foot-label">Color de la app</span>
        <div class="side-themes">
          ${THEMES.map((t) => `
            <button class="side-theme ${theme === t.key ? 'active' : ''}"
                    data-theme="${esc(t.key)}" title="${esc(t.label)}" aria-label="Tema ${esc(t.label)}">
              <span style="background:${esc(t.swatch)}"></span>
            </button>
          `).join('')}
        </div>

        <button class="side-settings" id="side-settings">
          ${icons.gear}
          <span>Ajustes</span>
        </button>
      </div>
    </aside>
  `;

  container.innerHTML = markup;

  container.querySelectorAll('.side-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => onSelectTab(btn.getAttribute('data-tab')));
  });

  container.querySelector('#side-streak')?.addEventListener('click', () => onSelectTab('streak'));
  container.querySelector('#side-settings')?.addEventListener('click', onOpenSettings);

  container.querySelectorAll('.side-theme').forEach((btn) => {
    btn.addEventListener('click', () => onThemeChange(btn.getAttribute('data-theme')));
  });
}
