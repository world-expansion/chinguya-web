import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { diaryService } from "../entities/diary/model";

export const DiaryListPage = () => {
  const [days, setDays] = useState(7);
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setPending(true);
      setErr("");
      try {
        const { diaries } = await diaryService.fetchWeekly(days);
        if (alive) setItems(diaries);
      } catch {
        if (alive) setErr("일기 목록을 불러오지 못했습니다.");
      } finally {
        if (alive) setPending(false);
      }
    })();
    return () => (alive = false);
  }, [days]);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b">
        <h1 className="text-lg font-medium">감정일기</h1>
      </header>

      <main className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">최근 일수</label>
          <input
            type="number"
            min={1}
            max={30}
            className="w-20 border rounded p-2"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </div>

        {pending && <p className="text-sm">로딩…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
        {!pending && !err && items.length === 0 && (
          <p className="text-sm">
            최근 {days}일 내 일기가 없습니다. 챗봇에서 생성해보세요.
          </p>
        )}

        <ul className="space-y-3">
          {items.map((d) => {
            const date = d.createdAt?.slice(0, 10); // YYYY-MM-DD
            const preview =
              (d.content || "").length > 80
                ? d.content.slice(0, 80) + "…"
                : d.content || "(내용 없음)";
            return (
              <li key={d.id}>
                <Link
                  to={`/diary/date/${date}`}
                  className="block border rounded p-3"
                >
                  <div className="text-sm">{date}</div>
                  <div className="mt-1 text-sm text-gray-700 line-clamp-2">
                    {preview}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};
