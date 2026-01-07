import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { LoginRoute } from "@/routes/login.route";
import { RequireAuth } from "@/routes/require-auth.route";
import { useAuth } from "@/hooks/use-auth.hook";
import { MessageRoute } from "@/routes/message.route";
import { InvitePage } from "@/pages/invite/invite.page";

// Redirect component for legacy /funds/:fundId route
function LegacyFundRedirect() {
  const { fundId } = useParams();
  return <Navigate to={`/chat/${fundId}`} replace />;
}

export function AppRouter() {
  const { isAuthed } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Public invite route */}
      <Route path="/invite/:fundId" element={<InvitePage />} />

      {/* Chat is now the main screen */}
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <MessageRoute />
          </RequireAuth>
        }
      />

      <Route
        path="/chat/:fundId"
        element={
          <RequireAuth>
            <MessageRoute />
          </RequireAuth>
        }
      />

      {/* Legacy routes - redirect to chat */}
      <Route
        path="/funds"
        element={
          <RequireAuth>
            <Navigate to="/chat" replace />
          </RequireAuth>
        }
      />

      <Route
        path="/funds/:fundId"
        element={
          <RequireAuth>
            <LegacyFundRedirect />
          </RequireAuth>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthed ? "/chat" : "/login"} replace />}
      />
    </Routes>
  );
}
