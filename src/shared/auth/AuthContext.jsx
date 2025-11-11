// src/shared/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../../entities/auth/model";
import { tokenStore, LS } from "../lib/storage";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => LS.get("authUser", null));
  const [booted, setBooted] = useState(false);

  // 앱 부팅: LS 사용자로 즉시 통과, 토큰 있으면 /me로 동기화
  useEffect(() => {
    (async () => {
      try {
        const hasToken = !!tokenStore.get();
        if (hasToken) {
          const fresh = await authService.me(); // 실패하면 기존 LS 유지
          if (fresh) setUser(fresh);
        }
      } catch {
        // 토큰이 유효하지 않으면 정리
        authService.logout();
        setUser(null);
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  // user를 LS에 반영(로그인/로그아웃 시)
  useEffect(() => {
    if (user) LS.set("authUser", user);
    else LS.remove("authUser");
  }, [user]);

  const login = async (email, password) => {
    const { user: me } = await authService.login({ email, password });
    setUser(me || { email });
  };

  const register = async (email, password, nickname) => {
    await authService.register({ email, password, nickname });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout, booted }),
    [user, booted]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx);
