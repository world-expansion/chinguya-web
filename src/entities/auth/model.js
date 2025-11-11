// src/entities/auth/model.js
import { tokenStore, LS } from "../../shared/lib/storage";
import { authApi } from "./api";

export const authService = {
  async register({ email, password, nickname }) {
    // 서버가 {status, message, data:{user_id,email,nickname}} 반환
    const res = await authApi.register({ email, password, nickname });
    return res;
  },
  async login({ email, password }) {
    // 서버가 {access_token, token_type} 반환
    const res = await authApi.login({ email, password });
    tokenStore.set(res.access_token);
    // 로그인 후 me로 사용자 정보 채우기
    const me = await authApi.me().catch(() => null);
    return { token: res.access_token, user: me || { email } };
  },
  async me() {
    return authApi.me();
  },
  logout() {
    tokenStore.clear();
  },
};
