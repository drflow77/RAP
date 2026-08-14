// RAP PWA Main Entrypoint & Orchestration
import confetti from 'canvas-confetti';
import { storage } from './state/storage.js';
import { applyTheme, normalizeTheme, applyTextScale, CONFETTI_PALETTES } from './state/themes.js';
import { devotionalService } from './services/devotionalService.js';
import { notificationService } from './services/notificationService.js';

import { renderHeader } from './components/Header.js';
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

  mainView.appendChild(dateBar);

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

function saveEntry(updated) {
  appState.dailyEntry = updated;
  storage.saveDailyEntry(getDateString(appState.currentDate), updated);
}

// Main Render Function
async function renderApp() {
  appRoot.innerHTML = '';

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
  appRoot.appendChild(headerContainer);

  // 2. Vista principal
  const mainView = document.createElement('main');
  mainView.className = 'main-view';

  if (appState.currentTab === 'today') {
    const installContainer = document.createElement('div');
    renderInstallBanner(installContainer);
    mainView.appendChild(installContainer);

    renderTodayControls(mainView);

    if (appState.activeRapStep === 1) {
      const stepR = document.createElement('div');
      stepR.className = 'stack-14 view-enter';

      const devContainer = document.createElement('div');
      renderDevotionalCard(devContainer, appState.currentDevotional);
      stepR.appendChild(devContainer);

      const memoryVerseContainer = document.createElement('div');
      renderMonthlyMemoryVerse(memoryVerseContainer, {
        currentDate: appState.currentDate,
        onMemorizedToggle: (memorized) => {
          if (memorized) fireCelebration();
        }
      });
      stepR.appendChild(memoryVerseContainer);

      mainView.appendChild(stepR);

    } else if (appState.activeRapStep === 2) {
      const peopleContainer = document.createElement('div');
      renderThreePeoplePray(peopleContainer, {
        dailyEntry: appState.dailyEntry,
        frequentPeople: storage.getFrequentPeople(),
        onUpdateEntry: saveEntry
      });
      mainView.appendChild(peopleContainer);

    } else {
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
      mainView.appendChild(prayerContainer);
    }

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

  appRoot.appendChild(mainView);

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
  appRoot.appendChild(renderBottomNav());
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
