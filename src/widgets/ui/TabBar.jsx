// src/widgets/ui/TabBar.jsx
import { NavLink } from "react-router-dom";

const item = "flex-1 flex flex-col items-center justify-center text-sm";
const active = ({ isActive }) => (isActive ? "font-bold" : "");

export const TabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="grid grid-cols-3 h-12 px-2 pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/chat" className={(p) => `${item} ${active(p)}`}>
          대화
        </NavLink>
        <NavLink to="/diary" className={(p) => `${item} ${active(p)}`}>
          감정일기
        </NavLink>
        <NavLink to="/more" className={(p) => `${item} ${active(p)}`}>
          더보기
        </NavLink>
      </div>
    </nav>
  );
};
