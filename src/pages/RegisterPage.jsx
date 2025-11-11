// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

export const RegisterPage = () => {
  const { register, login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [nickname, setNickname] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErr("");
    try {
      await register(email, pw, nickname); // 가입
      await login(email, pw); // 자동 로그인
      nav("/chat", { replace: true });
    } catch (e) {
      setErr(e.message || "회원가입 실패");
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
        <div className="text-sm mb-1">닉네임</div>
        <input
          className="w-full border rounded p-3"
          type="text"
          autoComplete="nickname"
          placeholder="별명"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <div className="text-sm mb-1">비밀번호</div>
        <input
          className="w-full border rounded p-3"
          type="password"
          autoComplete="new-password"
          placeholder="최소 8자"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
        />
      </label>

      {err && <p className="text-sm">⚠ {err}</p>}
      <button className="w-full border rounded p-3" disabled={pending}>
        {pending ? "처리 중..." : "가입하고 시작하기"}
      </button>
    </form>
  );
};
