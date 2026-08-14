// Notification & Text-to-Speech Audio Service
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

  // Speech Synthesis for Audio Devotional Reading
  speakDevotional(devotional, onEnd = null) {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura de audio.');
      return false;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const textToRead = `${devotional.title}. Pasaje bíblico: ${devotional.passage}. ${devotional.verse}. Reflexión: ${devotional.reflection}. Declaración de fe: ${devotional.declaration}`;
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking() {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
};
