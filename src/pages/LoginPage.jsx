// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";
import { checkupStore } from "../shared/lib/checkup";

export const LoginPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErr("");
    try {
      const me = await login(email, pw);
      const need = checkupStore.needsCheckup(me.id, 14);

      if (need) {
        nav("/checkup", { replace: true });
      } else {
        nav(loc.state?.from?.pathname || "/chat", { replace: true });
      }
    } catch (e) {
      setErr(e.message || "로그인 실패");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="p-4 space-y-3" onSubmit={onSubmit}>
      <label className="block">
        <div className="text-sm mb-1">이메일</div>
        <input
          className="w-full border rounded p-3"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <div className="text-sm mb-1">비밀번호</div>
        <input
          className="w-full border rounded p-3"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
      </label>

      {err && <p className="text-sm">⚠ {err}</p>}
      <button className="w-full border rounded p-3" disabled={pending}>
        {pending ? "처리 중..." : "로그인"}
      </button>
      <div className="text-sm text-center mt-2">
        계정이 없나요?{" "}
        <Link to="/register" className="underline">
          회원가입
        </Link>
      </div>
    </form>
  );
};
