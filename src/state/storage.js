// RAP App State & Local Storage Management
const STORAGE_KEYS = {
  DAILY_ENTRIES: 'rap_daily_entries_v1',
  ANSWERED_PRAYERS: 'rap_answered_prayers_v1',
  FREQUENT_PEOPLE: 'rap_frequent_people_v1',
  SETTINGS: 'rap_settings_v1',
  STREAK_INFO: 'rap_streak_info_v1',
  PERSONAL_PETITIONS: 'rap_personal_petitions_v1'
};

const DEFAULT_SETTINGS = {
  theme: 'bosque', // 'bosque' | 'azul' | 'marfil' | 'lavanda' | 'rosa'
  reminderEnabled: false,
  reminderTime: '07:00',
  userName: '',
  audioVoiceRate: 1.0
};

const DEFAULT_FREQUENT_PEOPLE = [
  { id: '1', name: 'Mi Familia', reason: 'Salud, paz y unidad' },
  { id: '2', name: 'Mis Amigos', reason: 'Propósito y bendición' },
  { id: '3', name: 'Mi Pastor / Líder', reason: 'Sabiduría y cobertura' }
];

export const storage = {
  // --- Daily RAP Entries ---
  // Keyed by YYYY-MM-DD
  getDailyEntry(dateStr) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_ENTRIES) || '{}');
      return all[dateStr] || {
        date: dateStr,
        completed: false,
        completedAt: null,
        people: [
          { name: '', reason: '', prayed: false },
          { name: '', reason: '', prayed: false },
          { name: '', reason: '', prayed: false }
        ],
        personalPrayer: '',
        tags: []
      };
    } catch (e) {
      console.error('Error reading daily entry:', e);
      return null;
    }
  },

  saveDailyEntry(dateStr, entryData) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_ENTRIES) || '{}');
      all[dateStr] = { ...entryData, date: dateStr };
      localStorage.setItem(STORAGE_KEYS.DAILY_ENTRIES, JSON.stringify(all));
      this.updateStreak();
      return true;
    } catch (e) {
      console.error('Error saving daily entry:', e);
      return false;
    }
  },

  getAllDailyEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_ENTRIES) || '{}');
    } catch (e) {
      return {};
    }
  },

  // --- Streak Calculation ---
  getStreakInfo() {
    try {
      const info = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK_INFO) || '{}');
      return {
        currentStreak: info.currentStreak || 0,
        maxStreak: info.maxStreak || 0,
        lastCompletedDate: info.lastCompletedDate || null,
        totalPrayedDays: info.totalPrayedDays || 0
      };
    } catch (e) {
      return { currentStreak: 0, maxStreak: 0, lastCompletedDate: null, totalPrayedDays: 0 };
    }
  },

  updateStreak() {
    const all = this.getAllDailyEntries();
    const completedDates = Object.keys(all)
      .filter((d) => all[d].completed)
      .sort();

    const totalPrayedDays = completedDates.length;
    if (totalPrayedDays === 0) {
      const blank = { currentStreak: 0, maxStreak: 0, lastCompletedDate: null, totalPrayedDays: 0 };
      localStorage.setItem(STORAGE_KEYS.STREAK_INFO, JSON.stringify(blank));
      return blank;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Calculate current streak backwards from today/yesterday
    let currentStreak = 0;
    let checkDate = new Date();
    let checkStr = checkDate.toISOString().split('T')[0];

    // If not prayed today, start checking from yesterday to not break streak yet
    if (!all[checkStr]?.completed) {
      checkDate = new Date(Date.now() - 86400000);
      checkStr = checkDate.toISOString().split('T')[0];
    }

    while (all[checkStr]?.completed) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkStr = checkDate.toISOString().split('T')[0];
    }

    const oldInfo = this.getStreakInfo();
    const maxStreak = Math.max(oldInfo.maxStreak, currentStreak);
    const lastCompletedDate = completedDates[completedDates.length - 1];

    const updated = { currentStreak, maxStreak, lastCompletedDate, totalPrayedDays };
    localStorage.setItem(STORAGE_KEYS.STREAK_INFO, JSON.stringify(updated));
    return updated;
  },

  // --- Answered Prayers / Testimonies Wall ---
  getAnsweredPrayers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERED_PRAYERS) || '[]');
    } catch (e) {
      return [];
    }
  },

  addAnsweredPrayer(prayer) {
    try {
      const list = this.getAnsweredPrayers();
      const newEntry = {
        id: Date.now().toString(),
        title: prayer.title || 'Oración Contestada',
        request: prayer.request,
        testimony: prayer.testimony || '',
        prayedDate: prayer.prayedDate || new Date().toISOString().split('T')[0],
        answeredDate: new Date().toISOString().split('T')[0],
        category: prayer.category || 'General'
      };
      list.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.ANSWERED_PRAYERS, JSON.stringify(list));
      return newEntry;
    } catch (e) {
      console.error('Error adding answered prayer:', e);
      return null;
    }
  },

  deleteAnsweredPrayer(id) {
    try {
      const list = this.getAnsweredPrayers().filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.ANSWERED_PRAYERS, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- Frequent Contacts / People ---
  getFrequentPeople() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FREQUENT_PEOPLE);
      return raw ? JSON.parse(raw) : DEFAULT_FREQUENT_PEOPLE;
    } catch (e) {
      return DEFAULT_FREQUENT_PEOPLE;
    }
  },

  saveFrequentPeople(peopleList) {
    try {
      localStorage.setItem(STORAGE_KEYS.FREQUENT_PEOPLE, JSON.stringify(peopleList));
      return true;
    } catch (e) {
      return false;
    }
  },

  addFrequentPerson(name, reason = '') {
    const list = this.getFrequentPeople();
    if (!list.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      list.push({ id: Date.now().toString(), name, reason });
      this.saveFrequentPeople(list);
    }
  },

  // --- Settings ---
  getSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      const merged = { ...this.getSettings(), ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    } catch (e) {
      return null;
    }
  },

  // --- Export & Import Backup ---
  exportBackup() {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      dailyEntries: this.getAllDailyEntries(),
      answeredPrayers: this.getAnsweredPrayers(),
      frequentPeople: this.getFrequentPeople(),
      streakInfo: this.getStreakInfo(),
      settings: this.getSettings()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.dailyEntries) localStorage.setItem(STORAGE_KEYS.DAILY_ENTRIES, JSON.stringify(data.dailyEntries));
      if (data.answeredPrayers) localStorage.setItem(STORAGE_KEYS.ANSWERED_PRAYERS, JSON.stringify(data.answeredPrayers));
      if (data.frequentPeople) localStorage.setItem(STORAGE_KEYS.FREQUENT_PEOPLE, JSON.stringify(data.frequentPeople));
      if (data.streakInfo) localStorage.setItem(STORAGE_KEYS.STREAK_INFO, JSON.stringify(data.streakInfo));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }
};
