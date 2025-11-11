// src/pages/DiaryDetailPage.jsx
import { useEffect, useState } from "react";
import { diaryStore } from "../entities/diary/model";
import { Link, useParams } from "react-router-dom";

export const DiaryDetailPage = (props) => {
  const params = useParams();
  const id = props.id ?? params.id;
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    setDiary(diaryStore.byId(id) || null);
  }, [id]);

  if (!diary)
    return (
      <div className="min-h-screen flex flex-col pb-16">
        <header className="p-4 border-b">
          <Link to="/diary" className="text-sm">
            ← 목록
          </Link>
        </header>
        <main className="p-4">
          <p className="text-sm">일기를 찾을 수 없습니다.</p>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b flex items-center gap-2">
        <Link to="/diary" className="text-sm">
          ← 목록
        </Link>
        <h1 className="text-lg font-medium">
          {new Date(diary.dateISO).toLocaleDateString()}
        </h1>
      </header>
      <main className="p-4 space-y-4">
        <section className="border rounded p-3">
          <h2 className="font-medium">{diary.title || "제목 없음"}</h2>
          <p className="mt-2 whitespace-pre-wrap">{diary.content}</p>
        </section>
        {diary.reframed && (
          <section className="border rounded p-3">
            <h3 className="font-medium">다른 관점</h3>
            <p className="mt-2 whitespace-pre-wrap">{diary.reframed}</p>
          </section>
        )}
      </main>
    </div>
  );
};
