import { useState } from "react";
import { LS } from "../shared/lib/storage";

export const MissionPage = () => {
  const today = new Date().toLocaleDateString();
  const tasks = [
    { id: 1, text: "창문을 열고 바깥 공기 한 번 들이마시기" },
    { id: 2, text: "오늘 괜찮았던 점 1가지 적어보기" },
    { id: 3, text: "편했던 노래 1곡 듣기" },
  ];
  const [done, setDone] = useState(() => LS.get("missionsDone", {}));
  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    LS.set("missionsDone", next);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="p-4 border-b">
        <h1 className="text-lg font-medium">오늘의 과제</h1>
      </header>
      <main className="p-4 space-y-3">
        <div className="text-sm">{today}</div>
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-start gap-3 border rounded p-3"
          >
            <input
              type="checkbox"
              checked={!!done[t.id]}
              onChange={() => toggle(t.id)}
              className="mt-1"
            />
            <span>{t.text}</span>
          </label>
        ))}
      </main>
    </div>
  );
};
