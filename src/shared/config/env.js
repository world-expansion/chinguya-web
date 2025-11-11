export const API_BASE = import.meta.env.VITE_API_BASE;

// 엔드포인트 베이스 (도메인 경계)
export const AUTH_BASE = `${API_BASE}/api/auth`;
export const CHATBOT_BASE = `${API_BASE}/api/chatbot`;
export const CHAT_BASE = `${API_BASE}/api/chat`;
export const DIARY_BASE = `${API_BASE}/api/diary`;
