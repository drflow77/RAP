// SettingsModal Component — hoja inferior: color de la app, nombre, recordatorio, voz, datos
import { storage } from '../state/storage.js';
import { notificationService } from '../services/notificationService.js';
import { THEMES, normalizeTheme } from '../state/themes.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

export function renderSettingsModal(container, { isOpen, onClose, onSettingsUpdated, onThemeChange }) {
  if (!isOpen) {
    container.innerHTML = '';
    return;
  }

  const settings = storage.getSettings();
  const activeTheme = normalizeTheme(settings.theme);
  const modeLabel = THEMES.find((t) => t.key === activeTheme)?.mode || 'Oscuro';
  const frequentPeople = storage.getFrequentPeople();

  const voices = ('speechSynthesis' in window ? window.speechSynthesis.getVoices() : [])
    .filter((v) => v.lang.startsWith('es'));

  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="sheet" id="modal-content-el">
        <div class="sheet-grabber"></div>

        <div class="sheet-head">
          <h3 class="sheet-title">Ajustes</h3>
          <button id="btn-close-settings" class="sheet-close" aria-label="Cerrar">✕</button>
        </div>

        <div class="settings-block">
          <div>
            <div class="settings-label">Color de la app</div>
            <div class="settings-hint">Elige el tema que más te guste</div>
          </div>
          <div class="theme-swatches">
            ${THEMES.map((t) => `
              <button class="theme-swatch ${t.key === activeTheme ? 'active' : ''}" data-theme="${t.key}">
                <span class="theme-swatch-dot" style="background: ${t.swatch}"></span>
                <span class="theme-swatch-label">${t.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Tu nombre</div>
            <div class="settings-hint">Aparece en tu saludo diario</div>
          </div>
          <input type="text" id="user-name-input" class="settings-row-value" placeholder="Tu nombre" value="${esc(settings.userName || '')}" />
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Recordatorio</div>
            <div class="settings-hint">Aviso diario para orar</div>
          </div>
          <input type="time" id="reminder-time-input" class="settings-row-value" value="${esc(settings.reminderTime || '07:00')}" />
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Modo</div>
            <div class="settings-hint">Claro u oscuro</div>
          </div>
          <span class="settings-row-value">${modeLabel}</span>
        </div>

        <div class="settings-row">
          <div>
            <div class="settings-label">Voz del devocional</div>
            <div class="settings-hint">Lectura en audio</div>
          </div>
          <select id="voice-select" class="settings-row-value">
            <option value="">Automática</option>
            ${voices.map((v) => `
              <option value="${esc(v.voiceURI)}" ${settings.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>
            `).join('')}
          </select>
        </div>

        <div class="settings-block">
          <div>
            <div class="settings-label">Personas frecuentes</div>
            <div class="settings-hint">Se añaden con un toque en el paso A</div>
          </div>
          <div class="settings-inline-list">
            ${frequentPeople.map((fp) => `
              <span class="frequent-tag">${esc(fp.name)}<button class="btn-remove-frequent" data-id="${esc(fp.id)}" aria-label="Quitar">✕</button></span>
            `).join('')}
          </div>
          <div class="settings-inline-form">
            <input type="text" id="new-frequent-name" placeholder="Añadir persona…" />
            <button id="btn-add-frequent" class="ghost-btn accent">${icons.plus} Añadir</button>
          </div>
        </div>

        <div class="settings-block">
          <div>
            <div class="settings-label">Datos</div>
            <div class="settings-hint">Tus oraciones se guardan solo en este dispositivo</div>
          </div>
          <div class="settings-actions">
            <button id="btn-test-notification" class="ghost-btn">${icons.bell} Probar aviso</button>
            <button id="btn-export-backup" class="ghost-btn">${icons.download} Copia</button>
            <button id="btn-import-backup-trigger" class="ghost-btn">${icons.upload} Restaurar</button>
            <input type="file" id="import-file-input" accept=".json" style="display: none;" />
          </div>
        </div>

        <div class="sheet-footer">
          <p>Inspirado en la metodología de oración de Ensancha Guatemala.<br>Versión 1.0.0</p>
        </div>
      </div>
    </div>
  `;

  const backdrop = container.querySelector('#modal-backdrop-el');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) onClose();
  });
  container.querySelector('#btn-close-settings')?.addEventListener('click', onClose);

  // Tema: se aplica al instante y se persiste
  container.querySelectorAll('.theme-swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      onThemeChange(btn.getAttribute('data-theme'));
    });
  });

  // Nombre
  const userNameInput = container.querySelector('#user-name-input');
  userNameInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    storage.saveSettings({ userName: val });
    const brandTitle = document.querySelector('.brand-title');
    if (brandTitle) {
      const greeting = brandTitle.textContent.split(',')[0].trim();
      brandTitle.textContent = val.trim() ? `${greeting}, ${val.trim()}` : greeting;
    }
  });
  userNameInput?.addEventListener('change', () => onSettingsUpdated());

  // Recordatorio
  container.querySelector('#reminder-time-input')?.addEventListener('change', (e) => {
    storage.saveSettings({ reminderTime: e.target.value });
    onSettingsUpdated();
  });

  // Voz
  container.querySelector('#voice-select')?.addEventListener('change', (e) => {
    storage.saveSettings({ voiceURI: e.target.value || null });
  });

  // Aviso de prueba
  container.querySelector('#btn-test-notification')?.addEventListener('click', async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      notificationService.sendNotification('Tiempo de oración RAP', {
        body: 'Nunca estás demasiado ocupado para no orar. Tómate 2 minutos hoy.'
      });
    } else {
      alert('Habilita los permisos de notificaciones en los ajustes de tu navegador.');
    }
  });

  // Personas frecuentes
  const addFreqInput = container.querySelector('#new-frequent-name');
  container.querySelector('#btn-add-frequent')?.addEventListener('click', () => {
    const name = addFreqInput.value.trim();
    if (name) {
      storage.addFrequentPerson(name);
      renderSettingsModal(container, { isOpen, onClose, onSettingsUpdated, onThemeChange });
    }
  });

  container.querySelectorAll('.btn-remove-frequent').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      storage.saveFrequentPeople(frequentPeople.filter((p) => p.id !== id));
      renderSettingsModal(container, { isOpen, onClose, onSettingsUpdated, onThemeChange });
    });
  });

  // Copia de seguridad
  container.querySelector('#btn-export-backup')?.addEventListener('click', () => {
    const blob = new Blob([storage.exportBackup()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rap-oracion-respaldo-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  const fileInput = container.querySelector('#import-file-input');
  container.querySelector('#btn-import-backup-trigger')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (storage.importBackup(ev.target.result)) {
        window.location.reload();
      } else {
        alert('El archivo no tiene el formato correcto.');
      }
    };
    reader.readAsText(file);
  });
}
