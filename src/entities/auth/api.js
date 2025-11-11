// src/entities/auth/api.js
import { AUTH_BASE } from "../../shared/config/env";
import { get, post } from "../../shared/api/http";

export const authApi = {
  register(payload) {
    // {email, password, nickname}
    return post(`${AUTH_BASE}/register`, payload);
  },
  login(payload) {
    // {email, password}
    return post(`${AUTH_BASE}/login`, payload);
  },
  me() {
    return get(`${AUTH_BASE}/me`);
  },
};
