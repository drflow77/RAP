// DevotionalCard Component — "R" (Relación con Dios)
import { notificationService } from '../services/notificationService.js';
import { icons } from './icons.js';
import { esc } from './escape.js';

export function renderDevotionalCard(container, devotional, { onOpenPassage } = {}) {
  if (!devotional) {
    container.innerHTML = `
      <div class="rap-card text-center">
        <p class="section-subtitle">Cargando devocional del día…</p>
      </div>
    `;
    return;
  }

  // Textos del botón de audio según el estado de la lectura
  const AUDIO = {
    idle: { icon: icons.speaker, label: 'Escuchar devocional' },
    playing: { icon: icons.pause, label: 'Pausar' },
    paused: { icon: icons.play, label: 'Continuar' }
  };
  const audioState = notificationService.playbackState(devotional);

  container.innerHTML = `
    <div class="devotional-card">
      <div class="devotional-head">
        <div class="devotional-theme">${esc(devotional.theme)}</div>
        <h2 class="devotional-title">${esc(devotional.title)}</h2>
        <div class="audio-controls">
          <button id="btn-audio-listen" class="audio-btn ${audioState === 'playing' ? 'active' : ''}">
            <span class="audio-icon">${AUDIO[audioState].icon}</span>
            <span id="audio-text">${AUDIO[audioState].label}</span>
          </button>
          <button id="btn-audio-stop" class="audio-stop" ${audioState === 'idle' ? 'hidden' : ''} title="Detener y volver al inicio">
            ${icons.stop}<span>Detener</span>
          </button>
        </div>
        ${devotional.pending ? '<span class="pending-tag">Devocional en espera</span>' : ''}
      </div>

      <div class="devotional-body">
        <blockquote class="verse-box">
          <p class="verse-text">“${esc(devotional.verse)}”</p>
          <span class="verse-passage">${esc(devotional.passage)}</span>
          ${onOpenPassage ? `
          <button class="verse-open-bible" id="btn-open-passage">
            ${icons.bible}<span>Leer el capítulo completo</span>
          </button>` : ''}
        </blockquote>

        ${devotional.pending ? `
        <div class="pending-box">
          <p class="pending-text">
            La enseñanza completa de ${esc(devotional.monthName)} se publicará al inicio del mes.
            Mientras tanto puedes meditar en el pasaje de hoy y orar con él.
          </p>
        </div>` : ''}

        ${devotional.reflection ? `
        <div class="reflection-box">
          <span class="section-label">Reflexión</span>
          <p class="reflection-body">${esc(devotional.reflection)}</p>
        </div>` : ''}

        ${devotional.declaration ? `
        <div class="declaration-box">
          <span class="section-label">${icons.star} Declaro hoy</span>
          <p class="declaration-text">${esc(devotional.declaration)}</p>
        </div>` : ''}

        ${devotional.prayerPrompt ? `
        <div class="write-box">
          <span class="section-label">${icons.pen} Para escribir</span>
          <p class="write-text">${esc(devotional.prayerPrompt)}</p>
        </div>` : ''}

        ${devotional.prayer ? `
        <div class="prayer-box">
          <span class="section-label">Oración</span>
          <p class="prayer-text">“${esc(devotional.prayer)}”</p>
        </div>` : ''}

        ${devotional.closingDeclaration ? `
        <div class="closing-box">
          <span class="section-label">${icons.star} Declaración final</span>
          <p class="closing-text">“${esc(devotional.closingDeclaration)}”</p>
          ${devotional.closingPassage ? `<span class="closing-passage">${esc(devotional.closingPassage)}</span>` : ''}
        </div>` : ''}

        <div class="card-footer-actions">
          <button id="btn-share-devotional" class="action-pill-btn">
            ${icons.share}
            <span>Compartir devocional</span>
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-open-passage')?.addEventListener('click', () => {
    notificationService.stopSpeaking();
    onOpenPassage(devotional.passage);
  });

  // Audio: escuchar → pausar → continuar donde se quedó; ■ detiene
  const audioBtn = container.querySelector('#btn-audio-listen');
  const stopBtn = container.querySelector('#btn-audio-stop');

  // Se buscan los botones cada vez: si la tarjeta se volvió a pintar
  // mientras leía, al terminar se actualiza la tarjeta nueva.
  const paintAudio = () => {
    const audioBtn = container.querySelector('#btn-audio-listen');
    const stopBtn = container.querySelector('#btn-audio-stop');
    if (!audioBtn || !stopBtn) return;
    const state = notificationService.playbackState(devotional);
    audioBtn.classList.toggle('active', state === 'playing');
    audioBtn.querySelector('.audio-icon').innerHTML = AUDIO[state].icon;
    audioBtn.querySelector('#audio-text').textContent = AUDIO[state].label;
    stopBtn.hidden = state === 'idle';
  };

  audioBtn?.addEventListener('click', () => {
    const state = notificationService.playbackState(devotional);
    if (state === 'playing') notificationService.pauseSpeaking();
    else if (state === 'paused') notificationService.resumeSpeaking(paintAudio);
    else notificationService.speakDevotional(devotional, paintAudio);
    paintAudio();
  });

  stopBtn?.addEventListener('click', () => {
    notificationService.stopSpeaking();
    paintAudio();
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
      devotional.closingDeclaration ? `Declaración final: “${devotional.closingDeclaration}” (${devotional.closingPassage})` : null,
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
