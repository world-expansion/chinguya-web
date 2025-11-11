// src/app/Layout.jsx
import { Outlet } from "react-router-dom";
import { TabBar } from "../widgets/ui/TabBar";

export default function Layout() {
  return (
    <div className="min-h-screen pb-[calc(3rem+env(safe-area-inset-bottom))]">
      <Outlet />
      <TabBar />
    </div>
  );
}
