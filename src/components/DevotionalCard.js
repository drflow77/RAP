// DevotionalCard Component — "R" (Relación con Dios)
import { notificationService } from '../services/notificationService.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

export function renderDevotionalCard(container, devotional) {
  if (!devotional) {
    container.innerHTML = `
      <div class="rap-card text-center">
        <p class="section-subtitle">Cargando devocional del día…</p>
      </div>
    `;
    return;
  }

  const isSpeaking = notificationService.isSpeaking();

  container.innerHTML = `
    <div class="devotional-card">
      <div class="devotional-head">
        <div class="devotional-theme">${esc(devotional.theme)}</div>
        <h2 class="devotional-title">${esc(devotional.title)}</h2>
        ${devotional.pending ? '<span class="pending-tag">Devocional en espera</span>' : ''}
      </div>

      <div class="devotional-body">
        <blockquote class="verse-box">
          <p class="verse-text">“${esc(devotional.verse)}”</p>
          <span class="verse-passage">${esc(devotional.passage)}</span>
        </blockquote>

        ${devotional.pending ? `
        <div class="pending-box">
          <p class="pending-text">
            La enseñanza completa de ${esc(devotional.monthName)} se publicará al inicio del mes.
            Mientras tanto puedes meditar en el pasaje de hoy y orar con él.
          </p>
        </div>` : ''}

        ${devotional.reflection ? `<p class="reflection-body">${esc(devotional.reflection)}</p>` : ''}

        ${devotional.declaration ? `
        <div class="declaration-box">
          <span class="declaration-icon">${icons.star}</span>
          <p class="declaration-text"><strong>Declaro hoy:</strong> ${esc(devotional.declaration)}</p>
        </div>` : ''}

        ${devotional.prayerPrompt ? `
        <div class="write-box">
          <span class="write-label">${icons.pen} Para escribir</span>
          <p class="write-text">${esc(devotional.prayerPrompt)}</p>
        </div>` : ''}

        ${devotional.prayer ? `
        <div class="prayer-box">
          <span class="prayer-label">Oración</span>
          <p class="prayer-text">“${esc(devotional.prayer)}”</p>
        </div>` : ''}

        <div class="card-footer-actions">
          <button id="btn-audio-listen" class="action-pill-btn ${isSpeaking ? 'active' : ''}">
            ${icons.speaker}
            <span id="audio-text">${isSpeaking ? 'Reproduciendo…' : 'Escuchar devocional'}</span>
          </button>

          <button id="btn-share-devotional" class="action-square-btn" title="Compartir" aria-label="Compartir devocional">
            ${icons.share}
          </button>
        </div>
      </div>
    </div>
  `;

  // Audio Reading Handler
  const audioBtn = container.querySelector('#btn-audio-listen');
  const audioText = container.querySelector('#audio-text');

  audioBtn?.addEventListener('click', () => {
    if (notificationService.isSpeaking()) {
      notificationService.stopSpeaking();
      audioBtn.classList.remove('active');
      audioText.textContent = 'Escuchar devocional';
    } else {
      audioBtn.classList.add('active');
      audioText.textContent = 'Reproduciendo…';

      notificationService.speakDevotional(devotional, () => {
        audioBtn.classList.remove('active');
        audioText.textContent = 'Escuchar devocional';
      });
    }
  });

  // Share Devotional Handler
  const shareBtn = container.querySelector('#btn-share-devotional');
  shareBtn?.addEventListener('click', async () => {
    const textToShare = [
      devotional.title,
      `“${devotional.verse}” (${devotional.passage})`,
      devotional.reflection,
      devotional.declaration ? `Declaro hoy: ${devotional.declaration}` : null,
      devotional.prayerPrompt ? `Para escribir: ${devotional.prayerPrompt}` : null,
      devotional.prayer ? `Oración: “${devotional.prayer}”` : null,
      '“Nunca estás demasiado ocupado para no orar.”'
    ].filter(Boolean).join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Devocional RAP — ${devotional.title}`,
          text: textToShare,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('Devocional copiado al portapapeles para compartir.');
    }
  });
}
