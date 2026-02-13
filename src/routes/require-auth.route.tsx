import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { JSX } from "react";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed, isRefreshing, isInitializing } = useAuth();
  const location = useLocation();

  // Chỉ đợi nếu đang refresh token (isInitializing chỉ true khi cần refresh)
  // Trong trường hợp này, render children tạm thời vì user đã login trước đó
  if (isInitializing || isRefreshing) {
    // Render children vì user đã có session (chỉ đang refresh)
    // Điều này tránh màn hình trắng
    return children;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
