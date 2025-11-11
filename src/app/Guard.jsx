// src/app/Guard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

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
