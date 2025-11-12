// src/app/Guard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";
import { checkupStore } from "../shared/lib/checkup";

export function RequireAuth() {
  const { user, booted } = useAuth();
  const from = useLocation();
  if (!booted) return <div className="p-4">로딩…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from }} />;
  return <Outlet />;
}

export function PublicOnly() {
  const { user, booted } = useAuth();
  const from = useLocation();
  if (!booted) return <div className="p-4">로딩…</div>;
  if (user)
    return <Navigate to={from.state?.from?.pathname || "/chat"} replace />;
  return <Outlet />;
}

export function RequireCheckupDone() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return <Outlet />;

  // /checkup 페이지는 통과
  if (pathname.startsWith("/checkup")) return <Outlet />;

  const need = checkupStore.needsCheckup(user.id, 14);
  return need ? <Navigate to="/checkup" replace /> : <Outlet />;
}
