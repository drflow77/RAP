// Plan de lectura bíblica. El JSON agrupa por mes ("AAAA-MM") y cada mes es
// una lista de días; cada día, una lista de lecturas. Los meses nuevos se
// añaden a public/data/reading-plan.json, igual que el devocional.
let planCache = null;

export const readingPlanService = {
  async load() {
    if (planCache) return planCache;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/reading-plan.json`);
      if (!response.ok) throw new Error('Failed to load reading plan');
      planCache = await response.json();
      return planCache;
    } catch (e) {
      console.error('Error loading reading plan:', e);
      return {};
    }
  },

  // Devuelve las lecturas del día, o null si ese mes aún no está cargado.
  async getByDate(dateObj) {
    const plan = await this.load();
    const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    return plan[key]?.[dateObj.getDate() - 1] || null;
  }
};
