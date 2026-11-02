// Notification & Text-to-Speech Audio Service
import { registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNative } from '../platform.js';

// Plugin propio de la app Android (RapVoicePlugin.java): lee con la voz del
// teléfono como audio multimedia, para que salga por el altavoz o el Bluetooth
// del auto y no como llamada.
const RapVoice = registerPlugin('RapVoice');

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
    await RapVoice.speak({ texts: splitForSpeech(text), rate: 0.95, pitch: 1.0 });
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

// Las citas bíblicas se dicen completas: «Lucas 5:21» se leía «5:21 horas».
// «Lucas 5:21-25» → «Lucas capítulo 5, versículos 21 al 25».
function speakableReferences(text) {
  return text.replace(
    /(?<!\d)(\d+):(\d+(?:\s*[-–,]\s*\d+)*)(?!\d)(?!\s*(?:a\.?\s?m|p\.?\s?m|hrs|horas)\b)/gi,
    (_, chapter, verses) => {
      const parts = verses.split(/\s*([-–,])\s*/);
      let spoken = parts[0];
      for (let i = 1; i < parts.length; i += 2) {
        spoken += (parts[i] === ',' ? ' y ' : ' al ') + parts[i + 1];
      }
      return `capítulo ${chapter}, ${parts.length > 1 ? 'versículos' : 'versículo'} ${spoken}`;
    }
  );
}

// Calidad de una voz del navegador, para elegir la más natural sin que haya
// que tocar Ajustes. En iPhone las voces «Mejorada»/«Premium» se descargan en
// Ajustes > Accesibilidad > Contenido leído. Las voces de broma de Apple
// (Grandma, Rocko…) también dicen ser español y se descartan.
const NOVELTY_VOICES = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Eddy|Flo|Good News|Grandma|Grandpa|Jester|Junior|Organ|Ralph|Reed|Rocko|Sandy|Shelley|Superstar|Trinoids|Whisper|Wobble|Zarvox)\b/i;
const REGION_SCORE = { 'es-MX': 5, 'es-US': 4, 'es-419': 3, 'es-ES': 1 };

function voiceScore(v) {
  let score = REGION_SCORE[v.lang.replace('_', '-')] || 0;
  if (/premium/i.test(v.name)) score += 30;
  else if (/mejorad|enhanced|natural|neural/i.test(v.name)) score += 20;
  else if (/google|online/i.test(v.name)) score += 10;
  return score;
}

// Voces en español del navegador, de la más natural a la menos
export function getSpanishVoices() {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('es') && !NOVELTY_VOICES.test(v.name))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
}

// Voz elegida en Ajustes; si no hay (o ya no está), la más natural
function applyVoice(utterance, voiceURI) {
  let preferredURI = voiceURI;
  if (preferredURI === undefined) {
    try {
      preferredURI = JSON.parse(localStorage.getItem('rap_settings_v1') || '{}').voiceURI || null;
    } catch (e) {
      preferredURI = null;
    }
  }
  const voices = getSpanishVoices();
  const chosen = (preferredURI && voices.find((v) => v.voiceURI === preferredURI)) || voices[0];
  utterance.lang = chosen ? chosen.lang : 'es-MX';
  if (chosen) utterance.voice = chosen;
}

const REMINDER_ID = 1;
const REMINDER_TITLE = 'Tiempo de oración RAP';
const REMINDER_BODY = 'Nunca estás demasiado ocupado para no orar. Tómate 2 minutos para tu devocional y tus 3 personas.';

export const notificationService = {
  isSupported() {
    return isNative || 'Notification' in window;
  },

  async requestPermission() {
    if (isNative) {
      try {
        const { display } = await LocalNotifications.requestPermissions();
        return display === 'granted';
      } catch (e) {
        console.warn('Error requesting notification permission:', e);
        return false;
      }
    }
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

  // Recordatorio diario. En Android lo programa el sistema y llega aunque la
  // app esté cerrada; en el navegador solo puede avisar con la app abierta
  // (lo revisa initDailyReminderChecker en main.js).
  async scheduleDailyReminder(time, { askPermission = false } = {}) {
    if (!isNative || !time) return false;
    try {
      let { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted' && askPermission) {
        ({ display } = await LocalNotifications.requestPermissions());
      }
      if (display !== 'granted') return false;

      const [hour, minute] = time.split(':').map(Number);
      await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
      await LocalNotifications.schedule({
        notifications: [{
          id: REMINDER_ID,
          title: REMINDER_TITLE,
          body: REMINDER_BODY,
          schedule: { on: { hour, minute }, allowWhileIdle: true },
          // Una alarma exacta obliga a pedir otro permiso (Alarmas y
          // recordatorios) y, sin él, el aviso no se programaba. Basta con que
          // llegue alrededor de la hora elegida.
          isExactNotification: false
        }]
      });
      return true;
    } catch (e) {
      console.warn('No se pudo programar el recordatorio:', e);
      return false;
    }
  },

  sendNotification(title, options = {}) {
    if (isNative) {
      LocalNotifications.schedule({
        notifications: [{ id: 2, title, body: options.body || REMINDER_BODY }]
      }).catch((e) => console.warn('Failed to trigger notification:', e));
      return;
    }
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
    const speakable = speakableReferences(textToRead);

    if (isNative) {
      speakNative(speakable, onEnd);
      return true;
    }

    const utterance = new SpeechSynthesisUtterance(speakable);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    applyVoice(utterance);

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  },

  // Muestra breve al elegir una voz en Ajustes (solo navegador)
  previewVoice(voiceURI) {
    if (isNative || !('speechSynthesis' in window)) return;
    this.stopSpeaking();
    const utterance = new SpeechSynthesisUtterance('Sobre toda cosa guardada guarda tu corazón; porque de él mana la vida. Proverbios capítulo 4, versículo 23.');
    utterance.rate = 0.95;
    applyVoice(utterance, voiceURI || null);
    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if (isNative) {
      nativeRun++;
      nativeSpeaking = false;
      RapVoice.stop().catch(() => {});
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking() {
    if (isNative) return nativeSpeaking;
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
};
