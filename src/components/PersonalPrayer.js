// PersonalPrayer Component — "P" (Petición personal)
import { esc } from './escape.js';

const AVAILABLE_TAGS = ['Familia', 'Salud', 'Trabajo', 'Iglesia', 'Provisión', 'Sabiduría'];

export function renderPersonalPrayer(container, { dailyEntry, onUpdateEntry, onCompletePrayer, onAddTestimony }) {
  // Copia mutable: los handlers editan campos distintos y no deben pisarse entre sí
  const entry = { ...dailyEntry, tags: [...(dailyEntry.tags || [])] };
  const currentTags = entry.tags;
  const isCompleted = entry.completed;
  const hasPrayerText = !!(entry.personalPrayer || '').trim();

  container.innerHTML = `
    <div class="stack-14 view-enter">
      <div class="screen-head">
        <h2 class="section-title">Tu petición personal</h2>
        <p class="section-subtitle">Lo que hoy le entregas a Dios. Solo tú lo ves.</p>
      </div>

      <textarea
        id="personal-prayer-input"
        class="prayer-textarea"
        placeholder="Señor, hoy te pido…"
      >${esc(entry.personalPrayer || '')}</textarea>

      <div class="prayer-tag-selector">
        ${AVAILABLE_TAGS.map((tag) => `
          <button class="tag-btn ${currentTags.includes(tag) ? 'selected' : ''}" data-tag="${esc(tag)}">${esc(tag)}</button>
        `).join('')}
      </div>

      ${hasPrayerText ? `
        <div class="testimony-tools">
          <button id="btn-save-as-testimony" class="ghost-btn accent">Pasar al muro de testimonios</button>
        </div>
      ` : ''}

      <button id="btn-complete-rap" class="cta-btn ${isCompleted ? 'completed' : ''}">
        ${isCompleted ? '✓ Oración de hoy completada' : 'Terminar mi oración de hoy'}
      </button>

      <p class="slogan-footer">“Nunca estás demasiado ocupado para no orar.”</p>
    </div>
  `;

  container.querySelectorAll('.tag-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      const idx = currentTags.indexOf(tag);
      if (idx >= 0) currentTags.splice(idx, 1);
      else currentTags.push(tag);

      btn.classList.toggle('selected', idx < 0);
      onUpdateEntry({ ...entry, tags: [...currentTags] });
    });
  });

  const textarea = container.querySelector('#personal-prayer-input');
  textarea?.addEventListener('input', (e) => {
    entry.personalPrayer = e.target.value;
    onUpdateEntry({ ...entry, tags: [...currentTags] });
  });

  container.querySelector('#btn-save-as-testimony')?.addEventListener('click', () => {
    onAddTestimony({
      title: currentTags.length > 0 ? `Petición · ${currentTags.join(', ')}` : 'Petición personal',
      request: entry.personalPrayer,
      category: currentTags[0] || 'General'
    });
  });

  container.querySelector('#btn-complete-rap')?.addEventListener('click', onCompletePrayer);
}
