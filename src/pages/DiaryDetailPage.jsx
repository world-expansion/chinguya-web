import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { diaryService } from "../entities/diary/model";

export const DiaryDetailPage = () => {
  const { date } = useParams(); // /diary/date/:date
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setPending(true);
      setErr("");
      try {
        const { diary: d } = await diaryService.fetchByDate(date);
        if (alive) setDiary(d);
      } catch {
        if (alive) setErr("일기를 불러오지 못했습니다.");
      } finally {
        if (alive) setPending(false);
      }
    })();
    return () => (alive = false);
  }, [date]);

  if (pending)
    return (
      <div className="min-h-screen flex flex-col pb-16">
        <header className="p-4 border-b">
          <Link to="/diary" className="text-sm">
            ← 목록
          </Link>
        </header>
        <main className="p-4">로딩…</main>
      </div>
    );

  if (err || !diary)
    return (
      <div className="min-h-screen flex flex-col pb-16">
        <header className="p-4 border-b">
          <Link to="/diary" className="text-sm">
            ← 목록
          </Link>
        </header>
        <main className="p-4">
          <p className="text-sm">{err || "해당 날짜의 일기가 없습니다."}</p>
        </main>
      </div>
    );

  const dateLabel =
    (diary.createdAt && new Date(diary.createdAt).toLocaleDateString()) || date;

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b flex items-center gap-2">
        <Link to="/diary" className="text-sm">
          ← 목록
        </Link>
        <h1 className="text-lg font-medium">{dateLabel}</h1>
      </header>

      <main className="p-4 space-y-4">
        <section className="border rounded p-3">
          <h2 className="font-medium">일기</h2>
          <p className="mt-2 whitespace-pre-wrap">
            {diary.content || "(내용 없음)"}
          </p>
        </section>
      </main>
    </div>
  );
};
