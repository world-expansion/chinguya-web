// src/shared/lib/storage.js
export const LS = {
  get(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

export const tokenStore = {
  get() {
    return LS.get("accessToken", null);
  },
  set(t) {
    LS.set("accessToken", t);
  },
  clear() {
    LS.remove("accessToken");
  },
};
