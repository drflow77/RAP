// Devotional Data Service for 365 Days
let devotionalsCache = null;

export const devotionalService = {
  async loadAllDevotionals() {
    if (devotionalsCache) return devotionalsCache;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/devotionals.json`);
      if (!response.ok) throw new Error('Failed to load devotionals');
      devotionalsCache = await response.json();
      return devotionalsCache;
    } catch (e) {
      console.error('Error loading devotionals:', e);
      return [];
    }
  },

  async getByDate(dateObj) {
    const list = await this.loadAllDevotionals();
    const month = dateObj.getMonth() + 1; // 1-12
    const day = dateObj.getDate(); // 1-31

    const match = list.find((d) => d.month === month && d.day === day);
    return match || list[0] || null;
  },

  async getById(id) {
    const list = await this.loadAllDevotionals();
    return list.find((d) => d.id === parseInt(id)) || null;
  },

  async getByMonth(monthNum) {
    const list = await this.loadAllDevotionals();
    return list.filter((d) => d.month === parseInt(monthNum));
  },

  async searchDevotionals(query) {
    const list = await this.loadAllDevotionals();
    const q = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter((d) => 
      d.title.toLowerCase().includes(q) ||
      d.passage.toLowerCase().includes(q) ||
      d.verse.toLowerCase().includes(q) ||
      d.theme.toLowerCase().includes(q)
    );
  }
};
