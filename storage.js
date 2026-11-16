// Local demo storage: failures must not interrupt rendering or imply a successful save.
window.GlovtaStorage = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw) ?? fallback;
    } catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  records(key, fields) {
    const value = this.read(key, []);
    return Array.isArray(value) ? value.filter(item => item && typeof item === 'object' && !Array.isArray(item) && fields.every(field => typeof item[field] === 'string' && item[field].trim())) : [];
  },
  passport() {
    const value = this.read('glovta-passport', null);
    return value && typeof value === 'object' && !Array.isArray(value) && typeof value.goal === 'string' && value.goal.trim() ? value : null;
  }
};
