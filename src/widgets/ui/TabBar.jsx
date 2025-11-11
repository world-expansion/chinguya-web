// src/widgets/ui/TabBar.jsx
import { NavLink } from "react-router-dom";

const item = "flex-1 flex flex-col items-center justify-center text-sm";
const active = ({ isActive }) => (isActive ? "font-bold" : "");

export const TabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="grid grid-cols-3 h-12 px-2 pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/chat" className={(p) => `${item} ${active(p)}`}>
          chat
        </NavLink>
        <NavLink to="/diary" className={(p) => `${item} ${active(p)}`}>
          diary
        </NavLink>
        <a
          href="https://docs.google.com/forms/d/xxxxxxxxxxxx/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className={item}
          aria-label="서비스 피드백 (새 창)"
        >
          서비스 피드백
        </a>
      </div>
    </nav>
  );
};
