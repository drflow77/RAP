// SettingsModal Component — hoja inferior: color de la app, nombre, recordatorio, voz, datos, acerca de
import { storage } from '../state/storage.js';
import { notificationService, getSpanishVoices } from '../services/notificationService.js';
import { isNative } from '../platform.js';
import { THEMES, normalizeTheme, TEXT_SCALES, normalizeTextScale, applyTextScale } from '../state/themes.js';
import { icons } from './icons.js';
import { esc } from './escape.js';
import { CHANGELOG, APP_VERSION } from '../changelog.js';
import { LEGAL } from '../legal.js';

// Términos o privacidad dentro de la misma hoja, con el estilo de la app.
// «‹ Ajustes» vuelve a la hoja de ajustes.
function renderLegalSheet(container, key, props) {
  const doc = LEGAL[key];
  const paras = (list = []) => list.map((t) => `<p>${esc(t)}</p>`).join('');

  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop-el">
      <div class="sheet" id="modal-content-el">
        <div class="sheet-grabber"></div>

        <div class="sheet-head">
          <button id="btn-legal-back" class="legal-back">‹ Ajustes</button>
          <button id="btn-close-settings" class="sheet-close" aria-label="Cerrar">✕</button>
        </div>

        <div>
          <h3 class="sheet-title">${esc(doc.title)}</h3>
          <div class="settings-hint">RAP Oración · Última actualización: ${esc(doc.updated)}</div>
        </div>

        <div class="settings-block legal-doc">
          ${doc.sections.map((s) => `
            <section>
              <h4 class="legal-h">${esc(s.h)}</h4>
              ${paras(s.p)}
              ${s.li ? `<ul>${s.li.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
              ${paras(s.after)}
            </section>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const backdrop = container.querySelector('#modal-backdrop-el');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) props.onClose();
  });
  container.querySelector('#btn-close-settings')?.addEventListener('click', props.onClose);
  container.querySelector('#btn-legal-back')?.addEventListener('click', () => renderSettingsModal(container, props));
}

export function renderSettingsModal(container, props) {
  const { isOpen, onClose, onSettingsUpdated, onThemeChange } = props;
  if (!isOpen) {
    container.innerHTML = '';
    return;
  }

  const settings = storage.getSettings();
  const activeTheme = normalizeTheme(settings.theme);
  const activeScale = normalizeTextScale(settings.textScale);
  const frequentPeople = storage.getFrequentPeople();

  // En Android la app usa la voz del teléfono; el selector es solo para la web
  const voices = isNative ? [] : getSpanishVoices();
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const hasGoodVoice = voices.some((v) => /premium|mejorad|enhanced/i.test(v.name));

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
              <button class="theme-swatch ${t.key === activeTheme ? 'active' : ''}" data-theme="${t.key}" aria-label="Tema ${t.label}" title="${t.label}">
                <span class="theme-swatch-dot" style="background: ${t.swatch}"></span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="settings-block">
          <div>
            <div class="settings-label">Tamaño del texto</div>
            <div class="settings-hint">Para leer más cómodo</div>
          </div>
          <div class="text-scale-options">
            ${TEXT_SCALES.map((s) => `
              <button class="text-scale-option ${s.value === activeScale ? 'active' : ''}" data-scale="${s.value}">
                <span class="text-scale-sample" style="font-size: ${Math.round(13 * s.value)}px">Aa</span>
                <span class="text-scale-label">${s.label}</span>
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
            <div class="settings-hint">${isNative ? 'Aviso diario para orar' : 'Aviso diario para orar (con RAP abierta)'}</div>
          </div>
          <input type="time" id="reminder-time-input" class="settings-row-value" value="${esc(settings.reminderTime || '07:00')}" />
        </div>

        ${voices.length > 1 ? `<div class="settings-row">
          <div>
            <div class="settings-label">Voz del devocional</div>
            <div class="settings-hint">Al elegirla se escucha un ejemplo</div>
          </div>
          <select id="voice-select" class="settings-row-value">
            <option value="">Automática</option>
            ${voices.map((v) => `
              <option value="${esc(v.voiceURI)}" ${settings.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>
            `).join('')}
          </select>
        </div>` : ''}

        ${isIOS && !isNative && !hasGoodVoice ? `<div class="settings-block">
          <div>
            <div class="settings-label">Una voz más natural</div>
            <div class="settings-hint">En el iPhone abre Ajustes › Accesibilidad › Contenido leído › Voces › Español, elige una voz (por ejemplo Paulina) y descarga la versión «Mejorada». Luego cierra y abre RAP: la usará sola.</div>
          </div>
        </div>` : ''}

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

        <div class="settings-block">
          <div>
            <div class="settings-label">Acerca de</div>
            <div class="settings-hint">RAP Oración · versión ${esc(APP_VERSION)}</div>
          </div>
          <div class="settings-about">
            <p>Diario de oración con el método RAP: <strong>Relación</strong> (el devocional del día), <strong>Amor</strong> (tres personas por quienes orar) y <strong>Petición</strong> (tu petición personal).</p>
            <p>Inspirado en la metodología de oración de Ensancha Guatemala. Desarrollada por Medicode Solutions.</p>
          </div>
          <div class="legal-links">
            <button class="legal-link" data-legal="terminos">Términos y condiciones <span aria-hidden="true">›</span></button>
            <button class="legal-link" data-legal="privacidad">Política de privacidad <span aria-hidden="true">›</span></button>
          </div>
          <details class="changelog">
            <summary>Novedades</summary>
            ${CHANGELOG.map((c) => `
              <div class="changelog-entry">
                <strong>v${esc(c.version)} · ${esc(c.date)}</strong>
                <ul>${c.changes.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
              </div>
            `).join('')}
          </details>
        </div>
      </div>
    </div>
  `;

  const backdrop = container.querySelector('#modal-backdrop-el');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) onClose();
  });
  container.querySelector('#btn-close-settings')?.addEventListener('click', onClose);

  container.querySelectorAll('.legal-link').forEach((btn) => {
    btn.addEventListener('click', () => renderLegalSheet(container, btn.getAttribute('data-legal'), props));
  });

  // Tema: se aplica al instante y se persiste
  container.querySelectorAll('.theme-swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      onThemeChange(btn.getAttribute('data-theme'));
    });
  });

  // Tamaño del texto: se aplica al instante y se persiste
  container.querySelectorAll('.text-scale-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const scale = applyTextScale(btn.getAttribute('data-scale'));
      storage.saveSettings({ textScale: scale });
      container.querySelectorAll('.text-scale-option').forEach((b) => {
        b.classList.toggle('active', Number(b.getAttribute('data-scale')) === scale);
      });
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
  container.querySelector('#reminder-time-input')?.addEventListener('change', async (e) => {
    const time = e.target.value;
    storage.saveSettings({ reminderTime: time });
    onSettingsUpdated();
    // Antes solo se guardaba la hora: sin permiso de avisos nunca llegaba nada
    if (isNative) {
      const ok = await notificationService.scheduleDailyReminder(time, { askPermission: true });
      if (!ok) alert('Para recibir el recordatorio, permite las notificaciones de RAP en los ajustes del teléfono.');
    } else if (time && !(await notificationService.requestPermission())) {
      alert('Para recibir el recordatorio, permite las notificaciones en los ajustes de tu navegador.');
    }
  });

  // Voz
  container.querySelector('#voice-select')?.addEventListener('change', (e) => {
    storage.saveSettings({ voiceURI: e.target.value || null });
    notificationService.previewVoice(e.target.value);
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
