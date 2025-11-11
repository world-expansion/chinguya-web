// src/pages/ChatPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LS } from "../shared/lib/storage";
import { chatService } from "../entities/chat/model";
import { diaryStore } from "../entities/diary/model";

export const ChatPage = () => {
  const [messages, setMessages] = useState(() =>
    LS.get("chatMessages", [
      {
        role: "system",
        text: "안녕하세요. 마음이 조금 힘들 땐, 함께 이야기 나누면 도움이 될 거예요. 오늘 어떤 일들이 있었나요? 편하게 들려주세요.",
      },
    ])
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const nav = useNavigate();

  // 자동 스크롤 앵커
  const bottomRef = useRef(null);
  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  // 대화 로그 로컬 보관 + 새 메시지마다 스크롤
  useEffect(() => {
    LS.set("chatMessages", messages);
    scrollToBottom(messages.length <= 2 ? false : true);
  }, [messages]);

  // 최초 진입 시 세션 생성
  useEffect(() => {
    (async () => {
      try {
        const sid = await chatService.createSession();
        setSessionId(sid);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "세션 생성에 실패했습니다. 다시 시도해 주세요.",
          },
        ]);
      }
    })();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // 세션 없으면 즉시 생성
      const sid = sessionId ?? (await chatService.createSession());
      if (!sessionId) setSessionId(sid);

      const { answer } = await chatService.send(sid, text);
      setMessages([
        ...next,
        { role: "bot", text: answer || "그럴 수 있어요. 말씀 감사합니다." },
      ]);
    } catch {
      setMessages([
        ...next,
        { role: "bot", text: "서버 응답에 문제가 있습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // /session/end → 서버 생성 일기를 로컬 캐시에 업서트 후 상세로 이동
  const makeDiary = async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    try {
      const { diary } = await chatService.end(sessionId);
      if (!diary) return;

      // 앱 스키마로 보강(제목/요약/날짜)
      const now = new Date();
      const dateISO = now.toISOString();
      const dateLabel = new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
      }).format(now);

      const normalized = {
        id: diary.id,
        dateISO,
        title: `AI가 정리한 ${dateLabel} 일기`,
        content: diary.content || "내용이 없습니다.",
        reframed: diary.reframed || "",
        summary:
          (diary.content || "").length > 60
            ? diary.content.slice(0, 60) + "…"
            : diary.content || "",
      };

      const saved = diaryStore.add(normalized);
      nav(`/diary/${saved.id}`);

      // 새 대화를 위해 세션 재생성(선택)
      const sid = await chatService.createSession();
      setSessionId(sid);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "일기 생성에 실패했습니다. 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b">
        <h1 className="text-lg font-medium">챗봇 대화</h1>
      </header>

      <main className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="flex gap-2">
          <button
            className="border rounded px-3 py-2"
            onClick={makeDiary}
            disabled={loading || !sessionId}
          >
            감정일기 생성
          </button>
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}
          >
            <div className="border rounded p-3 whitespace-pre-wrap">
              {m.text}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm">요청 처리 중…</p>}
        {/* 스크롤 앵커 */}
        <div ref={bottomRef} />
      </main>

      <div className="p-3 border-t fixed bottom-12 left-0 right-0 bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          />
          <button
            className="border rounded px-4"
            onClick={send}
            disabled={loading}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};
