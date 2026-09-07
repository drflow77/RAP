// RAP PWA Main Entrypoint & Orchestration
import confetti from 'canvas-confetti';
import { storage } from './state/storage.js';
import { applyTheme, normalizeTheme, applyTextScale, CONFETTI_PALETTES } from './state/themes.js';
import { devotionalService } from './services/devotionalService.js';
import { notificationService } from './services/notificationService.js';

import { renderHeader } from './components/Header.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderDevotionalCard } from './components/DevotionalCard.js';
import { renderThreePeoplePray } from './components/ThreePeoplePray.js';
import { renderPersonalPrayer } from './components/PersonalPrayer.js';
import { renderAnsweredWall } from './components/AnsweredWall.js';
import { renderStreakCalendar } from './components/StreakCalendar.js';
import { renderExploreDevotionals } from './components/ExploreDevotionals.js';
import { renderSettingsModal } from './components/SettingsModal.js';
import { renderInstallBanner } from './components/InstallBanner.js';
import { renderMonthlyMemoryVerse } from './components/MonthlyMemoryVerse.js';
import { renderWelcomeMemoryModal } from './components/WelcomeMemoryModal.js';
import { icons } from './components/icons.js';
import { esc } from './components/escape.js';

// En desarrollo el service worker cachearía los módulos de Vite y serviría
// versiones obsoletas tras cada cambio. Se limpia aquí arriba, antes de
// cualquier render, para que la purga ocurra aunque el resto falle.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((regs) => Promise.all(regs.map((r) => r.unregister())))
    .then(() => (window.caches ? caches.keys() : []))
    .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    .catch(() => {});
}

// Application State
const appState = {
  currentTab: 'today', // 'today' | 'answered' | 'streak' | 'explore'
  currentDate: new Date(),
  currentDevotional: null,
  dailyEntry: null,
  streakInfo: storage.getStreakInfo(),
  settings: storage.getSettings(),
  isSettingsOpen: false,
  isWelcomeOpen: !sessionStorage.getItem('rap_welcome_seen'),
  activeRapStep: 1 // 1: R, 2: A, 3: P
};

// Tema inicial (migra los valores antiguos 'dark' / 'light')
appState.settings.theme = normalizeTheme(appState.settings.theme);
applyTheme(appState.settings.theme);

// Tamaño de texto elegido por el usuario
appState.settings.textScale = applyTextScale(appState.settings.textScale);

storage.saveSettings({
  theme: appState.settings.theme,
  textScale: appState.settings.textScale
});

const appRoot = document.getElementById('app');

// Punto de corte de escritorio. Solo dispara al cruzarlo, no en cada resize.
const DESKTOP_MQ = window.matchMedia('(min-width: 900px)');
DESKTOP_MQ.addEventListener('change', () => renderApp());

function getDateString(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function loadCurrentDateData() {
  const dateStr = getDateString(appState.currentDate);
  appState.dailyEntry = storage.getDailyEntry(dateStr);
  appState.currentDevotional = await devotionalService.getByDate(appState.currentDate);
  appState.streakInfo = storage.getStreakInfo();
}

// Confeti con la paleta del tema activo
function fireCelebration() {
  const colors = CONFETTI_PALETTES[appState.settings.theme] || CONFETTI_PALETTES.bosque;
  const base = { origin: { x: 0.5, y: 0.7 }, colors, disableForReducedMotion: true };
  try {
    confetti({ ...base, particleCount: 90, spread: 74, startVelocity: 38, scalar: 0.9 });
    setTimeout(() => {
      confetti({ ...base, particleCount: 45, spread: 100, startVelocity: 28, scalar: 0.75 });
    }, 180);
  } catch (e) {
    console.log('Confetti unavailable');
  }
}

function setTheme(themeKey) {
  const key = applyTheme(themeKey);
  appState.settings.theme = key;
  storage.saveSettings({ theme: key });
  renderApp();
}

// Navegación inferior
function renderBottomNav() {
  const tabs = [
    { key: 'today', label: 'Hoy', icon: icons.book },
    { key: 'answered', label: 'Respondidas', icon: icons.starOutline },
    { key: 'streak', label: 'Racha', icon: icons.calendar },
    { key: 'explore', label: '365 Días', icon: icons.grid }
  ];

  const navEl = document.createElement('nav');
  navEl.className = 'bottom-nav';
  navEl.innerHTML = tabs.map((t) => `
    <button class="nav-item ${appState.currentTab === t.key ? 'active' : ''}" data-tab="${t.key}">
      ${t.icon}
      <span>${t.label}</span>
    </button>
  `).join('');

  navEl.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.currentTab = btn.getAttribute('data-tab');
      renderApp();
    });
  });

  return navEl;
}

// Navegador de fecha + selector de pasos RAP
function renderTodayControls(mainView) {
  const isToday = new Date().toDateString() === appState.currentDate.toDateString();
  const dateLabel = appState.currentDate.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const dateBar = document.createElement('div');
  dateBar.className = 'date-nav-bar';
  dateBar.innerHTML = `
    <button id="btn-prev-day" class="date-nav-btn" aria-label="Día anterior">${icons.chevronLeft}</button>
    <div class="date-indicator" id="btn-date-today">
      <span class="date-day-name">${isToday ? 'Hoy' : appState.currentDate.getFullYear()}</span>
      <span class="date-full">${dateLabel}</span>
    </div>
    <button id="btn-next-day" class="date-nav-btn" aria-label="Día siguiente">${icons.chevronRight}</button>
  `;

  dateBar.querySelector('#btn-prev-day').addEventListener('click', async () => {
    appState.currentDate.setDate(appState.currentDate.getDate() - 1);
    await loadCurrentDateData();
    renderApp();
  });
  dateBar.querySelector('#btn-next-day').addEventListener('click', async () => {
    appState.currentDate.setDate(appState.currentDate.getDate() + 1);
    await loadCurrentDateData();
    renderApp();
  });
  dateBar.querySelector('#btn-date-today').addEventListener('click', async () => {
    appState.currentDate = new Date();
    await loadCurrentDateData();
    renderApp();
  });

  // En escritorio la barra de fecha se integra en la cabecera, junto al saludo.
  // En móvil se queda donde siempre: apretarla en la fila del saludo dejaba
  // sin sitio al nombre y a la racha.
  const headerInner = DESKTOP_MQ.matches
    ? document.querySelector('.app-header .header-inner')
    : null;

  if (headerInner) {
    headerInner.insertBefore(dateBar, headerInner.querySelector('.header-actions'));
  } else {
    mainView.appendChild(dateBar);
  }

  const steps = [
    { n: 1, letter: 'R', label: 'Relación' },
    { n: 2, letter: 'A', label: '3 Personas' },
    { n: 3, letter: 'P', label: 'Petición' }
  ];

  const stepsBar = document.createElement('div');
  stepsBar.className = 'rap-steps-bar';
  stepsBar.innerHTML = steps.map((s) => `
    <button class="step-indicator ${appState.activeRapStep === s.n ? 'active' : ''}" data-step="${s.n}">
      <span class="step-badge">${s.letter}</span>
      <span class="step-label">${s.label}</span>
    </button>
  `).join('');

  stepsBar.querySelectorAll('.step-indicator').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.activeRapStep = parseInt(btn.getAttribute('data-step'));
      renderApp();
    });
  });

  mainView.appendChild(stepsBar);
}

// Rótulo del paso RAP. Solo se muestra en escritorio: en móvil esa
// información ya la da la barra de pasos.
function makeStepTag(letra, texto) {
  const tag = document.createElement('div');
  tag.className = 'step-tag';
  tag.innerHTML = `<span class="step-tag-badge">Paso ${esc(letra)}</span><span class="step-tag-text">${esc(texto)}</span>`;
  return tag;
}

// Últimas respondidas, en versión corta para el riel de escritorio.
function renderRailAnswered(container) {
  const list = storage.getAnsweredPrayers()
    .slice()
    .sort((a, b) => String(b.answeredDate || '').localeCompare(String(a.answeredDate || '')))
    .slice(0, 3);

  const fecha = (iso) => {
    if (!iso) return '';
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  container.innerHTML = `
    <div class="rail-card">
      <div class="rail-card-head">
        <span class="rail-card-title">Respondidas</span>
        <button class="link-btn" id="rail-see-all">Ver todas</button>
      </div>
      ${list.length === 0 ? `
        <p class="rail-empty">Cuando Dios responda una oración, anótala aquí.</p>
      ` : list.map((item) => `
        <div class="rail-answered-item">
          <p class="rail-answered-text">${esc(item.title || item.request || '')}</p>
          <span class="rail-answered-date">${esc(fecha(item.answeredDate))}</span>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelector('#rail-see-all')?.addEventListener('click', () => {
    appState.currentTab = 'answered';
    renderApp();
  });
}

function saveEntry(updated) {
  appState.dailyEntry = updated;
  storage.saveDailyEntry(getDateString(appState.currentDate), updated);
}

// Main Render Function
async function renderApp() {
  appRoot.innerHTML = '';

  // 0. Barra lateral (solo visible en escritorio, la oculta el CSS en móvil)
  const sidebarContainer = document.createElement('div');
  renderSidebar(sidebarContainer, {
    currentTab: appState.currentTab,
    streakInfo: appState.streakInfo,
    theme: appState.settings.theme,
    logoUrl: `${import.meta.env.BASE_URL}brand/logo-faa.png`,
    onSelectTab: (tab) => {
      appState.currentTab = tab;
      renderApp();
    },
    onOpenSettings: () => {
      appState.isSettingsOpen = true;
      renderApp();
    },
    onThemeChange: (key) => {
      setTheme(key);
      appState.settings = storage.getSettings();
      renderApp();
    }
  });
  appRoot.appendChild(sidebarContainer);

  // Columna de contenido: cabecera + vista + barra inferior
  const appCol = document.createElement('div');
  appCol.className = 'app-col';
  appRoot.appendChild(appCol);

  // 1. Header
  const headerContainer = document.createElement('div');
  renderHeader(headerContainer, {
    streakInfo: appState.streakInfo,
    userName: appState.settings.userName,
    onOpenStreak: () => {
      appState.currentTab = 'streak';
      renderApp();
    },
    onOpenSettings: () => {
      appState.isSettingsOpen = true;
      renderApp();
    }
  });
  appCol.appendChild(headerContainer);

  // 2. Vista principal
  const mainView = document.createElement('main');
  mainView.className = 'main-view';

  if (appState.currentTab === 'today') {
    const installContainer = document.createElement('div');
    renderInstallBanner(installContainer);
    mainView.appendChild(installContainer);

    renderTodayControls(mainView);

    // Los tres pasos se montan siempre. En móvil el CSS deja visible solo el
    // activo (data-active-step), igual que antes; en escritorio, donde sí hay
    // sitio, se ven R, A y P a la vez y la barra de pasos se oculta.
    const todayGrid = document.createElement('div');
    todayGrid.className = 'today-grid view-enter';
    todayGrid.dataset.activeStep = String(appState.activeRapStep);

    const todayMain = document.createElement('div');
    todayMain.className = 'today-main';

    const todayRail = document.createElement('aside');
    todayRail.className = 'today-rail';

    {
      const stepR = document.createElement('section');
      stepR.className = 'rap-step';
      stepR.dataset.step = '1';
      stepR.appendChild(makeStepTag('R', 'Relación con Dios'));

      const devContainer = document.createElement('div');
      renderDevotionalCard(devContainer, appState.currentDevotional);
      stepR.appendChild(devContainer);

      todayMain.appendChild(stepR);
    }

    {
      const stepA = document.createElement('section');
      stepA.className = 'rap-step';
      stepA.dataset.step = '2';
      stepA.appendChild(makeStepTag('A', 'Tres personas'));

      const peopleContainer = document.createElement('div');
      renderThreePeoplePray(peopleContainer, {
        dailyEntry: appState.dailyEntry,
        frequentPeople: storage.getFrequentPeople(),
        onUpdateEntry: saveEntry
      });
      stepA.appendChild(peopleContainer);

      todayMain.appendChild(stepA);
    }

    {
      const stepP = document.createElement('section');
      stepP.className = 'rap-step';
      stepP.dataset.step = '3';
      stepP.appendChild(makeStepTag('P', 'Tu petición'));

      const prayerContainer = document.createElement('div');
      renderPersonalPrayer(prayerContainer, {
        dailyEntry: appState.dailyEntry,
        onUpdateEntry: saveEntry,
        onCompletePrayer: () => {
          const isNowCompleted = !appState.dailyEntry.completed;
          appState.dailyEntry.completed = isNowCompleted;
          appState.dailyEntry.completedAt = isNowCompleted ? new Date().toISOString() : null;

          storage.saveDailyEntry(getDateString(appState.currentDate), appState.dailyEntry);
          appState.streakInfo = storage.updateStreak();

          if (isNowCompleted) fireCelebration();
          renderApp();
        },
        onAddTestimony: (testimonyData) => {
          storage.addAnsweredPrayer(testimonyData);
          appState.currentTab = 'answered';
          renderApp();
        }
      });
      stepP.appendChild(prayerContainer);

      todayMain.appendChild(stepP);
    }

    // Riel lateral. La cita del mes acompaña al paso R como siempre; el
    // calendario y las respondidas solo aparecen en pantallas anchas, donde
    // sobra espacio a la derecha de la columna de lectura.
    const memoryVerseContainer = document.createElement('div');
    memoryVerseContainer.className = 'rail-memory';
    renderMonthlyMemoryVerse(memoryVerseContainer, {
      currentDate: appState.currentDate,
      onMemorizedToggle: (memorized) => {
        if (memorized) fireCelebration();
      }
    });
    todayRail.appendChild(memoryVerseContainer);

    const railStreak = document.createElement('div');
    railStreak.className = 'rail-only';
    renderStreakCalendar(railStreak, {
      selectedDate: appState.currentDate,
      onSelectDate: async (date) => {
        appState.currentDate = date;
        await loadCurrentDateData();
        renderApp();
      }
    });
    todayRail.appendChild(railStreak);

    const railAnswered = document.createElement('div');
    railAnswered.className = 'rail-only';
    renderRailAnswered(railAnswered);
    todayRail.appendChild(railAnswered);

    todayGrid.appendChild(todayMain);
    todayGrid.appendChild(todayRail);
    mainView.appendChild(todayGrid);

  } else if (appState.currentTab === 'answered') {
    const answeredContainer = document.createElement('div');
    renderAnsweredWall(answeredContainer, {});
    mainView.appendChild(answeredContainer);

  } else if (appState.currentTab === 'streak') {
    const streakContainer = document.createElement('div');
    renderStreakCalendar(streakContainer, {
      selectedDate: appState.currentDate,
      onSelectDate: async (date) => {
        appState.currentDate = date;
        appState.currentTab = 'today';
        await loadCurrentDateData();
        renderApp();
      }
    });
    mainView.appendChild(streakContainer);

  } else if (appState.currentTab === 'explore') {
    const exploreContainer = document.createElement('div');
    renderExploreDevotionals(exploreContainer, {
      onSelectDevotional: async (dev) => {
        const currentYear = new Date().getFullYear();
        appState.currentDate = new Date(currentYear, dev.month - 1, dev.day);
        appState.currentTab = 'today';
        appState.activeRapStep = 1;
        await loadCurrentDateData();
        renderApp();
      }
    });
    mainView.appendChild(exploreContainer);
  }

  appCol.appendChild(mainView);

  // 3. Hoja de ajustes
  const modalContainer = document.createElement('div');
  renderSettingsModal(modalContainer, {
    isOpen: appState.isSettingsOpen,
    onClose: () => {
      appState.isSettingsOpen = false;
      renderApp();
    },
    onSettingsUpdated: () => {
      appState.settings = storage.getSettings();
      renderApp();
    },
    onThemeChange: setTheme
  });
  appRoot.appendChild(modalContainer);

  // 4. Portada (una vez por sesión)
  if (appState.isWelcomeOpen) {
    const welcomeModalContainer = document.createElement('div');
    renderWelcomeMemoryModal(welcomeModalContainer, {
      currentDate: appState.currentDate,
      onClose: () => {
        appState.isWelcomeOpen = false;
        renderApp();
      }
    });
    appRoot.appendChild(welcomeModalContainer);
  }

  // 5. Navegación inferior
  appCol.appendChild(renderBottomNav());
}

// Daily Notification Scheduler in Background
function initDailyReminderChecker() {
  setInterval(() => {
    const settings = storage.getSettings();
    if (!settings.reminderTime) return;

    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (currentTimeStr === settings.reminderTime && now.getSeconds() < 10) {
      const entry = storage.getDailyEntry(getDateString(now));

      if (!entry || !entry.completed) {
        notificationService.sendNotification('Tiempo de oración RAP', {
          body: 'Nunca estás demasiado ocupado para no orar. Tómate 2 minutos para tu devocional y tus 3 personas.'
        });
      }
    }
  }, 30000);
}

function registerServiceWorker() {
  // Solo en la build de producción (en desarrollo se purga al arrancar).
  if (import.meta.env.DEV) return;

  if (!('serviceWorker' in navigator)) return;

  const doRegister = () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).then(
      (registration) => {
        console.log('RAP ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.log('RAP ServiceWorker registration failed: ', err);
      }
    );
  };

  // initApp es asíncrono, así que 'load' puede haber ocurrido ya:
  // en ese caso el listener no se dispararía nunca.
  if (document.readyState === 'complete') doRegister();
  else window.addEventListener('load', doRegister);
}

async function initApp() {
  await loadCurrentDateData();
  renderApp();
  initDailyReminderChecker();
  registerServiceWorker();

  // Las voces de speechSynthesis llegan de forma asíncrona en algunos navegadores
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      if (appState.isSettingsOpen) renderApp();
    });
  }
}

initApp();
