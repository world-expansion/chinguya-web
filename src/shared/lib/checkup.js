// src/shared/lib/checkup.js
import { LS } from "./storage";

const key = (userId) => `phq9:lastCheckedAt:${userId}`;

export const checkupStore = {
  setCheckedNow(userId) {
    LS.set(key(userId), new Date().toISOString());
  },

  needsCheckup(userId, cycleDays = 14) {
    const iso = LS.get(key(userId), null);
    if (!iso) return true;
    const last = new Date(iso).getTime();
    const diffDays = (Date.now() - last) / 86400000;
    return diffDays >= cycleDays;
  },
};
