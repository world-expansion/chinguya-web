// src/pages/DiaryListPage.jsx
import { useEffect, useState } from "react";
import { diaryStore } from "../entities/diary/model";
import { Link } from "react-router-dom";

export const DiaryListPage = () => {
  const [items, setItems] = useState(diaryStore.all());
  useEffect(() => {
    setItems(diaryStore.all());
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b">
        <h1 className="text-lg font-medium">감정일기</h1>
      </header>
      <main className="p-4 space-y-3">
        {items.length === 0 && (
          <p className="text-sm">
            아직 일기가 없습니다. 챗봇에서 생성해보세요.
          </p>
        )}
        {items.map((d) => (
          <Link
            key={d.id}
            to={`/diary/${d.id}`}
            className="block border rounded p-3"
          >
            <div className="text-sm">
              {new Date(d.dateISO).toLocaleDateString()}
            </div>
            <div className="font-medium mt-1 line-clamp-1">
              {d.title || "제목 없음"}
            </div>
            <div className="text-sm mt-1 line-clamp-2">{d.summary}</div>
          </Link>
        ))}
      </main>
    </div>
  );
};
