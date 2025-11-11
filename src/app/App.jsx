// src/App.jsx
import { AuthProvider } from "../shared/auth/AuthContext.jsx";
import { Suspense } from "react";
import AppRouter from "./AppRouter.jsx";

export const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Suspense fallback={<div className="p-4">로딩...</div>}>
          <AppRouter />
        </Suspense>
      </div>
    </AuthProvider>
  );
};
