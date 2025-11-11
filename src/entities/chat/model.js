// src/entities/chat/model.js
import { apiCreateSession, apiSendMessage, apiEndSession } from "./api";

/**
 * 서버 세션만 사용 (로컬 저장 안 함)
 * - createSession() → session_id
 * - send(session_id, message) → { answer, referencedDiaries }
 * - end(session_id) → { diary }
 */
export const chatService = {
  async createSession() {
    const res = await apiCreateSession();
    const data = res?.data;
    if (!data?.session_id) throw new Error("세션 생성 실패: session_id 없음");
    return data.session_id;
  },

  async send(session_id, message) {
    if (!session_id) throw new Error("세션 ID가 필요합니다.");
    const res = await apiSendMessage({ session_id, message });
    const data = res?.data ?? {};
    return {
      session_id: data.session_id,
      answer: data.assistant_response,
      referencedDiaries: data.referenced_diaries ?? null,
      raw: res,
    };
  },

  async end(session_id) {
    if (!session_id) throw new Error("세션 ID가 필요합니다.");
    const res = await apiEndSession({ session_id });
    const d = res?.data ?? {};
    const diary = {
      id: d.diary_id ?? String(Date.now()),
      content: d.diary_content ?? "",
      reframed: d.alternative_perspective ?? "",
      messageCount: Number(d.message_count ?? 0),
    };
    return { diary, raw: res };
  },
};
