// src/app/Router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RequireAuth, PublicOnly } from "./Guard";
import { lazy } from "react";
import Layout from "./Layout";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const ChatPage = lazy(() =>
  import("../pages/ChatPage").then((m) => ({ default: m.ChatPage }))
);
const DiaryListPage = lazy(() =>
  import("../pages/DiaryListPage").then((m) => ({ default: m.DiaryListPage }))
);
const DiaryDetailPage = lazy(() =>
  import("../pages/DiaryDetailPage").then((m) => ({
    default: m.DiaryDetailPage,
  }))
);

const router = createBrowserRouter([
  // 공개 라우트
  {
    element: <PublicOnly />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 보호 라우트 + 루트 레이아웃(Outlet+TabBar)
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />, // ⬅ 여기서 TabBar를 포함
        children: [
          { path: "/", element: <ChatPage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/diary", element: <DiaryListPage /> },
          { path: "/diary/:id", element: <DiaryDetailPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <div className="p-4">페이지를 찾을 수 없습니다.</div> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
