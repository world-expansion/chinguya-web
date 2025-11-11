// src/entities/diary/model.js
import { LS } from "../../shared/lib/storage";

// 로컬 캐시 키
const KEY = "diary_cache_v1";

// 헬퍼: 로드/세이브
const load = () => LS.get(KEY, []);
const save = (arr) => LS.set(KEY, arr);

// 헬퍼: 메시지 → 요약 텍스트
function summarizeFromMessages(messages) {
  const userTexts = (messages || [])
    .filter((m) => m.role === "user")
    .map((m) => String(m.text || "").trim())
    .filter(Boolean);

  const last = userTexts[userTexts.length - 1] || "오늘을 돌아봤다";
  const summary = last.length > 60 ? last.slice(0, 60) + "…" : last;
  return { last, summary };
}

// 헬퍼: 일기 엔티티 정규화
function normalizeDiary(partial) {
  const now = new Date();
  return {
    id: partial?.id ?? Date.now(), // 간단 ID
    dateISO: partial?.dateISO ?? now.toISOString(),
    title:
      partial?.title ??
      `AI가 정리한 ${new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
      }).format(now)} 일기`,
    content: partial?.content ?? "",
    reframed: partial?.reframed ?? "",
    summary: partial?.summary ?? "",
  };
}

// 메시지로 일기 초안 생성 (추가 저장은 호출부에서)
function draftFromMessages(messages) {
  const now = new Date();
  const { last, summary } = summarizeFromMessages(messages);
  return normalizeDiary({
    title: `AI가 정리한 ${new Intl.DateTimeFormat("ko-KR", {
      month: "numeric",
      day: "numeric",
    }).format(now)} 일기`,
    content: `오늘 나는 ${last}라는 생각과 함께 하루를 보냈다. 불안이 커지며 몸이 무겁게 느껴졌고, 잠시 멈춰 있었다.`,
    reframed:
      "지금의 어려움은 과정을 지나고 있다는 신호일 수 있다. 작은 시도부터 다시 시작해보자.",
    summary,
  });
}

export const diaryStore = {
  /** 전체 조회 (최신순) */
  all() {
    const arr = load();
    // dateISO 기준 역정렬
    return [...arr].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  },

  /** 단건 조회 */
  byId(id) {
    const arr = load();
    return arr.find((d) => String(d.id) === String(id)) || null;
  },

  /** 생성/업서트 */
  add(diaryLike) {
    const arr = load();
    const entity = normalizeDiary(diaryLike);
    const idx = arr.findIndex((d) => String(d.id) === String(entity.id));
    if (idx >= 0) arr[idx] = entity;
    else arr.unshift(entity);
    save(arr);
    return entity;
  },

  /** 일괄 교체(필요 시) */
  setAll(list) {
    const normalized = (list || []).map(normalizeDiary);
    save(normalized);
    return normalized;
  },

  /** 메시지 → 일기 초안(저장은 하지 않음) */
  get(messages) {
    return draftFromMessages(messages);
  },

  /** 삭제(선택 기능) */
  remove(id) {
    const arr = load().filter((d) => String(d.id) !== String(id));
    save(arr);
  },
};
