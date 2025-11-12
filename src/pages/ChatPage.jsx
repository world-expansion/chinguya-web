// src/pages/ChatPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LS } from "../shared/lib/storage";
import { chatService } from "../entities/chat/model";

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

  // 대화 로그 로컬 보관
  useEffect(() => {
    LS.set("chatMessages", messages);
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

  // 세션 종료 → 서버가 일기를 생성함 → 오늘 날짜 상세로 이동
  const makeDiary = async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    try {
      await chatService.end(sessionId);

      // 서버가 오늘 일기를 생성하므로 YYYY-MM-DD로 라우팅
      const today = new Date().toISOString().slice(0, 10);
      nav(`/diary/date/${today}`, { replace: true });

      // 새 대화를 위해 세션 재생성
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
