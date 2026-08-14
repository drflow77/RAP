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
      </div>

      <div class="devotional-body">
        <blockquote class="verse-box">
          <p class="verse-text">“${esc(devotional.verse)}”</p>
          <span class="verse-passage">${esc(devotional.passage)}</span>
        </blockquote>

        <p class="reflection-body">${esc(devotional.reflection)}</p>

        <div class="declaration-box">
          <span class="declaration-icon">${icons.star}</span>
          <p class="declaration-text"><strong>Declaro hoy:</strong> ${esc(devotional.declaration)}</p>
        </div>

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
    const textToShare = `${devotional.title}\n\n“${devotional.verse}” (${devotional.passage})\n\n${devotional.reflection}\n\nDeclaro hoy: ${devotional.declaration}\n\n“Nunca estás demasiado ocupado para no orar.”`;

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
