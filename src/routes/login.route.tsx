import { Navigate, useNavigate } from "react-router-dom";
import { FormLogin } from "@/components/elements/form/form-login.element";
import { useAuth } from "@/hooks/use-auth.hook";

export function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthed, login } = useAuth();

  // Nếu đã đăng nhập, chuyển thẳng vào app
  if (isAuthed) return <Navigate to="/chat" replace />;

  const handleLogin = (session: Parameters<typeof login>[0]) => {
    // Set flag để hiển thị loading screen khi vào app
    sessionStorage.setItem("justLoggedIn", "true");
    login(session);
    navigate("/chat", { state: { fromLogin: true } });
  };

  return <FormLogin onLogin={handleLogin} />;
}
