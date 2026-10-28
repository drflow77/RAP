// Notification & Text-to-Speech Audio Service
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { isNative } from '../platform.js';

// Android no lee más de 4000 caracteres por llamada: el texto se parte por
// oraciones y se lee en trozos seguidos. `nativeRun` invalida la lectura en
// curso cuando se detiene o se empieza otra.
const NATIVE_CHUNK = 3500;
let nativeRun = 0;
let nativeSpeaking = false;

function splitForSpeech(text) {
  const sentences = text.match(/[^.!?¿¡]+[.!?]*\s*/g) || [text];
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if (current && (current + s).length > NATIVE_CHUNK) {
      chunks.push(current);
      current = '';
    }
    current += s;
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}

async function speakNative(text, onEnd) {
  const run = ++nativeRun;
  nativeSpeaking = true;
  try {
    const lang = (await TextToSpeech.isLanguageSupported({ lang: 'es-MX' })).supported ? 'es-MX' : 'es-ES';
    for (const chunk of splitForSpeech(text)) {
      if (run !== nativeRun) return;
      await TextToSpeech.speak({ text: chunk, lang, rate: 0.95, pitch: 1.0 });
    }
  } catch (e) {
    console.warn('Error en la lectura de audio:', e);
    if (run === nativeRun) {
      alert('No se pudo leer el devocional. Revisa que tu teléfono tenga una voz en español en Ajustes > Texto a voz.');
    }
  } finally {
    if (run === nativeRun) {
      nativeSpeaking = false;
      onEnd?.();
    }
  }
}

export const notificationService = {
  isSupported() {
    return 'Notification' in window;
  },

  async requestPermission() {
    if (!this.isSupported()) return false;
    try {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  },

  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  sendNotification(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;
    try {
      const defaultOptions = {
        icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
        badge: `${import.meta.env.BASE_URL}icons/icon-192.png`,
        tag: 'rap-daily-reminder',
        renotify: true,
        body: options.body || 'Nunca estás demasiado ocupado para orar 🙏 Tómate 2 minutos hoy.',
        ...options
      };

      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, defaultOptions);
        });
      } else {
        new Notification(title, defaultOptions);
      }
    } catch (e) {
      console.error('Failed to trigger notification:', e);
    }
  },

  // Speech Synthesis for Audio Devotional Reading.
  // En Android (Capacitor) el WebView no trae speechSynthesis, así que se usa
  // el motor de voz del teléfono con el plugin nativo.
  speakDevotional(devotional, onEnd = null) {
    if (!isNative && !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura de audio.');
      return false;
    }

    this.stopSpeaking(); // Stop any ongoing speech

    // Los días en espera solo tienen título, pasaje y versículo: se leen esos.
    const textToRead = [
      `${devotional.title}.`,
      `Pasaje bíblico: ${devotional.passage}.`,
      `${devotional.verse}.`,
      devotional.reflection ? `Reflexión: ${devotional.reflection}` : null,
      devotional.declaration ? `Declaración de fe: ${devotional.declaration}` : null,
      devotional.prayerPrompt ? `Para escribir: ${devotional.prayerPrompt}` : null,
      devotional.prayer ? `Oración: ${devotional.prayer}` : null,
      devotional.closingDeclaration ? `Declaración final: ${devotional.closingDeclaration}` : null
    ].filter(Boolean).join(' ');

    if (isNative) {
      speakNative(textToRead, onEnd);
      return true;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Voz elegida en Ajustes; si no hay, la primera voz en español disponible
    const voices = window.speechSynthesis.getVoices();
    let preferredURI = null;
    try {
      preferredURI = JSON.parse(localStorage.getItem('rap_settings_v1') || '{}').voiceURI || null;
    } catch (e) {
      preferredURI = null;
    }

    const chosen = (preferredURI && voices.find((v) => v.voiceURI === preferredURI))
      || voices.find((v) => v.lang.startsWith('es'));
    if (chosen) {
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  },

  stopSpeaking() {
    if (isNative) {
      nativeRun++;
      nativeSpeaking = false;
      TextToSpeech.stop().catch(() => {});
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking() {
    if (isNative) return nativeSpeaking;
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
};
