// src/entities/auth/model.js
import { tokenStore, LS } from "../../shared/lib/storage";
import { authApi } from "./api";

// 원본을 도메인 모델로 정규화
function normalizeUser(raw) {
  if (!raw) return null;

  // 케이스 A: 서버 응답 { status, data: { user_id, email, nickname } }
  if (raw.data?.user_id) {
    const { user_id, email, nickname } = raw.data;
    return { id: user_id, email, nickname };
  }

  // 케이스 B: 이미 정규화된 형태 { id, email, nickname }
  if (raw.id) return raw;

  // 케이스 C: 과거 형태 { user: {...} }
  if (raw.user) return normalizeUser(raw.user);

  return null;
}

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
    const meRaw = await authApi.me().catch(() => null);
    const user = normalizeUser(meRaw) ?? { id: undefined, email };
    return { token: res.access_token, user };
  },
  async me() {
    const meRaw = await authApi.me();
    return normalizeUser(meRaw);
  },
  logout() {
    tokenStore.clear();
  },
};
