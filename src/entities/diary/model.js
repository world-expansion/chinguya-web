// src/entities/diary/model.js
import { apiFetchWeeklyDiaries, apiFetchDiaryByDate } from "./api";

/** 앱 공통 Diary 모델로 정규화 */
function toDiary(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.diary_id ?? raw.created_at ?? String(Date.now()),
    content: raw.content ?? "",
    metadata: raw.metadata ?? {},
    createdAt: raw.created_at ?? null, // ISO or null
  };
}

/** 서버 리스트 응답 → 정규화 */
function toWeekly(result) {
  const d = result?.data ?? {};
  return {
    days: Number(d.days ?? 0),
    count: Number(d.count ?? (Array.isArray(d.diaries) ? d.diaries.length : 0)),
    diaries: Array.isArray(d.diaries) ? d.diaries.map(toDiary) : [],
    raw: result,
  };
}

export const diaryService = {
  /** 최근 N일(1~30, 기본 7) */
  async fetchWeekly(days = 7) {
    const n = Math.max(1, Math.min(30, Number(days) || 7));
    const res = await apiFetchWeeklyDiaries(n);
    return toWeekly(res);
  },

  /** 특정 날짜(YYYY-MM-DD) */
  async fetchByDate(date) {
    if (!date) throw new Error("date가 필요합니다(YYYY-MM-DD).");
    const res = await apiFetchDiaryByDate(date);
    const item = toDiary(res?.data);
    return { diary: item, raw: res };
  },
};
