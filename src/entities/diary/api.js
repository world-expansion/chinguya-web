import { get } from "../../shared/api/http";
import { CHAT_BASE } from "../../shared/config/env";
// 서버 경로가 /api/chat/diaries/... 이지만, 리소스는 diary이므로
// base는 재사용해도 됨.-

/** GET /api/chat/diaries/weekly?days=7 (1~30) */
export function apiFetchWeeklyDiaries(days = 7) {
  return get(`${CHAT_BASE}/diaries/weekly?days=${days}`);
}

/** GET /api/chat/diaries/date/{date}  (YYYY-MM-DD) */
export function apiFetchDiaryByDate(date /* '2025-11-12' */) {
  return get(`${CHAT_BASE}/diaries/date/${date}`);
}
